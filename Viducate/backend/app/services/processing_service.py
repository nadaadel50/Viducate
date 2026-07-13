import logging
import asyncio
import traceback
from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from app.repositories.video_repository import VideoRepository
from app.db.database import SessionLocal
from app.services.transcription_service import transcribe

from app.services.ocr_service import OCRService
from app.services.merging_service import merge_transcript_ocr
from app.services.segmentation_service import    segment_topics
from app.repositories.segment_repository import SegmentRepository, time_to_seconds
from app.services.embedding_service import store_embeddings

from app.services import cancellation_registry as cancel_reg
from app.services.cancellation_registry import PipelineCancelledError
from app.services.transcription_service import transcribe_sync
from app.services.segmentation_service import segment_topics, SegmentationUnavailableError

logger = logging.getLogger(__name__)

# Valid processing status transitions
PROCESSING_STATUSES = {
    "uploaded",      
    "pending",     
    "processing",    
    "transcribing",       
    "ocr_processing",   
    "merging",            
    "segmenting",        
    "completed",     
    "cancelled",  
    "failed",     
    
}


class ProcessingJobService:
   
    def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)

    def create_job(self, video_id: int, language: str) -> dict:
        video = self.video_repo.update_status(video_id, "pending")
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video {video_id} not found"
            )

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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video {video_id} not found"
            )
        return {
            "video_id": video_id,
            "status": video.processing_status,
        }

    def mark_failed(self, video_id: int, reason: str = "Unknown error"):
        logger.error(f"Video {video_id} processing failed: {reason}")
        self.video_repo.update_status(video_id, "failed")

    

    def cancel_job(self, video_id: int, user_id: int) -> dict:
        logger.info(f"[CANCEL REQUESTED] video_id={video_id}")
        video = self.video_repo.get_by_id(video_id)
        if not video:
            
            return {
                "video_id": video_id,
                "message": "This video no longer exists — it was likely already cancelled.",
                "cancelled": True,
            }

        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        terminal_statuses = {"completed", "failed", "cancelled"}
        if video.processing_status in terminal_statuses:
            return {
                "video_id": video_id,
                "message": f"Cannot cancel — already in terminal status '{video.processing_status}'",
                "cancelled": False,
            }

        if video.processing_status == "cancelling":
            return {
                "video_id": video_id,
                "message": "Cancellation already requested — waiting for the pipeline to stop.",
                "cancelled": True,
            }


        cancel_reg.request_cancel(video_id)
        self.video_repo.update_status(video_id, "cancelling")

        logger.info(f"[ProcessingJobService] Cancel requested video_id={video_id} user_id={user_id}")
        return {
            "video_id": video_id,
            "message": "Cancellation requested. The pipeline will stop and remove partial data shortly.",
            "cancelled": True,
        }
    
