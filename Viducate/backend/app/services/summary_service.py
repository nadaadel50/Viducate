import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from app.models.video_summary import VideoSummary
from app.models.segment_summary import SegmentSummary
from app.models.topic_segment import TopicSegment
from app.models.video import Video
from app.models.content_preferences import ContentPreferences
from app.ml.processors.summarization_processor import process_video_summary, process_all_segment_summaries, process_single_segment_summary
from app.models.content_preferences import ContentPreferences
from app.models.subtopics import Subtopic
from sqlalchemy.orm import joinedload
from app.ml.engines.summarization_engine import summarize_segment
import json
from app.utils.reading_time import calculate_reading_time
from app.services.network_errors import NetworkUnavailableError

logger = logging.getLogger(__name__)


class SummaryService:
    def __init__(self, db: Session):
        self.db = db

    def _resolve_language(self, user_id: int, video_id: int, video_language: str) -> str:
        pref = self.db.query(ContentPreferences).filter(
            ContentPreferences.user_id == user_id,
            ContentPreferences.video_id == video_id,
        ).first()
        if pref and pref.summary_language:
            return pref.summary_language
        return video_language

    def _check_video_belongs_to_user(self, video_id: int, user_id: int):
        video = self.db.query(Video).filter(Video.vid == video_id).first()
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Video is not ready yet. Current status: {video.processing_status}"
            )
        return video

    def get_or_generate_video_summary(self, video_id: int, user_id: int) -> dict:
        video = self._check_video_belongs_to_user(video_id, user_id)

        lang = self._resolve_language(user_id, video_id, video.language)
        existing = self.db.query(VideoSummary).filter(
            VideoSummary.video_id == video_id
        ).first()

        if existing and existing.language == lang:
            logger.info(f"[SummaryService] Cached video summary for {video_id}")
            return {
                "video_id": video_id,
                "title": video.title,
                "summary": existing.content,
                "language": existing.language,
                "created_at": existing.created_at,
                "cached": True,
                "reading_time": calculate_reading_time(existing.content),
            }

        logger.info(f"Generating new summary for video_id={video_id}")
        
        try:
            video_summary = process_video_summary(self.db, video_id, lang)

        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating summary. Please try again.",
            )

        if video_summary is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Summary generation failed.")
        return {
            "video_id": video_id,
            "title": video.title,
            "summary": video_summary.content,
            "language": video_summary.language,
            "created_at": video_summary.created_at,
            "cached": False,
            "reading_time": calculate_reading_time(video_summary.content),
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
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No segments found for this video")

        lang = self._resolve_language(user_id, video_id, video.language)
        try:
            process_all_segment_summaries(self.db, video_id, lang)
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating segment summaries. Please try again.",
            )

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
                "generation_failed": summary is None,
                "reading_time": calculate_reading_time(summary.content if summary else None),
            })

        return result
    
    def get_or_generate_single_segment_summary(self, video_id: int, segment_id: int, user_id: int) -> dict:
        video = self._check_video_belongs_to_user(video_id, user_id)

        segment = self.db.query(TopicSegment).filter(
            TopicSegment.segment_id == segment_id,
            TopicSegment.vid_id == video_id
        ).first()
        if not segment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No segments found for this video")

        lang = self._resolve_language(user_id, video_id, video.language)

        try:
            summary = process_single_segment_summary(self.db, video_id, segment_id, lang)
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating segment summary. Please try again.",
            )

        if summary is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Summary generation failed. Please try again.",
            )

        return {
            "segment_id": segment_id,
            "segment_number": segment.segment_number,
            "title": segment.title,
            "start_time": segment.start_time,
            "end_time": segment.end_time,
            "summary": summary.content,
            "language": summary.language,
            "cached": summary.created_at is not None,
            "reading_time": calculate_reading_time(summary.content),
        }
        

