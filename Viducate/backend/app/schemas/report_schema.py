from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MaterialsGenerated(BaseModel):
    summary: bool
    study_notes: bool
    quiz: bool
    flashcards: int


class TopicReport(BaseModel):
    id: str
    title: str
    quiz_score: int                         # 0-100
    mastery_level: str                      # mastered | strong | weak | needs_quiz
    correct_answers: Optional[int] = None
    quiz_total: Optional[int] = None
    quiz_attempts: int = 0
    weak_areas: List[str] = []
    materials_generated: MaterialsGenerated


class VideoReportResponse(BaseModel):
    video_id: int
    title: str
    updated_at: datetime
    overall_score_in_video: int             # 0-100 weighted average
    correct_answers: int
    total_quiz_questions: int
    has_summary: bool
    has_study_notes: bool
    has_comprehensive_quiz: bool
    total_flashcards_generated: int
    strong_topics: List[str]
    weak_topics: List[str]
    topics: List[TopicReport]

    model_config = {"from_attributes": True}