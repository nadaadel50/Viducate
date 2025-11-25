from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Quiz(Base):
    __tablename__ = "quiz"

    quiz_id = Column(Integer, primary_key=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"))
    difficulty_level = Column(String(20), default="medium")
    type = Column(String(50), default="mcq")
    mode = Column(String(20), default="learning")  # 'learning' or 'exam'
    time_limit = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    segment = relationship("TopicSegment", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz")
    attempts = relationship("UserQuizAttempts", back_populates="quiz")
