from sqlalchemy import Column, Integer, Text, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Question(Base):
    __tablename__ = "question"

    ques_id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quiz.quiz_id", ondelete="CASCADE"))
    ques_text = Column(Text, nullable=False)
    points = Column(Integer, nullable=False, default=1)
    correct_answer = Column(Text, nullable=False)
    corrans_explanation = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("AnswerOption", back_populates="question")
