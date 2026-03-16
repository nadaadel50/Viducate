import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.ocr_repository import OCRRepository
from app.ml.processors.ocr_processor import OCRProcessor

logger = logging.getLogger(__name__)


class OCRService:
    """
    Orchestrates the full OCR pipeline starting from video_id.
    Reads video.url and video.language from DB — no extra input needed.
    """

    def __init__(self, db: Session):
        self.repo = OCRRepository(db)
        self.processor = OCRProcessor()

    def run(self, video_id: int) -> dict:
        """
        1. Fetch video from DB → get url + language
        2. Validate
        3. status → "processing"
        4. Run OCR pipeline
        5. Save segments to DB
        6. status → "completed"
        """

        # ── 1. Fetch video ────────────────────────────────────
        video = self.repo.get_video_by_id(video_id)
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video {video_id} not found"
            )

        # ── 2. Guard: already processing ─────────────────────
        if video.processing_status == "processing":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Video {video_id} is already being processed"
            )

        # ── 3. Status → processing ────────────────────────────
        self.repo.update_video_status(video_id, "processing")

        try:
            logger.info(
                f"[OCRService] Starting OCR | "
                f"video_id={video_id} | url={video.url} | lang={video.language}"
            )

            # ── 4. Run OCR ────────────────────────────────────
            result = self.processor.process_from_url(
                url=video.url,
                language=video.language
            )

            # ── 5. Save to DB ─────────────────────────────────
            self.repo.save_ocr_segments(video_id, result["segments"])

            # ── 6. Status → completed ─────────────────────────
            self.repo.update_video_status(video_id, "completed")

            logger.info(
                f"[OCRService] Done | video_id={video_id} | "
                f"segments={result['total']}"
            )

            return {
                "video_id": video_id,
                "status": "completed",
                "segments": result["segments"],
                "total": result["total"],
                "language": video.language,
                "url_type": result["url_type"]
            }

        except HTTPException:
            raise

        except Exception as e:
            self.repo.update_video_status(video_id, "failed")
            logger.error(f"[OCRService] Failed | video_id={video_id} | error={e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OCR pipeline failed: {str(e)}"
            )