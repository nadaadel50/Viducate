from pydantic import BaseModel, field_validator
from typing import List, Optional, Literal
from datetime import datetime



class QuizGenerateRequest(BaseModel):
    difficulty: Literal["easy", "medium", "hard"] = "medium"



class QuizChoices(BaseModel):
    a: str
    b: str
    c: str
    d: str


class QuizQuestionResponse(BaseModel):
    question_id:         int
    question_text:       str
    choices:             QuizChoices
    correct_answer:      str          
    correct_answer_text: str
    explanation:         Optional[str] = None
    video_timestamp:     Optional[int] = None   
    timestamp_label:     Optional[str] = None  
    segment_id:          Optional[int] = None
    concept:             Optional[str] = None

    model_config = {"from_attributes": False}


class QuizQuestionSecureResponse(BaseModel):
    """Client-facing question — no answer key, no explanation."""
    question_id:         int
    question_text:       str
    choices:             QuizChoices
    video_timestamp:     Optional[int] = None
    timestamp_label:     Optional[str] = None
    segment_id:          Optional[int] = None
    concept:             Optional[str] = None

    model_config = {"from_attributes": False}


class QuizResponse(BaseModel):
    quiz_id:         int
    video_id:        int
    segment_id:      Optional[int] = None
    quiz_type:       str
    difficulty:      str
    language:        str
    total_questions: int
    questions:       List[QuizQuestionResponse]
    created_at:      Optional[datetime] = None

class QuizSecureResponse(BaseModel):
    """Client-facing quiz — used by generate/fetch endpoints."""
    quiz_id:         int
    video_id:        int
    segment_id:      Optional[int] = None
    quiz_type:       str
    difficulty:      str
    language:        str
    total_questions: int
    questions:       List[QuizQuestionSecureResponse]
    created_at:      Optional[datetime] = None