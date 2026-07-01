from pydantic import BaseModel
from typing import List, Optional


class QuizAnswerItem(BaseModel):
    question_id: int
    user_answer: str  # "a", "b", "c", "d"


class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerItem]


class QuizQuestionResult(BaseModel):
    question_id:         int
    question_text:       str
    choices:             dict       
    user_answer:         Optional[str] = None  
    correct_answer:      str                    
    correct_answer_text: str                
    is_correct:          bool
    explanation:         Optional[str] = None
    video_timestamp:     Optional[int] = None
    timestamp_label:     Optional[str] = None
    segment_id:          Optional[int] = None
    concept:             Optional[str] = None


class QuizSubmitResponse(BaseModel):
    quiz_id:       int
    correct_count: int
    wrong_count:   int
    total:         int
    score:         int
    trials:        int
    is_new:        bool
    questions:     List[QuizQuestionResult]
