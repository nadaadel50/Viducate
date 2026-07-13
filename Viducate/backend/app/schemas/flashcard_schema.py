from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class FlashcardItem(BaseModel):
    flashcard_id:        int
    segment_id:          int
    video_id:            int
    question:            str
    answer:              str
    language:            Optional[str] = "en"
    difficulty:          Optional[str] = "medium"
    created_at:          Optional[datetime] = None
    segment_start_time:  Optional[int] = None    # raw seconds  125
    segment_end_time:    Optional[int] = None    
    segment_start_label: Optional[str] = None   # formatted   "00:02:05"

    model_config = {"from_attributes": False}


class FlashcardGenerateRequest(BaseModel):
    video_id: int


class FlashcardsBySegmentResponse(BaseModel):
    segment_id:      int
    segment_number:  int
    title:           str
    start_time:      int    
    end_time:        int    
    start_time_label: str   
    end_time_label:   str   
    flashcards:      List[FlashcardItem]


class FlashcardsVideoResponse(BaseModel):
    video_id:         int
    total_flashcards: int
    cached:           bool
    segments:         List[FlashcardsBySegmentResponse]
