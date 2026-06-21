import logging
import json
from sqlalchemy.orm import Session, joinedload

from app.models.topic_segment import TopicSegment
from app.models.segment_summary import SegmentSummary
from app.models.video_summary import VideoSummary
from app.models.video import Video
from app.ml.engines.summarization_engine import summarize_segment, summarize_full_video

from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_summary,
    build_segment_reference_text,
)
from app.services.quality_retry import run_with_quality_retry

logger = logging.getLogger(__name__)
FAILED_PLACEHOLDER = "Summary generation failed."

#*****************************************
def _load_segment(db: Session, segment_id: int, video_id: int) -> TopicSegment | None:
    return (
        db.query(TopicSegment)
        .options(joinedload(TopicSegment.subtopics))
        .filter(
            TopicSegment.segment_id == segment_id,
            TopicSegment.vid_id     == video_id,
        )
        .first()
    )

#********************************************


# def _safe_summarize_segment(segment_title, main_topic, subtopics, language):
#     try:
#         result = summarize_segment(segment_title, main_topic, subtopics, language)
#         if not isinstance(result, dict) or "conclusion" not in result:
#             raise ValueError("Invalid response structure from engine")
#         return result, True
#     except Exception as e:
#         logger.error(f"[Summarization] Engine failed for '{segment_title}': {e}")
#         return None, False 


# def _safe_summarize_video(video_title, segment_summaries, language):
#     try:
#         result = summarize_full_video(video_title, segment_summaries, language)
#         if not isinstance(result, dict) or "conclusion" not in result:
#             raise ValueError("Invalid response structure from engine")
#         return result, True
#     except Exception as e:
#         logger.error(f"[Summarization] Full video engine failed for '{video_title}': {e}")
#         return None, False


def process_single_segment_summary(
    db: Session, video_id: int, segment_id: int, language: str) -> SegmentSummary | None:
    
    existing = db.query(SegmentSummary).filter(
        SegmentSummary.segment_id == segment_id
    ).first()

    if existing:
        if existing.language == language:
            logger.info(f"[Summarization] Segment {segment_id} cache hit (lang={language})")
            return existing
        else:
            logger.info(
                f"[Summarization] Segment {segment_id} language changed "
                f"({existing.language} → {language}), regenerating."
            )
            db.delete(existing)
            db.flush()

    #********************************************
    segment = _load_segment(db, segment_id, video_id)
    #********************************************

    if not segment:
        raise ValueError(f"Segment {segment_id} not found for video {video_id}")

    subtopics_data = [
        {"name": st.name, "description": st.description}
        for st in segment.subtopics
        if st.description
    ]

    #********************************************
    # content, success = _safe_summarize_segment(
    #     segment_title=segment.title,
    #     main_topic=segment.main_topic or segment.title,
    #     subtopics=subtopics_data,
    #     language=language,
    # )

    # if not success or content is None:
    #     logger.warning(f"[Summarization] Segment {segment_id} generation failed, NOT caching.")
    #     return None
   
    # --------------------------------Generate with quality validation vs stored segmentation--------------------------------
    content, quality = run_with_quality_retry(
        generator_fn=lambda seg=segment, subs=subtopics_data: summarize_segment(
            seg.title,
            seg.main_topic or seg.title,
            subs,
            language,
        ),
        score_fn=lambda result, seg=segment: score_feature_vs_segmentation(
            feature_text=extract_text_from_summary(result),
            segment=seg,
            content_type="summary",
        ),
        label=f"summary segment_id={segment_id}",
    )
    # ── End quality validation ────────────────────────────────────────────────
 
    if content is None:
        logger.warning(
            f"[Summarization] Segment {segment_id} generation failed — not caching"
        )
        return None
 
    # Persist quality on the segment row
    # current_score = segment.quality_score or 0.0
    # segment.quality_score = max(current_score, quality.get("score", 0.0))
    # segment.quality_flag  = bool(quality.get("flag", False))
    # segment.retry_count   = (segment.retry_count or 0) + quality.get("retries", 0)
    # db.flush()
 
    logger.info(
        f"[Summarization] Segment {segment_id} "
        f"quality_score={segment.quality_score:.4f} "
        f"flag={segment.quality_flag} "
        f"retries={quality.get('retries', 0)}"
    )
 
    if quality.get("flag"):
        logger.warning(
            f"[Summarization] Segment {segment_id} summary below threshold "
            f"(score={quality['score']:.4f}) — saving best attempt"
        )


    #********************************************
    new_summary = SegmentSummary(
        segment_id=segment_id,
        content=content,
        language=language,
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)

    logger.info(f"[Summarization] Segment {segment_id} saved (lang={language}).")
    return new_summary


