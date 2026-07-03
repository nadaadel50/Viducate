import logging
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.video import Video
from app.models.topic_segment import TopicSegment
from app.models.studynotes import VideoStudyNotes, SegmentStudyNotes
from app.models.content_preferences import ContentPreferences
from app.ml.processors.studynotes_processor import process_video_studynotes,process_single_segment_studynotes
from app.utils.reading_time import calculate_reading_time
from app.services.network_errors import NetworkUnavailableError

logger = logging.getLogger(__name__)


class StudyNotesService:
    def __init__(self, db: Session):
        self.db = db

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

    def _resolve_language(self, user_id: int, video_id: int, video_language: str) -> str:
        pref = (
            self.db.query(ContentPreferences)
            .filter(
                ContentPreferences.user_id == user_id,
                ContentPreferences.video_id == video_id,
            )
            .first()
        )
        if pref and pref.summary_language:
            logger.info(
                f"[StudyNotesService] Language from preference: {pref.summary_language}"
            )
            return pref.summary_language
        resolved = video_language or "en"
        logger.info(f"[StudyNotesService] Language fallback to video: {resolved}")
        return resolved

    def get_or_generate_video_studynotes(self, video_id: int, user_id: int) -> dict:
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        language = self._resolve_language(user_id, video_id, video.language or "en")

        existing = (
            self.db.query(VideoStudyNotes)
            .filter(VideoStudyNotes.video_id == video_id)
            .first()
        )
        if existing and existing.language == language:
            logger.info(
                f"[StudyNotesService] Cache hit for video_id={video_id}"
            )
            return {
                "video_id": video_id,
                "language": existing.language,
                "cached": True,
                "study_notes": existing.content,
                "created_at": existing.created_at,
                "reading_time": calculate_reading_time(existing.content),
            }

        logger.info(
            f"[StudyNotesService] Generating video notes for video_id={video_id}"
        )
        try:
            notes = process_video_studynotes(self.db, video_id, language)
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating study notes. Please try again.",
            )

        if notes is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Study notes generation failed. Please try again.",
            )

        return {
            "video_id": video_id,
            "language": notes.language,
            "cached": False,
            "study_notes": notes.content,
            "created_at": notes.created_at,
            "reading_time": calculate_reading_time(notes.content),
        }

    def regenerate_video_studynotes(self, video_id: int, user_id: int) -> dict:
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        deleted = (
            self.db.query(VideoStudyNotes)
            .filter(VideoStudyNotes.video_id == video_id)
            .delete()
        )
        self.db.commit()
        logger.info(
            f"[StudyNotesService] Deleted {deleted} cached notes for video_id={video_id}"
        )

        return self.get_or_generate_video_studynotes(video_id, user_id)

    def get_or_generate_segment_studynotes(
        self, video_id: int, segment_id: int, user_id: int) -> dict:
        
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

        language = self._resolve_language(user_id, video_id, video.language or "en")

        try:
            notes = process_single_segment_studynotes(
            self.db, video_id, segment_id, language
        )
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating segment study notes. Please try again.",
            )

        if notes is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Study notes generation failed. Please try again.",
            )

        return {
            "segment_id": segment_id,
            "segment_number": segment.segment_number,
            "title": segment.title,
            "start_time": segment.start_time,
            "end_time": segment.end_time,
            "language": notes.language,
            "study_notes": notes.content,
            "generation_failed": False,
            "reading_time": calculate_reading_time(notes.content),
        }