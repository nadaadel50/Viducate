import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.video_summary import VideoSummary
from app.models.segment_summary import SegmentSummary
from app.models.topic_segment import TopicSegment
from app.models.video import Video
from app.ml.processors.summarization_processor import process_summaries

logger = logging.getLogger(__name__)


class SummaryService:
    def __init__(self, db: Session):
        self.db = db

    def _check_video_belongs_to_user(self, video_id: int, user_id: int):
        video = self.db.query(Video).filter(Video.vid == video_id).first()
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=400,
                detail=f"Video is not ready yet. Current status: {video.processing_status}"
            )
        return video

    def get_or_generate_video_summary(self, video_id: int, user_id: int) -> dict:
        video = self._check_video_belongs_to_user(video_id, user_id)

        existing = self.db.query(VideoSummary).filter(
            VideoSummary.video_id == video_id
        ).first()

        if existing:
            logger.info(f"Returning cached video summary for video_id={video_id}")
            return {
                "video_id": video_id,
                "summary": existing.content,
                "language": existing.language,
                "created_at": existing.created_at,
                "cached": True
            }

        # Generate
        logger.info(f"Generating new summary for video_id={video_id}")
        process_summaries(self.db, video_id, video.language)

        new_summary = self.db.query(VideoSummary).filter(
            VideoSummary.video_id == video_id
        ).first()

        return {
            "video_id": video_id,
            "summary": new_summary.content,
            "language": new_summary.language,
            "created_at": new_summary.created_at,
            "cached": False
        }

    def get_or_generate_segment_summaries(self, video_id: int, user_id: int) -> list:
        video = self._check_video_belongs_to_user(video_id, user_id)

        segments = (
            self.db.query(TopicSegment)
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

        if not segments:
            raise HTTPException(status_code=404, detail="No segments found for this video")

        # Check if summaries already exist
        first_summary = self.db.query(SegmentSummary).filter(
            SegmentSummary.segment_id == segments[0].segment_id
        ).first()

        if not first_summary:
            logger.info(f"Generating segment summaries for video_id={video_id}")
            process_summaries(self.db, video_id, video.language)

        # Fetch and return all
        result = []
        for seg in segments:
            summary = self.db.query(SegmentSummary).filter(
                SegmentSummary.segment_id == seg.segment_id
            ).first()
            result.append({
                "segment_id": seg.segment_id,
                "segment_number": seg.segment_number,
                "title": seg.title,
                "start_time": seg.start_time,
                "end_time": seg.end_time,
                "summary": summary.content if summary else None,
                "language": summary.language if summary else None,
            })

        return result