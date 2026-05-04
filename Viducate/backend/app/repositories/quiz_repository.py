"""
quiz_repository.py
──────────────────
All DB operations for Quiz and QuizQuestion.
No caching logic here — service layer decides when to generate.
"""

from sqlalchemy.orm import Session, joinedload
from app.models.quiz import Quiz, QuizQuestion
from typing import Optional, List


class QuizRepository:
    def __init__(self, db: Session):
        self.db = db

    # ─── Quiz ─────────────────────────────────────────────────────────────────

    def create_quiz(self, data: dict) -> Quiz:
        quiz = Quiz(**data)
        self.db.add(quiz)
        self.db.flush()   # get quiz_id without committing
        return quiz

    def get_quiz_with_questions(self, quiz_id: int) -> Optional[Quiz]:
        return (
            self.db.query(Quiz)
            .options(joinedload(Quiz.questions))
            .filter(Quiz.quiz_id == quiz_id)
            .first()
        )

    # ─── Questions ────────────────────────────────────────────────────────────

    def bulk_create_questions(self, questions: list[dict]) -> List[QuizQuestion]:
        objs = [QuizQuestion(**q) for q in questions]
        self.db.add_all(objs)
        return objs

    def get_questions_by_quiz(self, quiz_id: int) -> List[QuizQuestion]:
        return (
            self.db.query(QuizQuestion)
            .filter(QuizQuestion.quiz_id == quiz_id)
            .order_by(QuizQuestion.question_id)
            .all()
        )