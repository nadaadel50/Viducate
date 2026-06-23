import logging
import time
from sqlalchemy.orm import Session, joinedload

from app.models.topic_segment import TopicSegment
from app.models.flashcard import Flashcard
from app.models.video import Video
from app.models.content_preferences import ContentPreferences
from app.ml.engines.flashcard_engine import generate_flashcards_for_segment

from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_flashcards,
)
from app.services.quality_retry import run_with_quality_retry

logger = logging.getLogger(__name__)

# Cards generated per segment — keep low to save tokens
CARDS_PER_SEGMENT = 3

# Seconds to wait between Groq calls to avoid rate limiting
DELAY_BETWEEN_SEGMENTS = 5


def _resolve_language(db: Session, user_id: int, video_id: int, video_language: str) -> str:
    """
    Priority order:
    1. User's flashcard_language preference for THIS specific video
    2. The video's own language
    3. Default "en"

    BUG FIX: Must filter by BOTH user_id AND video_id.
    Previously only filtered by user_id, so preferences from
    a different video could bleed in.
    """
    pref = (
        db.query(ContentPreferences)
        .filter(
            ContentPreferences.user_id == user_id,
            ContentPreferences.video_id == video_id,   # ← was missing before
        )
        .first()
    )

    if pref and pref.flashcard_language:
        resolved = pref.flashcard_language
        logger.info(
            f"[FlashcardProcessor] Language resolved from user preference: "
            f"'{resolved}' (user_id={user_id}, video_id={video_id})"
        )
        return resolved

    resolved = video_language or "en"
    logger.info(
        f"[FlashcardProcessor] No flashcard language preference set — "
        f"falling back to video language: '{resolved}'"
    )
    return resolved


def _cards_language_matches(db: Session, video_id: int, expected_language: str) -> bool:
    """
    Checks if the already-cached flashcards are in the correct language.
    Returns False if they were generated in a different language,
    meaning we need to regenerate even though cards exist.
    """
    sample = (
        db.query(Flashcard.language)
        .filter(Flashcard.video_id == video_id)
        .first()
    )
    if sample is None:
        return True  # No cards yet — not a mismatch

    cached_language = sample[0]
    match = (cached_language == expected_language)

    if not match:
        logger.warning(
            f"[FlashcardProcessor] Language mismatch detected! "
            f"Cached cards are in '{cached_language}' but user wants '{expected_language}'. "
            f"Will regenerate."
        )
    return match


