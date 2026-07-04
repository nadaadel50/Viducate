import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.repositories.video_repository import VideoRepository
from app.models.user import User
from app.models.video import Video
from app.models.topic_segment import TopicSegment

logger = logging.getLogger(__name__)

# Storage limits
MAX_DB_STORAGE_BYTES = 1024 * 1024 * 1024  # 1 GB
MAX_R2_STORAGE_BYTES = 1 * 1024 * 1024 * 1024  # 1 GB per user


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.video_repo = VideoRepository(db)

    def _get_youtube_thumbnail(self, url: str) -> str:
        try:
            if "v=" in url:
                video_id = url.split("v=")[1].split("&")[0]
            elif "youtu.be/" in url:
                video_id = url.split("youtu.be/")[1].split("?")[0]
            else:
                return None
            return f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
        except:
            return None

    def get_dashboard(self, user_id: int) -> dict:
        
        user = self.db.query(User).filter(User.id == user_id).first()

        videos = self.video_repo.get_by_user(user_id)
        
        #  Total Watch Time 
        total_watch_time = sum(
            v.current_time for v in videos
            if v.current_time and v.processing_status == "completed"
        )

        #  Used Storage 
        used_storage = sum(
            v.storage_bytes for v in videos 
            if v.storage_bytes and v.processing_status == "completed"
        )
        used_r2_storage = self.video_repo.get_user_r2_storage_bytes(user_id)


        #  Videos List 
        videos_list = []
        for v in videos:
            if v.processing_status != "completed":
                continue

            if v.duration and v.duration > 0 and v.current_time:
                progress = int((v.current_time / v.duration) * 100)
                progress = min(progress, 100) 
            else:
                progress = 0

            is_completed = progress == 100

            videos_list.append({
                "videoId": v.vid,
                "title": v.title,
                "thumbnail_url": self._get_youtube_thumbnail(v.url) if v.url else None,
                "duration": v.duration,
                "currentTime": v.current_time or 0,
                "remainingTime": (v.duration - v.current_time) if v.duration and v.current_time else None,
                "progress": progress,
                "is_completed": is_completed,
                "last_watched_at": v.last_watched_at,
                "created_at": v.created_at,
                "video_type": "upload" if v.s3_key else "url", 
            })

        total_videos = len(videos_list)

        return {
            "user": {
                "name": f"{user.first_name} {user.last_name}"
            },
            "stats": {
                "total_videos_saved": total_videos,
                "total_watch_time_seconds": total_watch_time,
                # YouTube URL storage
                "total_storage": MAX_DB_STORAGE_BYTES,
                "used_storage": used_storage,
                
                # Cloudflare R2 storage
                "total_r2_storage": MAX_R2_STORAGE_BYTES,
                "used_r2_storage": used_r2_storage,

            },
            "continue_learning": videos_list
        }