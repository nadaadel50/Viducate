import logging
import asyncio
import traceback
from sqlalchemy.orm import Session
from app.repositories.video_repository import VideoRepository
from app.db.database import SessionLocal
from app.services.transcription_service import transcribe

from app.services.ocr_service import OCRService
from app.services.merging_service import merge_transcript_ocr
from app.services.segmentation_service import segment_topics
from app.repositories.segment_repository import SegmentRepository
from app.ml.processors.summarization_processor import process_summaries

logger = logging.getLogger(__name__)

# Valid processing status transitions
PROCESSING_STATUSES = {
    "uploaded",       # Just saved to DB (URL) or presigned URL issued (file)
    "pending",        # Confirmed in S3 / queued for processing
    "processing",     # ML pipeline running (transcription, segmentation, etc.)
    "transcribing",       # Step 1: Speech to text
    "ocr_processing",     # Step 2: OCR
    "merging",            # Step 3: Merge
    "segmenting",         # Step 4: Topic segmentation
    "summarizing",        # Step 5: Summarization
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
        logger.info(f"[Pipeline] Step 1 - Transcription: video_id={video_id}")
        repo.update_status(video_id, "transcribing")
        video = repo.get_by_id(video_id)
        transcript = await transcribe(video.url, video_id=video_id)
        logger.info(f"Transcript: {transcript}")

        # ── Step 2: OCR ───────────────────────────────────────────────────
        logger.info(f"[Pipeline] Step 2 - OCR: video_id={video_id}")
        repo.update_status(video_id, "ocr_processing")
        loop = asyncio.get_event_loop()
        ocr_segments = await loop.run_in_executor(
            None,
            lambda: OCRService(db).run(video_id)
        )
        logger.info(f"[Pipeline] OCR segments: {len(ocr_segments)}")

        # ── Step 3: Merging ─────────────────────────────────────
        logger.info(f"[Pipeline] Step 3 - Merging: video_id={video_id}")
        repo.update_status(video_id, "merging")
        merged =  merge_transcript_ocr(transcript, video_id, ocr_segments)
        logger.info(f"[Pipeline] Merged segments: {len(merged)}")

        # ── Step 4: Topic Segmentation ──────────────────────────────────
        logger.info(f"[Pipeline] Step 4 - Segmentation: video_id={video_id}")
        repo.update_status(video_id, "segmenting")
        segment_repo = SegmentRepository(db)

        segments_result = await segment_topics(merged, video_id)
        logger.info(f"[Pipeline] Segments generated: {segments_result['total_segments']}")

        # SAVE TO DATABASE
        print("TOTAL:", segments_result["total_segments"])
        for seg in segments_result["segments"]:
            print(" inserting segment:", seg["segment_number"])
            try:
                segment_repo.create_full_segment(
                    video_id=video_id,
                    segment_data=seg
                )
            except Exception as e:
                logger.error(f" Failed to insert segment: {e}")

        logger.info("[Pipeline] Segments saved to DB successfully")
        
        # ── Step 5: Summarization ────────────────────────────────────── 
    #     logger.info(f"[Pipeline] Step 5 - Summarization: video_id={video_id}")
    #     repo.update_status(video_id, "summarizing")
    #     await asyncio.to_thread(process_summaries, db, video_id, language)
    #     logger.info(f"[Pipeline] Summarization complete: video_id={video_id}")

    #     # ── Completed Status ─────────────────────────────────────
    #     repo.update_status(video_id, "completed")
    #     logger.info(f"[Pipeline] Completed: video_id={video_id}")

    # except Exception as e:
    #     logger.error(f"[Pipeline] Failed: video_id={video_id}, error={e}")
    #     logger.error(traceback.format_exc()) 
    #     VideoRepository(db).update_status(video_id, "failed")

    finally:
        db.close()