def process_flashcards(db: Session, video_id: int, user_id: int) -> None:
    """
    Generates and saves flashcards for all segments of a video.

    Language logic:
    - Reads user's flashcard_language preference for THIS video specifically.
    - Falls back to the video's language if no preference is set.
    - If cached cards exist but in the WRONG language, deletes and regenerates them.

    Rate limiting:
    - Waits DELAY_BETWEEN_SEGMENTS seconds between each Groq call.
    """
    video = db.query(Video).filter(Video.vid == video_id).first()
    if not video:
        raise ValueError(f"Video {video_id} not found")

    # ── Resolve the correct language for this user + video ───────────────────
    language = _resolve_language(db, user_id, video_id, video.language or "en")
    
    db.expire_all()
    # ── If cached cards exist in wrong language → delete them all ────────────
    if not _cards_language_matches(db, video_id, language):
        deleted = (
            db.query(Flashcard)
            .filter(Flashcard.video_id == video_id)
            .delete()
        )
        db.flush()
        logger.info(
            f"[FlashcardProcessor] Deleted {deleted} mismatched-language cards "
            f"for video_id={video_id}. Will regenerate in '{language}'."
        )

    # ── Load segments ────────────────────────────────────────────────────────
    segments = (
        db.query(TopicSegment)
        .options(joinedload(TopicSegment.subtopics))
        .filter(TopicSegment.vid_id == video_id)
        .order_by(TopicSegment.segment_number)
        .all()
    )

    if not segments:
        raise ValueError(
            f"No segments found for video {video_id}. "
            "Make sure the processing pipeline has completed first."
        )

    logger.info(
        f"[FlashcardProcessor] Starting | video_id={video_id} | "
        f"segments={len(segments)} | lang={language}"
    )

    for idx, segment in enumerate(segments):
        # ── Check cache (per segment) ─────────────────────────────────────────
        existing_count = (
            db.query(Flashcard)
            .filter(Flashcard.segment_id == segment.segment_id)
            .count()
        )
        if existing_count > 0:
            logger.info(
                f"[FlashcardProcessor] Segment {segment.segment_number} "
                f"(id={segment.segment_id}) already has {existing_count} cards "
                f"in correct language '{language}' — skipping."
            )
            continue

        # ── Build subtopic list (names only to minimize tokens) ───────────────
        subtopics_data = [
            {"name": st.name, "description": st.description}
            for st in segment.subtopics
            if st.name
        ]

        logger.info(
            f"[FlashcardProcessor] Generating for segment {segment.segment_number}: "
            f"'{segment.title}' | subtopics={len(subtopics_data)} | lang={language}"
        )



         # ── Call engine with quality validation ───────────────────────────────
        # REPLACE WITH (capture everything explicitly, add debug print):
        _seg_id    = segment.segment_id
        _seg_title = segment.title
        _seg_topic = segment.main_topic or segment.title
        _seg_ref   = segment  # explicit capture

        logger.info(
            f"[FlashcardProcessor] About to validate segment_id={_seg_id} "
            f"title='{_seg_title}'"
        )

        cards, quality = run_with_quality_retry(
            generator_fn=lambda seg=_seg_ref, subs=subtopics_data: (
                generate_flashcards_for_segment(
                    segment_title=seg.title,
                    main_topic=seg.main_topic or seg.title,
                    subtopics=subs,
                    language=language,
                    num_cards=CARDS_PER_SEGMENT,
                )
            ),
            score_fn=lambda result, seg=_seg_ref: score_feature_vs_segmentation(
                feature_text=extract_text_from_flashcards(result),
                segment=seg,
                content_type="flashcard",
            ),
            label=f"flashcard segment_id={_seg_id}",
        )
        # ── End quality validation ────────────────────────────────────────────

        if not cards:
            logger.warning(
                f"[FlashcardProcessor] No cards returned for segment "
                f"{segment.segment_number} '{segment.title}' — skipping"
            )
            continue
 
        # ── Persist quality on the segment row ────────────────────────────────
        # Take the maximum of any existing score (segmentation may have already
        # written a score; we keep the higher of the two).
        # ── Persist quality on the segment row ───────────────────────────────────
        # current_score = segment.quality_score or 0.0
        # new_score     = quality.get("score", 0.0)
        # segment.quality_score = max(current_score, new_score)
        # segment.quality_flag  = bool(quality.get("flag", False))
        # segment.retry_count   = (segment.retry_count or 0) + quality.get("retries", 0)

        logger.info(
            f"[FlashcardProcessor] VALIDATION COMPLETE | segment_id={segment.segment_id} | "
            f"final_score={quality.get('score', 0.0):.4f} | "
            f"flag={quality.get('flag')} | "
            f"retries_used={quality.get('retries', 0)}"
        )
        if quality.get("flag"):
            logger.warning(
                f"[FlashcardProcessor]  Flashcard quality BELOW threshold "
                f"(score={quality['score']:.4f} < {quality['threshold']}) "
                f"after {quality.get('retries', 0) + 1} attempts — saving best result"
            )
        else:
            logger.info(
                f"[FlashcardProcessor]  Flashcard quality PASSED "
                f"(score={quality['score']:.4f}) in {quality.get('retries', 0) + 1} attempt(s)"
            )

        for card in cards:
            db.add(Flashcard(
                segment_id=segment.segment_id,
                video_id=video_id,
                question=card["question"],
                answer=card["answer"],
                language=language,
                difficulty=card.get("difficulty", "medium"),
            ))
        db.flush()
        logger.info(
            f"[FlashcardProcessor] Saved {len(cards)} cards for "
            f"segment {segment.segment_number} in '{language}'"
        )

        # ── Rate limit protection ─────────────────────────────────────────────
        if idx < len(segments) - 1:
            logger.debug(
                f"[FlashcardProcessor] Waiting {DELAY_BETWEEN_SEGMENTS}s "
                f"before next segment..."
            )
            time.sleep(DELAY_BETWEEN_SEGMENTS)

    db.commit()
    logger.info(f"[FlashcardProcessor] All done for video_id={video_id} in '{language}'")