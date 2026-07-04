from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from app.repositories.preferences_repository import PreferencesRepository
from app.repositories.video_repository import VideoRepository
from app.schemas.preferences import ContentPreferencesRequest

class PreferencesService:
    def __init__(self, db: Session):
        self.repo = PreferencesRepository(db)
        self.video_repo = VideoRepository(db)

    def save(self, user_id: int, request: ContentPreferencesRequest):
        video = self.video_repo.get_by_id(request.video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        data = {
            "summary_language": request.summary_language,
            "quiz_language": request.quiz_language,
            "flashcard_language": request.flashcard_language,
        }
        return self.repo.upsert(user_id, request.video_id, data)

    def get(self, user_id: int, video_id: int):
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        if video.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        prefs = self.repo.get_by_video(video_id)
        if not prefs:
    
            return {
                "video_id": video_id,
                "summary_language": None,
                "quiz_language": None,
                "flashcard_language": None
            }
        return prefs