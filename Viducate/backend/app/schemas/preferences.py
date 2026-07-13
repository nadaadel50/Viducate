from pydantic import BaseModel
from typing import Optional, Literal

class ContentPreferencesRequest(BaseModel):
    video_id: int
    summary_language: Optional[Literal["en", "ar"]] = None   
    quiz_language: Optional[Literal["en", "ar"]] = None
    flashcard_language: Optional[Literal["en", "ar"]] = None

class ContentPreferencesResponse(BaseModel):
    video_id: int
    summary_language: Optional[str]
    quiz_language: Optional[str]
    flashcard_language: Optional[str]

    model_config = {"from_attributes": True}