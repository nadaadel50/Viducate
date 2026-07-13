from sqlalchemy import func, select, text
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
    
    # CACHE LOOKUPS
    def get_by_user_and_hash(self, user_id: int, content_hash: str) -> Optional[Video]:
        return (
            self.db.query(Video)
            .filter(Video.user_id == user_id)
            .filter(Video.content_hash == content_hash)
            .first()
        )

    # user (global cache)
    def get_by_hash(self, content_hash: str) -> Optional[Video]:
        return (
            self.db.query(Video)
            .filter(Video.content_hash == content_hash)
            .first()
        )
   

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


    def get_video_storage_bytes(self, video_id: int) -> int:
        result = self.db.execute(text("""
            SELECT COALESCE(SUM(
                COALESCE(pg_column_size(ts.title), 0) +
                COALESCE(pg_column_size(ts.main_topic), 0) +
                COALESCE(pg_column_size(s.name), 0) +
                COALESCE(pg_column_size(s.description), 0) +
                COALESCE(pg_column_size(k.description), 0) +
                COALESCE(pg_column_size(ss.content), 0) +
                COALESCE(pg_column_size(vs.content), 0) +
                COALESCE(pg_column_size(vsn.content), 0) +
                COALESCE(pg_column_size(sn.content), 0) +
                COALESCE(pg_column_size(f.question), 0) +
                COALESCE(pg_column_size(f.answer), 0) +
                COALESCE(pg_column_size(mm.nodes), 0) +
                COALESCE(pg_column_size(mm.edges), 0) +
                COALESCE(pg_column_size(cm.question), 0) +
                COALESCE(pg_column_size(cm.answer), 0)
            ), 0)
            FROM video v
            LEFT JOIN topic_segment ts ON ts.vid_id = v.vid
            LEFT JOIN subtopics s ON s.segment_id = ts.segment_id
            LEFT JOIN keypoints k ON k.segment_id = ts.segment_id
            LEFT JOIN segment_summary ss ON ss.segment_id = ts.segment_id
            LEFT JOIN video_summary vs ON vs.video_id = v.vid
            LEFT JOIN video_studynotes vsn ON vsn.video_id = v.vid
            LEFT JOIN segment_studynotes sn ON sn.segment_id = ts.segment_id
            LEFT JOIN flashcard f ON f.video_id = v.vid
            LEFT JOIN mindmap mm ON mm.video_id = v.vid
            LEFT JOIN chat_sessions cs ON cs.video_id = v.vid
            LEFT JOIN chat_messages cm ON cm.session_id = cs.session_id
            WHERE v.vid = :video_id
        """), {"video_id": video_id})
        return result.scalar() or 0


    def get_user_r2_storage_bytes(self, user_id: int) -> int:
        result = self.db.execute(
            select(func.sum(Video.file_size))
            .where(Video.user_id == user_id)
            .where(Video.s3_key.isnot(None))
        )
        return result.scalar() or 0
    
    def get_total_r2_storage_bytes(self) -> int:
        result = self.db.execute(
            select(func.sum(Video.file_size))
            .where(Video.s3_key.isnot(None))
        )
        return result.scalar() or 0
    
    def update_storage_bytes(self, video_id: int, storage_bytes: int) -> None:
        video = self.get_by_id(video_id)
        if video:
            video.storage_bytes = storage_bytes
            self.db.commit()