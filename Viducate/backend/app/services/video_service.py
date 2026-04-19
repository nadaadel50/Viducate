import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.video_repository import VideoRepository
from app.services.s3_service import S3Service
from app.services.processing_service import ProcessingJobService
from app.services.videoCaching_service import VideoCachingServise

from app.schemas.video import (
    VideoUploadURLRequest,
    PresignedUploadRequest,
)


logger = logging.getLogger(__name__)

class VideoService:
    """
    Orchestrates video ingestion:
      - URL submission  → validate → save metadata → create processing job
      - File upload     → generate presigned S3 URL → save metadata → job created
                          after frontend confirms upload via /confirm endpoint
    """

    def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)
        self.s3 = S3Service()
        self.job_service = ProcessingJobService(db)
        self.caching_service = VideoCachingServise(db)


    
    
    def submit_url(self, user_id: int, request: VideoUploadURLRequest) -> dict:
        normalized_url = self.caching_service.normalize_youtube_url(request.url)
        content_hash = self.caching_service.generate_hash(normalized_url)

        cache_result = self.caching_service.check_cache(user_id, content_hash,request.title)
        if cache_result:
            cache_result["language"] = cache_result.get("language", "en")
            return cache_result
            
        video_data = {
            "user_id": user_id,
            "title": request.title,
            "url": normalized_url,
            "language": request.language,
            "subject": request.subject,
            "processing_status": "uploaded",
            "content_hash": content_hash
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
            "message": "Video URL received and queued for processing",
        }
    
    
    def request_file_upload(self, user_id: int, request: PresignedUploadRequest) -> dict:
        """
        Generate a presigned S3 PUT URL.
        Saves a DB record with status='uploaded' so we have a video_id immediately.
        The frontend PUTs the file directly to S3, then calls /confirm.
        """
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
            raise HTTPException(status_code=404, detail="Video not found")

        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        if not video.s3_key:
            raise HTTPException(
                status_code=400,
                detail="This video was submitted as a URL, not a file upload",
            )

        if not self.s3.object_exists(video.s3_key):
            raise HTTPException(
                status_code=400,
                detail="File not found in S3. Please upload the file before confirming.",
            )

        job = self.job_service.create_job(video.vid, video.language)
        logger.info(f"Upload confirmed and job created: video_id={video_id}")

        return {
            "video_id": video.vid,
            "processing_status": video.processing_status,
            "message": "Upload confirmed. Processing has started.",
        }


    def get_video_status(self, user_id: int, video_id: int) -> dict:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorised")
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
                "processing_status": v.processing_status,
                "upload_date": v.upload_date,
                "created_at": v.created_at,
            }
            for v in videos
        ]

    def delete_video(self, user_id: int, video_id: int) -> dict:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        if video.s3_key:
            self.s3.delete_object(video.s3_key)

        self.video_repo.delete(video_id)
        return {"message": "Video deleted successfully"}