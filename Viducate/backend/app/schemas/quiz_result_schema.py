from pydantic import BaseModel
from typing import List


class QuizAnswerItem(BaseModel):
    question_id: int
    user_answer: str  # "a", "b", "c", "d"
    is_correct: bool

class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerItem]

class QuizSubmitResponse(BaseModel):
    quiz_id:          int
    correct_count:    int
    wrong_count:      int
    total:            int
    score:            int        
    trials:           int       
    is_new:           bool  