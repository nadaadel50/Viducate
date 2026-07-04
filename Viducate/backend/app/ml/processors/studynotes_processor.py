import logging
from sqlalchemy.orm import Session, joinedload

from app.models.topic_segment import TopicSegment
from app.models.video import Video
from app.models.studynotes import VideoStudyNotes, SegmentStudyNotes
from app.ml.engines.studynotes_engine import generate_segment_studynotes, generate_video_studynotes

from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_studynotes,
)
from app.services.quality_retry import run_with_quality_retry

logger = logging.getLogger(__name__)

def process_single_segment_studynotes(db: Session, video_id: int, segment_id: int, language: str) -> SegmentStudyNotes | None:
    existing = (
        db.query(SegmentStudyNotes)
        .filter(SegmentStudyNotes.segment_id == segment_id)
        .first()
    )

    if existing:
        if existing.language == language:
            logger.info(
                f"[StudyNotesProcessor] Segment {segment_id} cache hit (lang={language})"
            )
            return existing
        else:
            logger.info(
                f"[StudyNotesProcessor] Segment {segment_id} language changed "
                f"({existing.language} → {language}), regenerating."
            )
            db.delete(existing)
            db.flush()

    segment = (
        db.query(TopicSegment)
        .options(joinedload(TopicSegment.subtopics))
        .filter(
            TopicSegment.segment_id == segment_id,
            TopicSegment.vid_id == video_id,
        )
        .first()
    )
    if not segment:
        raise ValueError(f"Segment {segment_id} not found for video {video_id}")

    subtopics_data = [
        {"name": st.name, "description": st.description or ""}
        for st in segment.subtopics
        if st.name
    ]

    
    #  Generate with quality validation 
    content, quality = run_with_quality_retry(
        generator_fn=lambda seg=segment, subs=subtopics_data: (
            generate_segment_studynotes(
                segment_title=seg.title,
                main_topic=seg.main_topic or seg.title,
                subtopics=subs,
                language=language,
            )
        ),
        score_fn=lambda result, seg=segment: score_feature_vs_segmentation(
            feature_text=extract_text_from_studynotes(result),
            segment=seg,
            content_type="studynotes",
        ),
        label=f"studynotes segment_id={segment_id}",
    )
    #  End quality validation 
 
    if content is None:
        logger.warning(
            f"[StudyNotesProcessor] Segment {segment_id} generation failed "
            f"— not caching"
        )
        return None
 
 
    logger.info(
        f"[StudyNotesProcessor] Segment {segment_id} "
        f"quality_score={segment.quality_score:.4f} "
        f"flag={segment.quality_flag} "
        f"retries={quality.get('retries', 0)}"
    )
 
    if quality.get("flag"):
        logger.warning(
            f"[StudyNotesProcessor] Segment {segment_id} study notes below "
            f"threshold (score={quality['score']:.4f}) — saving best attempt"
        )
   
    new_notes = SegmentStudyNotes(
        segment_id=segment_id,
        content=content,
        language=language,
    )
    db.add(new_notes)
    db.commit()
    db.refresh(new_notes)

    logger.info(
        f"[StudyNotesProcessor] Segment {segment_id} notes saved (lang={language})."
    )
    return new_notes


def process_all_segment_studynotes(db: Session, video_id: int, language: str) -> list[dict]:
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
        raise ValueError(f"No segments found for video {video_id}")

    results = []
    for segment in segments:
        notes = process_single_segment_studynotes(
            db, video_id, segment.segment_id, language
        )
        if notes:
            results.append(
                {
                    "segment_number": segment.segment_number,
                    "title": segment.title,
                    "main_topic": segment.main_topic or segment.title,
                    "subtopics": [
                        {"name": st.name, "description": st.description or ""}
                        for st in segment.subtopics
                        if st.name
                    ],
                    "key_points": [],   
                }
            )

    return results


def process_video_studynotes(db: Session, video_id: int, language: str) -> VideoStudyNotes | None:
    video = db.query(Video).filter(Video.vid == video_id).first()
    if not video:
        raise ValueError(f"Video {video_id} not found")

    existing = (
        db.query(VideoStudyNotes)
        .filter(VideoStudyNotes.video_id == video_id)
        .first()
    )

    if existing:
        if existing.language == language:
            logger.info(
                f"[StudyNotesProcessor] Video {video_id} cache hit (lang={language})"
            )
            return existing
        else:
            logger.info(
                f"[StudyNotesProcessor] Video {video_id} language changed "
                f"({existing.language} → {language}), regenerating."
            )
            db.delete(existing)
            db.flush()
            db.commit()

    segments = (
        db.query(TopicSegment)
        .options(
            joinedload(TopicSegment.subtopics),
            joinedload(TopicSegment.keypoints),
        )
        .filter(TopicSegment.vid_id == video_id)
        .order_by(TopicSegment.segment_number)
        .all()
    )
    if not segments:
        raise ValueError(f"No segments found for video {video_id}")

    segments_data = [
        {
            "segment_number": seg.segment_number,
            "title": seg.title,
            "main_topic": seg.main_topic or seg.title,
            "subtopics": [
                {"name": st.name, "description": st.description or ""}
                for st in seg.subtopics
                if st.name
            ],
            "key_points": [kp.description for kp in seg.keypoints if kp.description],
        }
        for seg in segments
    ]

    content, _ = run_with_quality_retry(
        generator_fn=lambda: generate_video_studynotes(
            video_title=video.title,
            segments=segments_data,
            language=language,
        ),
        score_fn=lambda result: {"score": 1.0, "flag": False, "threshold": 0.28},
        label=f"video_studynotes video_id={video_id}",
    )

    if content is None:
        logger.warning(
            f"[StudyNotesProcessor] Video {video_id} generation failed, NOT caching."
        )
        return None

    new_notes = VideoStudyNotes(
        video_id=video_id,
        content=content,
        language=language,
    )
    db.add(new_notes)
    db.commit()
    db.refresh(new_notes)

    logger.info(
        f"[StudyNotesProcessor] Video {video_id} notes saved (lang={language})."
    )
    return new_notes