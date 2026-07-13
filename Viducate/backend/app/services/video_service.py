import logging
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.video_repository import VideoRepository
from app.services.s3_service import S3Service
from app.services.processing_service import ProcessingJobService
from app.services.videoCaching_service import VideoCachingServise
from app.services.network_errors import NetworkUnavailableError

from app.schemas.video import (
    SaveVideoRequest,
    VideoUploadURLRequest,
    PresignedUploadRequest,
)
from app.services.classify_video_service import classify_video


logger = logging.getLogger(__name__)


# YouTube URL - database
MAX_DB_STORAGE_BYTES = 1 * 1024 * 1024 * 1024   # 1 GB
DB_STORAGE_THRESHOLD = 1023 * 1024 * 1024   

# File Upload - Cloudflare R2
MAX_R2_STORAGE_BYTES = 1 * 1024 * 1024 * 1024   # 1 GB per user


class VideoService:
  
    def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)
        self.s3 = S3Service()
        self.job_service = ProcessingJobService(db)
        self.caching_service = VideoCachingServise(db)

    def _check_db_storage_limit(self, user_id: int):
        used = self.video_repo.get_video_storage_bytes(user_id)
        if used >= DB_STORAGE_THRESHOLD:
            used_gb  = used / (1024 * 1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Storage limit reached. Used: {used_gb :.2f}GB / 1GB. Please delete a video to continue."
            )
            

    def _check_r2_storage_limit(self, user_id: int, new_file_size: int):
        used = self.video_repo.get_user_r2_storage_bytes(user_id)
        if used + new_file_size > MAX_R2_STORAGE_BYTES:
            used_gb = used / (1024 * 1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Storage limit reached. Used: {used_gb:.2f}GB / 1GB. Please delete a video to continue."
            )
        
 
    def _check_total_r2_storage(self, new_file_size: int):
        total_used = self.video_repo.get_total_r2_storage_bytes()
        if total_used + new_file_size > 10 * 1024 * 1024 * 1024:  # 10 GB
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Service storage is full. Please try again later."
            )

    
    async def submit_url(self, user_id: int, request: VideoUploadURLRequest) -> dict:
        self._check_db_storage_limit(user_id)

        normalized_url = self.caching_service.normalize_youtube_url(request.url)
        content_hash = self.caching_service.generate_hash(normalized_url)

        cache_result = self.caching_service.check_cache(user_id, content_hash,request.title)
        if cache_result:
            cache_result["language"] = cache_result.get("language", "en")
            return cache_result
        
        # classify_video if film or music or not allowed
        yt_video_id = self.caching_service.extract_youtube_id(normalized_url)

        if yt_video_id:
            try:
                classification_result = await classify_video(yt_video_id)
            except NetworkUnavailableError:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Network connection issue while validating the video. Please try again.",
                )
            subject = classification_result["classification"]
            duration_seconds = classification_result["duration_seconds"]

            if duration_seconds and duration_seconds > 10800: # 3 hours
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Video duration exceeds the maximum allowed limit of 3 hours"
                )
        else:
            subject = "general"
            duration_seconds = None

        if subject == "blocked":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This video category is not allowed"
            )
            
        video_data = {
            "user_id": user_id,
            "title": request.title,
            "url": normalized_url,
            "language": request.language,
            "subject": request.subject,
            "processing_status": "uploaded",
            "content_hash": content_hash,
            "duration": duration_seconds,
        }
        video = self.video_repo.create(video_data)
        logger.info(f"URL video created: video_id={video.vid}, user_id={user_id}")

        job = self.job_service.create_job(video.vid, request.language)
        return {
            "video_id": video.vid,
            "title": video.title,
            "url": video.url,
            "language": video.language,
            "processing_status": video.processing_status,
            "content_hash": video.content_hash,
            "duration":video.duration,
            "message": "Video URL received and queued for processing",
        }
    
    
    def request_file_upload(self, user_id: int, request: PresignedUploadRequest) -> dict:
        """
        Generate a presigned S3 PUT URL.
        Saves a DB record with status='uploaded' so we have a video_id immediately.
        The frontend PUTs the file directly to S3, then calls /confirm.
        """
        self._check_r2_storage_limit(user_id, request.file_size)
        self._check_total_r2_storage(request.file_size)


        s3_key = self.s3.generate_s3_key(user_id, request.filename)
        presigned_url = self.s3.generate_presigned_upload_url(
            s3_key=s3_key,
            content_type=request.content_type or "video/mp4",
        )

        final_url = self.s3.get_public_url(s3_key)

        video_data = {
            "user_id": user_id,
            "title": request.title,
            "url": final_url,
            "s3_key": s3_key,
            "language": request.language,
            "subject": request.subject,
            "processing_status": "uploaded",
        }
        video = self.video_repo.create(video_data)
        logger.info(f"File video record created: video_id={video.vid}, s3_key={s3_key}")

        return {
            "video_id": video.vid,
            "title": video.title,
            "upload_url": presigned_url,
            "s3_key": s3_key,
            "processing_status": video.processing_status,
            "message": "PUT the video file to upload_url, then call /confirm with the video_id",
        }


    def confirm_upload(self, user_id: int, video_id: int) -> dict:
        """
        Called by the frontend after it finishes uploading to S3.
        Verifies the object exists in S3, then queues the processing job.
        """
        video = self.video_repo.get_by_id(video_id)

        if not video:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Video not found")

        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if not video.s3_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This video was submitted as a URL, not a file upload",
            )

        if not self.s3.object_exists(video.s3_key):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File not found in S3. Please upload the file before confirming.",
            )

        job = self.job_service.create_job(video.vid, video.language)
        logger.info(f"Upload confirmed and job created: video_id={video_id}")

        return {
            "video_id": video.vid,
            "title": video.title,
            "processing_status": video.processing_status,
            "message": "Upload confirmed. Processing has started.",
        }


    def get_video_status(self, user_id: int, video_id: int) -> dict:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised")
        return {
            "video_id": video.vid,
            "title": video.title,
            "processing_status": video.processing_status,
            "upload_date": video.upload_date,
            "created_at": video.created_at,
        }

    def get_user_videos(self, user_id: int) -> list:
        videos = self.video_repo.get_by_user(user_id)
        return [
            {
                "video_id": v.vid,
                "title": v.title,
                "url": v.url,
                "language": v.language,
                "duration":v.duration,
                "processing_status": v.processing_status,
                "upload_date": v.upload_date,
                "created_at": v.created_at,
            }
            for v in videos
        ]

    def delete_video(self, user_id: int, video_id: int) -> dict:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if video.s3_key:
            self.s3.delete_object(video.s3_key)

        self.video_repo.delete(video_id)
        return {"message": "Video deleted successfully"}
    

    def save_video(self, user_id: int, request: SaveVideoRequest) -> dict:
    
        video = self.video_repo.get_by_id(request.video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")


        for segment in video.segments:
            if segment.segment_id in request.completed_segment_ids:
                segment.is_completed = True
            else:
                segment.is_completed = False  

        video.bookmarks = request.bookmarks

        video.current_time = request.current_time
        
        video.duration = request.duration

        video.last_watched_at = func.now()

        self.db.commit()
        
        logger.info(f"Video saved: video_id={request.video_id}, user_id={user_id}")
        
        return {"message": "Video saved successfully"}