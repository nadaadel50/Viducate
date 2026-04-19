import logging
from sqlalchemy.orm import Session, joinedload

from app.models.topic_segment import TopicSegment
from app.models.subtopics import Subtopic
from app.models.segment_summary import SegmentSummary
from app.models.video_summary import VideoSummary
from app.models.video import Video
from app.ml.engines.summarization_engine import summarize_segment, summarize_full_video

logger = logging.getLogger(__name__)


def process_summaries(db: Session, video_id: int, language: str) -> None:
    # 1. Load video
    video = db.query(Video).filter(Video.vid == video_id).first()
    if not video:
        raise ValueError(f"Video {video_id} not found")

    # 2. Load all segments with their subtopics eagerly
    segments = (
        db.query(TopicSegment)
        .options(joinedload(TopicSegment.subtopics))
        .filter(TopicSegment.vid_id == video_id)
        .order_by(TopicSegment.segment_number)
        .all()
    )

    if not segments:
        raise ValueError(f"No segments found for video {video_id}. Run segmentation first.")

    logger.info(f"[Summarization] Processing {len(segments)} segments for video_id={video_id}")

    segment_summaries_for_video = [] 

    for segment in segments:
        # 3. Check if summary already exists 
        existing = db.query(SegmentSummary).filter(
            SegmentSummary.segment_id == segment.segment_id
        ).first()
        if existing:
            logger.info(f"[Summarization] Segment {segment.segment_id} already summarized, skipping.")
            segment_summaries_for_video.append({
                "title": segment.title,
                "summary": existing.content
            })
            continue

        # 4. Build subtopics list for the engine
        subtopics_data = [
            {"name": st.name, "description": st.description}
            for st in segment.subtopics
            if st.description 
        ]

        if not subtopics_data:
            logger.warning(f"[Summarization] Segment {segment.segment_id} has no subtopics, using main_topic only.")

        # 5. Call LLM
        logger.info(f"[Summarization] Summarizing segment {segment.segment_number}: '{segment.title}'")
        summary_text = summarize_segment(
            segment_title=segment.title,
            main_topic=segment.main_topic or segment.title,
            subtopics=subtopics_data,
            language=language,
        )

        # 6. Save segment summary to DB
        seg_summary = SegmentSummary(
            segment_id=segment.segment_id,
            content=summary_text,
            language=language,
        )
        db.add(seg_summary)
        db.flush()  

        segment_summaries_for_video.append({
            "title": segment.title,
            "summary": summary_text,
        })

        logger.info(f"[Summarization] Segment {segment.segment_number} done.")

    # 7. Check if video summary already exists
    existing_video_summary = db.query(VideoSummary).filter(
        VideoSummary.video_id == video_id
    ).first()

    if not existing_video_summary:
        logger.info(f"[Summarization] Generating full video summary for video_id={video_id}")
        full_summary_text = summarize_full_video(
            video_title=video.title,
            segment_summaries=segment_summaries_for_video,
            language=language,
        )
        video_summary = VideoSummary(
            video_id=video_id,
            content=full_summary_text,
            language=language,
        )
        db.add(video_summary)


    db.commit()
    logger.info(f"[Summarization] All summaries saved for video_id={video_id}")