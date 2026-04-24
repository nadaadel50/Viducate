import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.video import Video
from app.models.topic_segment import TopicSegment
from app.models.flashcard import Flashcard
from app.repositories.flashcard_repository import FlashcardRepository
from app.ml.processors.flashcard_processor import process_flashcards

logger = logging.getLogger(__name__)


class FlashcardService:
    def __init__(self, db: Session):
        self.db   = db
        self.repo = FlashcardRepository(db)

    # ─────────────────────────────────────────────
    # INTERNAL HELPERS
    # ─────────────────────────────────────────────
    def _get_video_or_404(self, video_id: int) -> Video:
        video = self.db.query(Video).filter(Video.vid == video_id).first()
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        return video

    def _check_ownership(self, video: Video, user_id: int):
        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

    def _check_processing_complete(self, video: Video):
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Video is not ready yet. "
                    f"Current status: {video.processing_status}. "
                    f"Please wait for processing to complete."
                ),
            )

    # ─────────────────────────────────────────────
    # PUBLIC METHODS
    # ─────────────────────────────────────────────
    def get_or_generate(self, video_id: int, user_id: int) -> dict:
        """
        Returns flashcards for the video.
        Generates them with Gemini if they don't exist yet.
        """
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        # Check cache
        existing_count = self.repo.count_by_video(video_id)
        cached = existing_count > 0

        if not cached:
            logger.info(f"[FlashcardService] Cache miss — generating for video_id={video_id}")
            process_flashcards(self.db, video_id, user_id)
        else:
            logger.info(
                f"[FlashcardService] Cache hit — {existing_count} cards for video_id={video_id}"
            )

        # Build response grouped by segment
        segments = (
            self.db.query(TopicSegment)
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

        segments_data = []
        total = 0
        for seg in segments:
            cards = self.repo.get_by_segment(seg.segment_id)
            total += len(cards)
            segments_data.append({
                "segment_id":     seg.segment_id,
                "segment_number": seg.segment_number,
                "title":          seg.title,
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
                    }
                    for c in cards
                ],
            })

        return {
            "video_id":        video_id,
            "total_flashcards": total,
            "cached":          cached,
            "segments":        segments_data,
        }

    def regenerate(self, video_id: int, user_id: int) -> dict:
        """Deletes existing flashcards and regenerates fresh ones."""
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        deleted = self.repo.delete_by_video(video_id)
        logger.info(f"[FlashcardService] Deleted {deleted} old cards for video_id={video_id}")

        return self.get_or_generate(video_id, user_id)

    def get_by_segment(self, video_id: int, segment_id: int, user_id: int) -> dict:
        """Returns flashcards for a single segment."""
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)

        seg = self.db.query(TopicSegment).filter(
            TopicSegment.segment_id == segment_id,
            TopicSegment.vid_id     == video_id,
        ).first()
        if not seg:
            raise HTTPException(status_code=404, detail="Segment not found")

        cards = self.repo.get_by_segment(segment_id)
        return {
            "segment_id":     seg.segment_id,
            "segment_number": seg.segment_number,
            "title":          seg.title,
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
                }
                for c in cards
            ],
        }