from sqlalchemy.orm import Session
from app.models.video import Video
from typing import Optional, List


class VideoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, video_data: dict) -> Video:
        video = Video(**video_data)
        self.db.add(video)
        self.db.commit()
        self.db.refresh(video)
        return video

    def get_by_id(self, video_id: int) -> Optional[Video]:
        return self.db.query(Video).filter(Video.vid == video_id).first()

    def get_by_user(self, user_id: int) -> List[Video]:
        return (
            self.db.query(Video)
            .filter(Video.user_id == user_id)
            .order_by(Video.created_at.desc())
            .all()
        )

    def update_status(self, video_id: int, status: str) -> Optional[Video]:
        video = self.get_by_id(video_id)
        if not video:
            return None
        video.processing_status = status
        self.db.commit()
        self.db.refresh(video)
        return video

    def update_url(self, video_id: int, url: str) -> Optional[Video]:
        video = self.get_by_id(video_id)
        if not video:
            return None
        video.url = url
        self.db.commit()
        self.db.refresh(video)
        return video

    def update(self, video: Video) -> Video:
        self.db.commit()
        self.db.refresh(video)
        return video

    def delete(self, video_id: int) -> bool:
        video = self.get_by_id(video_id)
        if not video:
            return False
        self.db.delete(video)
        self.db.commit()
        return True