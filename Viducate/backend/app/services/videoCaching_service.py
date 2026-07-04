import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.video_repository import VideoRepository
from app.repositories.segment_repository import SegmentRepository
from app.services.s3_service import S3Service
from app.services.processing_service import ProcessingJobService

from app.schemas.video import (
    VideoUploadURLRequest,
    PresignedUploadRequest,
)
import hashlib
import re


logger = logging.getLogger(__name__)

class VideoCachingServise:
     def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)
        self.segment_repo = SegmentRepository(db)
        self.s3 = S3Service()
        self.job_service = ProcessingJobService(db)

     def normalize_youtube_url(self, url: str) -> str:
          video_id = self.extract_youtube_id(url)
          if not video_id:
               return url
          return f"https://www.youtube.com/watch?v={video_id}"


     def generate_hash(self,url: str) -> str:
        return hashlib.sha256(url.encode()).hexdigest()
     
     def check_cache(self, user_id: int, content_hash: str, title: str):
          user_video = self.video_repo.get_by_user_and_hash(user_id, content_hash)
          if user_video:
               if user_video.processing_status == "completed":
                    return {
                         "cached": True,
                         "same_user": True,
                         "video_id": user_video.vid,
                         "title": user_video.title,
                         "url": user_video.url,
                         "processing_status": user_video.processing_status,
                         "language": user_video.language,
                         "duration": user_video.duration,
                         "message": "You already processed this video",
                    }
               else:
                    # Same user + not completed -> delete only their record and reprocess
                    self.video_repo.delete(user_video.vid)
                    logger.info(f"Deleted incomplete video for same user: vid={user_video.vid}, status={user_video.processing_status}")


          global_video = self.video_repo.get_by_hash(content_hash)
          if not global_video:
               return None  
          
          if global_video.processing_status != "completed":
               # Another user is still processing this video -> don't interfere
               logger.info(f"Global video not completed yet: vid={global_video.vid}, status={global_video.processing_status}")
               return None

          new_video = self.video_repo.create({
               "user_id": user_id,
               "title": title,
               "url": global_video.url,
               "language": global_video.language,
               "subject": global_video.subject,
               "processing_status": global_video.processing_status,
               "content_hash": content_hash,
               "duration": global_video.duration,
          })

          segments = self.segment_repo.get_by_video(global_video.vid)
          for s in segments:
               segment_data = {
                    "segment_number": s.segment_number,
                    "start_time": s.start_time,
                    "end_time": s.end_time,
                    "main_topic": s.main_topic,
                    "title": s.title,
                    "sub_topics": [
                         {
                              "name": sub.name,
                              "description": sub.description,
                              "start_time": sub.start_time,
                              "end_time": sub.end_time,
                         }
                         for sub in s.subtopics
                    ],
                    "key_points": [k.description for k in s.keypoints],
               }
               self.segment_repo.create_full_segment(new_video.vid, segment_data)

          logger.info(f"Cache hit (global): new_video_id={new_video.vid}, source_video_id={global_video.vid}")
          print("helllo")
          return {
               "cached": True,
               "same_user": False,
               "video_id": new_video.vid,
               "title": new_video.title,
               "url": new_video.url,
               "processing_status": new_video.processing_status,
               "language": new_video.language,
               "duration": new_video.duration, 
               "message": "Video retrieved from cache",
          }
          



     def extract_youtube_id(self,url: str) -> str:
          """
          Extracts YouTube video ID from different URL formats.
          """
          patterns = [
               r"v=([a-zA-Z0-9_-]{11})",          # normal youtube link
               r"youtu\.be/([a-zA-Z0-9_-]{11})",  # short link
               r"youtube\.com/embed/([a-zA-Z0-9_-]{11})"
          ]

          for pattern in patterns:
               match = re.search(pattern, url)
               if match:
                    return match.group(1)

          return None