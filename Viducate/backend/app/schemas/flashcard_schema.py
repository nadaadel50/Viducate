from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class FlashcardItem(BaseModel):
    flashcard_id: int
    segment_id:   int
    video_id:     int
    question:     str
    answer:       str
    language:     Optional[str] = "en"
    difficulty:   Optional[str] = "medium"
    created_at:   Optional[datetime] = None

    model_config = {"from_attributes": True}


class FlashcardGenerateRequest(BaseModel):
    video_id: int


class FlashcardsBySegmentResponse(BaseModel):
    segment_id:     int
    segment_number: int
    title:          str
    flashcards:     List[FlashcardItem]


class FlashcardsVideoResponse(BaseModel):
    video_id:        int
    total_flashcards: int
    cached:          bool
    segments:        List[FlashcardsBySegmentResponse]