async def run_processing_pipeline(video_id: int, language: str):
    db = SessionLocal()
    try:
        repo = VideoRepository(db)
        loop = asyncio.get_event_loop()

        logger.info(f"[Pipeline] Starting: video_id={video_id}, language={language}")
        repo.update_status(video_id, "processing")

         #  Step 1: Transcription 
         #  Step 1: Transcription
        _check_cancel(video_id)
        logger.info(f"[Pipeline] Step 1 - Transcription: video_id={video_id}")
        repo.update_status(video_id, "transcribing")
        _check_cancel(video_id)
        video = repo.get_by_id(video_id)
        
        _check_cancel(video_id)
        
        transcript, video_path, Transcribt_lang = await loop.run_in_executor(
            None,
            lambda: transcribe_sync(video.url, video_id=video_id)
        )
        logger.info(f"Transcript: {transcript}")
        
        logger.info(f"[Pipeline] Transcription done: video_id={video_id}")

        #  Step 2: OCR 
        _check_cancel(video_id)
        
        logger.info(f"[Pipeline] Step 2 - OCR: video_id={video_id}")
        repo.update_status(video_id, "ocr_processing")
        
        ocr_service = OCRService(db)

        ocr_result = await loop.run_in_executor(
            None,
            lambda: ocr_service.run(video_path, video_id)
        )

        ocr_segments = ocr_result["segments"]
        ocr_language  = ocr_result["language"]
       

        logger.info(f"[Pipeline] OCR segments: {len(ocr_segments)}")
        
        logger.info(f"[Pipeline] OCR done: {len(ocr_segments)} segments, video_id={video_id}")
        
        #  Step 3: Merging 

        _check_cancel(video_id)

        logger.info(f"[Pipeline] Step 3 - Merging: video_id={video_id}")
        repo.update_status(video_id, "merging")
        merged =  merge_transcript_ocr(transcript, video_id, ocr_segments)
        logger.info(f"[Pipeline] Merged segments: {len(merged)}")

        logger.info(f"[Pipeline] Merge done: {len(merged)} entries, video_id={video_id}")
        
        #  Step 4: Topic Segmentation 
        #  Step 4: Topic Segmentation
        _check_cancel(video_id)
       
        logger.info(f"[Pipeline] Step 4 - Segmentation: video_id={video_id}")
        repo.update_status(video_id, "segmenting")
        segment_repo = SegmentRepository(db)

    
        segments_result = await loop.run_in_executor(
            None,
            lambda: asyncio.run(
                segment_topics(merged, video_id, ocr_language, Transcribt_lang)
            )
        )
        logger.info(f"[Pipeline] Segments generated: {segments_result['total_segments']}")
         
        logger.info(
            f"[Pipeline] Segmentation done: {segments_result['total_segments']} segments"
        )

       
        print("TOTAL:", segments_result["total_segments"])
        last_end_time = None
        for seg in segments_result["segments"]:
            _check_cancel(video_id)        
            print(" inserting segment:", seg["segment_number"])
            
            start_time = time_to_seconds(seg["start_time"])
            end_time = time_to_seconds(seg["end_time"])
            if last_end_time is not None and start_time <= last_end_time:
                logger.warning(
                    f"[Pipeline] Fixing timing: segment #{seg['segment_number']} "
                    f"start_time={start_time}s -> {last_end_time + 10}s"
                )
                start_time = last_end_time + 10
                seg["start_time"] = start_time

            try:
                db_segment = segment_repo.create_full_segment(
                    video_id=video_id,
                    segment_data=seg,
                )
            except Exception as e:
                logger.error(f" Failed to insert segment: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to insert segment {seg['segment_number']}"
                )
            last_end_time = end_time
            
            quality = seg.get("_quality")
            if quality and db_segment is not None:
                db_segment.quality_score = quality.get("score")
                db_segment.quality_flag  = bool(quality.get("flag", False))
                db_segment.retry_count   = 0
                try:
                    db.commit()
                    logger.info(
                        f"[Pipeline] Segment #{seg['segment_number']} "
                        f"quality_score={quality.get('score', 'N/A'):.4f} "
                        f"flag={quality.get('flag')}"
                    )
                except Exception as e:
                    logger.error(
                        f"[Pipeline] Could not save quality for segment "
                        f"#{seg['segment_number']}: {e}"
                    )
                    db.rollback()
            else:
                if quality is None:
                    logger.warning(
                        f"[Pipeline] No _quality key on segment "
                        f"#{seg['segment_number']} — skipping quality persist"
                    )
                if db_segment is None:
                    logger.warning(
                        f"[Pipeline] db_segment is None for segment "
                        f"#{seg['segment_number']} — skipping quality persist"
                    )
         
        logger.info("[Pipeline] Segments saved to DB successfully")

        #  Step 5: Store Embeddings 
       
        _check_cancel(video_id)
        logger.info(f"[Pipeline] Step 5 - Embeddings: video_id={video_id}")
       
        await store_embeddings(
            video_id,
            segments_result["segments"]
        )

        #  Completed Status 
        repo.update_status(video_id, "completed")

        #  Calculate & Save Storage Bytes 
        storage_bytes = repo.get_video_storage_bytes(video_id)
        repo.update_storage_bytes(video_id, storage_bytes)

        logger.info(f"[Pipeline] Completed: video_id={video_id}")
    

    except PipelineCancelledError:
        logger.info(f"[Pipeline] Cancelled: video_id={video_id}")

        _cleanup_partial_data(db, video_id)

        return
    
    except SegmentationUnavailableError as e:
        logger.error(f"[Pipeline] Segmentation unavailable (overload): video_id={video_id}, error={e}")
        VideoRepository(db).update_status(video_id, "failed")


    except Exception as e:
        logger.error(f"[Pipeline] Failed: video_id={video_id}, error={e}")
        logger.error(traceback.format_exc()) 
        VideoRepository(db).update_status(video_id, "failed")

    finally:
        db.close()



 
 
def _check_cancel(video_id: int) -> None:
    if cancel_reg.is_cancelled(video_id):
        raise PipelineCancelledError(f"Video {video_id} was cancelled by user")
 
 
def _cleanup_partial_data(db: Session, video_id: int) -> None:
    
    logger.info(f"[Pipeline] Cleaning up partial data for video_id={video_id}")
 
    try:
        from app.models.topic_segment import TopicSegment
        deleted_segments = (
            db.query(TopicSegment)
            .filter(TopicSegment.vid_id == video_id)
            .delete(synchronize_session=False)
        )
        db.commit()
        logger.info(
            f"[Pipeline] Deleted {deleted_segments} partial segment(s) "
            f"for video_id={video_id}"
        )
    except Exception as e:
        logger.warning(f"[Pipeline] Could not delete segments: {e}")
        db.rollback()
 
    try:
        import chromadb
        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        chroma_client.delete_collection(name=f"video_{video_id}")
        logger.info(f"[Pipeline] Deleted ChromaDB collection for video_id={video_id}")
    except Exception:
        pass   
 
 
    try:
        repo = VideoRepository(db)
        repo.delete(video_id)
        logger.info(f"[Pipeline] Deleted video record video_id={video_id}")
    except Exception as e:
        logger.warning(f"[Pipeline] Could not delete video record: {e}")
        db.rollback()