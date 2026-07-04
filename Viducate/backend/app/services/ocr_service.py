import os
import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.ml.processors.ocr_processor import OCRProcessor
from app.repositories.video_repository import VideoRepository
from app.services.cancellation_registry import PipelineCancelledError

logger = logging.getLogger(__name__)


class OCRService:
    def __init__(self, db: Session):
        self.video_repo = VideoRepository(db)
        self.processor  = OCRProcessor()

    def run(self, video_path: str, video_id: int) -> list:
       
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video {video_id} not found"
            )

        try:
            logger.info(f"[OCRService] Starting | video_id={video_id} | url={video.url}")

            
            result = self.processor.process_from_file(video_path, video_id=video_id)

            segments          = result["segments"]
            detected_language = result["language"]

            self._save_to_txt(video_id, segments, detected_language)

            logger.info(
                f"[OCRService] Done | video_id={video_id} | "
                f"segments={len(segments)} | lang={detected_language}"
            )

            return {
                "segments": segments,
                "language": detected_language
            }   
               #  same as transcript variable
        
        except PipelineCancelledError:
            raise
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[OCRService] Failed | video_id={video_id} | error={e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OCR processing failed for video_id={video_id}"
            )

    def _save_to_txt(self, video_id: int, segments: list, language: str):
        """Save OCR results to text file with same template as API response."""
        output_dir  = "logs/ocr_outputs"
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, f"ocr_video_{video_id}.txt")

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"# OCR Output — video_id={video_id}\n")
            f.write(f"# Language: {language}\n")
            f.write(f"# Total segments: {len(segments)}\n\n")

            for seg in segments:
                f.write(f"[{seg['timestamp']}] {seg['text']}\n")

        logger.info(f"[OCRService] Saved to {output_file}")
