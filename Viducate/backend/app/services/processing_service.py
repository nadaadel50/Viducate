import logging
import asyncio
from sqlalchemy.orm import Session
from app.repositories.video_repository import VideoRepository
from app.db.database import SessionLocal

from app.services.ocr_service import OCRService

logger = logging.getLogger(__name__)

# Valid processing status transitions
PROCESSING_STATUSES = {
    "uploaded",       # Just saved to DB (URL) or presigned URL issued (file)
    "pending",        # Confirmed in S3 / queued for processing
    "processing",     # ML pipeline running (transcription, segmentation, etc.)
    "completed",      # All processing done
    "failed",         
}


class ProcessingJobService:
    """
    Creates and manages video processing jobs.
    Uses FastAPI BackgroundTasks for now — swap the _run_pipeline body
    for an SQS message / Celery task when ready.
    """

    def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)

    def create_job(self, video_id: int, language: str) -> dict:
        video = self.video_repo.update_status(video_id, "pending")
        if not video:
            raise ValueError(f"Video {video_id} not found")

        job = {
            "video_id": video_id,
            "language": language,
            "status": "pending",
            "message": "Video queued for processing",
        }

        logger.info(f"Processing job created: video_id={video_id}, language={language}")
        return job

    def get_status(self, video_id: int) -> dict:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise ValueError(f"Video {video_id} not found")
        return {
            "video_id": video_id,
            "status": video.processing_status,
        }

    def mark_failed(self, video_id: int, reason: str = "Unknown error"):
        logger.error(f"Video {video_id} processing failed: {reason}")
        self.video_repo.update_status(video_id, "failed")


async def run_processing_pipeline(video_id: int, language: str):
    """
    Background task that simulates the ML pipeline.

    Replace the body of each step with your real ML calls:
      - Transcription
      - Segmentation
      - Summarisation
      - Quiz generation
      - Mindmap generation
    """
    db = SessionLocal()
    try:
        repo = VideoRepository(db)

        logger.info(f"[Pipeline] Starting: video_id={video_id}, language={language}")
        repo.update_status(video_id, "processing")

        # ── Step 1: Transcription ──────────────────────────────────────────
        logger.info(f"[Pipeline] Step 1 – Transcription: video_id={video_id}")
        ocr_service = OCRService(db)
        ocr_service.run(video_id)

        # ── Step 2: Topic Segmentation ─────────────────────────────────────
        logger.info(f"[Pipeline] Step 2 – Segmentation: video_id={video_id}")
        await asyncio.sleep(0)          # Replace with: await segment_topics(video_id)

        # ── Step 3: Summarization ──────────────────────────────────────────
        logger.info(f"[Pipeline] Step 3 – Summarisation: video_id={video_id}")
        await asyncio.sleep(0)          # Replace with: await summarise(video_id, language)

        # ── Step 4: Quiz Generation ────────────────────────────────────────
        logger.info(f"[Pipeline] Step 4 – Quiz generation: video_id={video_id}")
        await asyncio.sleep(0)          # Replace with: await generate_quizzes(video_id)

        # ── Step 5: Mindmap Generation ─────────────────────────────────────
        logger.info(f"[Pipeline] Step 5 – Mindmap: video_id={video_id}")
        await asyncio.sleep(0)          # Replace with: await generate_mindmap(video_id)

        repo.update_status(video_id, "completed")
        logger.info(f"[Pipeline] Completed: video_id={video_id}")

    except Exception as e:
        logger.error(f"[Pipeline] Failed: video_id={video_id}, error={e}")
        VideoRepository(db).update_status(video_id, "failed")

    finally:
        db.close()