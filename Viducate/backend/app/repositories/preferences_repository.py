from sqlalchemy.orm import Session
from app.models.content_preferences import ContentPreferences
from typing import Optional

class PreferencesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_video(self, video_id: int) -> Optional[ContentPreferences]:
        return self.db.query(ContentPreferences)\
            .filter(ContentPreferences.video_id == video_id).first()

    def upsert(self, user_id: int, video_id: int, data: dict) -> ContentPreferences:
        prefs = self.get_by_video(video_id)
        if prefs:
            for key, value in data.items():
                setattr(prefs, key, value)
        else:
            prefs = ContentPreferences(user_id=user_id, video_id=video_id, **data)
            self.db.add(prefs)
        self.db.commit()
        self.db.refresh(prefs)
        return prefs