def process_all_segment_summaries(
    db: Session, video_id: int, language: str) -> list:
   
    video = db.query(Video).filter(Video.vid == video_id).first()
    if not video:
        raise ValueError(f"Video {video_id} not found")

    segments = (
        db.query(TopicSegment)
        .options(joinedload(TopicSegment.subtopics))
        .filter(TopicSegment.vid_id == video_id)
        .order_by(TopicSegment.segment_number)
        .all()
    )
    if not segments:
        raise ValueError(f"No segments for video {video_id}")

    segment_summaries_for_video = []

    for segment in segments:
        existing = db.query(SegmentSummary).filter(
            SegmentSummary.segment_id == segment.segment_id
        ).first()

        if existing:
            if existing.language == language:
                logger.info(
                    f"[Summarization] Segment {segment.segment_id} cached "
                    f"(lang={language}), skipping."
                )
                segment_summaries_for_video.append({
                    "title": segment.title,
                    "summary": existing.content,
                    "subtopics": [
                        {"name": st.name} for st in segment.subtopics
                    ],
                })
                continue
            else:
                logger.info(
                    f"[Summarization] Segment {segment.segment_id} wrong language "
                    f"({existing.language} → {language}), deleting old."
                )
                db.delete(existing)
                db.flush()

        subtopics_data = [
            {"name": st.name, "description": st.description}
            for st in segment.subtopics
            if st.description
        ]

        
        logger.info(
            f"[Summarization] Generating segment {segment.segment_number}: '{segment.title}'"
        )
        #********************************************
        # content, success = _safe_summarize_segment(
        #     segment_title=segment.title,
        #     main_topic=segment.main_topic or segment.title,
        #     subtopics=subtopics_data,
        #     language=language,
        # )

        # if not success or content is None:

        #     logger.warning(
        #         f"[Summarization] Segment {segment.segment_id} failed, "
        #         f"skipping (will retry next request)."
        #     )
        #     continue 

        #validation
        content, quality = run_with_quality_retry(
            generator_fn=lambda seg=segment, subs=subtopics_data: summarize_segment(
                seg.title,
                seg.main_topic or seg.title,
                subs,
                language,
            ),
            score_fn=lambda result, seg=segment: score_feature_vs_segmentation(
                feature_text=extract_text_from_summary(result),
                segment=seg,
                content_type="summary",
            ),
            label=f"summary segment_id={segment.segment_id}",
        )
        # ── End quality validation ─────────────────────────────────────────────
 
        if content is None:
            logger.warning(
                f"[Summarization] Segment {segment.segment_id} failed — skipping"
            )
            continue
 
        # Persist quality
        # current_score = segment.quality_score or 0.0
        # segment.quality_score = max(current_score, quality.get("score", 0.0))
        # segment.quality_flag  = bool(quality.get("flag", False))
        # segment.retry_count   = (segment.retry_count or 0) + quality.get("retries", 0)
 
        logger.info(
            f"[Summarization] Segment {segment.segment_id} "
            f"quality_score={segment.quality_score:.4f} "
            f"flag={segment.quality_flag}"
        )

        #********************************************

        new_summary = SegmentSummary(
            segment_id=segment.segment_id,
            content=content,
            language=language,
        )
        db.add(new_summary)
        db.flush()

        segment_summaries_for_video.append({
            "title": segment.title,
            "summary": content,
            "subtopics": [{"name": st.name} for st in segment.subtopics],
        })

        logger.info(f"[Summarization] Segment {segment.segment_number} done.")

    db.commit()
    logger.info(f"[Summarization] All segments processed for video {video_id}")
    return segment_summaries_for_video


def process_video_summary(
    db: Session, video_id: int, language: str) -> VideoSummary | None:
    video = db.query(Video).filter(Video.vid == video_id).first()
    if not video:
        raise ValueError(f"Video {video_id} not found")

    existing = db.query(VideoSummary).filter(
        VideoSummary.video_id == video_id
    ).first()

    if existing:
        if existing.language == language:
            logger.info(f"[Summarization] Video summary cached (lang={language})")
            return existing
        else:
            logger.info(
                f"[Summarization] Video summary language changed "
                f"({existing.language} → {language}), regenerating."
            )
            db.delete(existing)
            db.flush()
            db.commit()

    segment_summaries = process_all_segment_summaries(db, video_id, language)

    if not segment_summaries:
        logger.warning(
            f"[Summarization] No segment summaries available for video {video_id}, "
            f"cannot generate video summary."
        )
        return None
    
    #********************************************
    # content, success = _safe_summarize_video(
    #     video_title=video.title,
    #     segment_summaries=segment_summaries,
    #     language=language,
    # )

    # if not success or content is None:
    #     # Do NOT save — next call will retry
    #     logger.warning(
    #         f"[Summarization] Video summary generation failed for video {video_id}, "
    #         f"NOT caching."
    #     )
    #     return None

    #validation
    content, _ = run_with_quality_retry(
        generator_fn=lambda: summarize_full_video(
            video.title, segment_summaries, language
        ),
        score_fn=lambda result: {"score": 1.0, "flag": False, "threshold": 0.30},
        label=f"video_summary video_id={video_id}",
    )
 
    if content is None:
        logger.warning(
            f"[Summarization] Video summary generation failed — not caching"
        )
        return None
    #********************************************
    video_summary = VideoSummary(
        video_id=video_id,
        content=content,
        language=language,
    )
    db.add(video_summary)
    db.commit()
    db.refresh(video_summary)

    logger.info(f"[Summarization] Video summary saved for video {video_id}")
    return video_summary


def process_summaries(db: Session, video_id: int, language: str) -> None:
    """Backward-compatible entry point for processing pipeline."""
    process_all_segment_summaries(db, video_id, language)
    process_video_summary(db, video_id, language)