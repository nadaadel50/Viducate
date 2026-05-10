import logging
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.video import Video
from app.models.topic_segment import TopicSegment
from app.models.flashcard import Flashcard
from app.repositories.flashcard_repository import FlashcardRepository
from app.ml.processors.flashcard_processor import CARDS_PER_SEGMENT, _resolve_language, process_flashcards
from app.ml.engines.flashcard_engine import generate_flashcards_for_segment

logger = logging.getLogger(__name__)


def _format_seconds(seconds: int) -> str:
    """
    Converts raw seconds to HH:MM:SS string.

    """
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"


def _build_segment_dict(seg: TopicSegment, cards: list) -> dict:
    """
    Builds the segment response dict including start_time and end_time.
    Both raw seconds (for redirecting) and formatted string (for display)
    are included so the frontend can use whichever it needs.
    """
    return {
        "segment_id":        seg.segment_id,
        "segment_number":    seg.segment_number,
        "title":             seg.title,
        "start_time":        seg.start_time,                  
        "end_time":          seg.end_time,                      
        "start_time_label":  _format_seconds(seg.start_time),   
        "end_time_label":    _format_seconds(seg.end_time),      
        "flashcards": [
            {
                "flashcard_id": c.flashcard_id,
                "segment_id":   c.segment_id,
                "video_id":     c.video_id,
                "question":     c.question,
                "answer":       c.answer,
                "language":     c.language,
                "difficulty":   c.difficulty,
                "created_at":   c.created_at,
                "segment_start_time":  seg.start_time,
                "segment_end_time":    seg.end_time,
                "segment_start_label": _format_seconds(seg.start_time),
            }
        for c in cards
        ],
    }


class FlashcardService:
    def __init__(self, db: Session):
        self.db   = db
        self.repo = FlashcardRepository(db)

    # ─────────────────────────────────────────────────────────────────────────
    # INTERNAL HELPERS
    # ─────────────────────────────────────────────────────────────────────────
    def _get_video_or_404(self, video_id: int) -> Video:
        video = self.db.query(Video).filter(Video.vid == video_id).first()
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

        return video

    def _check_ownership(self, video: Video, user_id: int):
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    def _check_processing_complete(self, video: Video):
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Video is not ready yet. "
                    f"Current status: {video.processing_status}. "
                    f"Please wait for processing to complete."
                ),
            )

    def _get_ordered_segments(self, video_id: int) -> list:
        return (
            self.db.query(TopicSegment)
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

    # ─────────────────────────────────────────────────────────────────────────
    # PUBLIC METHODS
    # ─────────────────────────────────────────────────────────────────────────
    def get_or_generate(self, video_id: int, user_id: int) -> dict:
        """
        Returns flashcards for the video grouped by segment.
        Each segment includes start_time and end_time in seconds.
        Each flashcard also carries segment_start_time for easy frontend redirect.
        Generates with Groq on first call; returns cached on subsequent calls.
        """
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        existing_count = self.repo.count_by_video(video_id)
        cached = existing_count > 0

        if not cached:
            logger.info(f"[FlashcardService] Cache miss — generating for video_id={video_id}")
            process_flashcards(self.db, video_id, user_id)
        else:
            logger.info(
                f"[FlashcardService] Cache hit — {existing_count} cards for video_id={video_id}"
            )

        segments = self._get_ordered_segments(video_id)

        segments_data = []
        total = 0
        for seg in segments:
            cards = self.repo.get_by_segment(seg.segment_id)
            total += len(cards)
            segments_data.append(_build_segment_dict(seg, cards))

        return {
            "video_id":         video_id,
            "total_flashcards": total,
            "cached":           cached,
            "segments":         segments_data,
        }

    def regenerate(self, video_id: int, user_id: int) -> dict:
        """
        Deletes existing flashcards and regenerates fresh ones.
        Useful when user changes language preference.
        """
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        deleted = self.repo.delete_by_video(video_id)
        logger.info(f"[FlashcardService] Deleted {deleted} old cards for video_id={video_id}")

        return self.get_or_generate(video_id, user_id)

    def get_by_segment(self, video_id: int, segment_id: int, user_id: int) -> dict:
        """
        Returns flashcards for a single segment including start_time and end_time.
        Frontend can use start_time to seek the video player to that timestamp.
        """
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)

        seg = self.db.query(TopicSegment).filter(
            TopicSegment.segment_id == segment_id,
            TopicSegment.vid_id     == video_id,
        ).first()

        if not seg:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Segment not found")

        cards = self.repo.get_by_segment(segment_id)
        return _build_segment_dict(seg, cards)
    


    def get_or_generate_segment(self, video_id: int, segment_id: int, user_id: int) -> dict:
        """
        Returns flashcards for a single segment.
        Generates them if not cached yet.
        """
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        segment = (
            self.db.query(TopicSegment)
            .options(joinedload(TopicSegment.subtopics))
            .filter(
                TopicSegment.segment_id == segment_id,
                TopicSegment.vid_id == video_id,
            )
            .first()
        )
        if not segment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Segment {segment_id} not found for video {video_id}",
            )

        # check cache
        existing_cards = self.repo.get_by_segment(segment_id)
        if existing_cards:
            logger.info(
                f"[FlashcardService] Cache hit — {len(existing_cards)} cards "
                f"for segment_id={segment_id}"
            )
            return _build_segment_dict(segment, existing_cards)

        # generate
        language = _resolve_language(self.db, user_id, video_id, video.language or "en")

        subtopics_data = [
            {"name": st.name, "description": st.description}
            for st in segment.subtopics
            if st.name
        ]

        cards = generate_flashcards_for_segment(
            segment_title=segment.title,
            main_topic=segment.main_topic or segment.title,
            subtopics=subtopics_data,
            language=language,
            num_cards=CARDS_PER_SEGMENT,
        )

        if not cards:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Failed to generate flashcards for segment {segment_id}",
            )

        for card in cards:
            self.db.add(Flashcard(
                segment_id=segment_id,
                video_id=video_id,
                question=card["question"],
                answer=card["answer"],
                language=language,
                difficulty=card.get("difficulty", "medium"),
            ))
        self.db.commit()

        logger.info(
            f"[FlashcardService] Generated {len(cards)} cards "
            f"for segment_id={segment_id} in '{language}'"
        )

        return _build_segment_dict(segment, self.repo.get_by_segment(segment_id))
