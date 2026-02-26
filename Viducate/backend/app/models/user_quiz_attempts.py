from sqlalchemy import Column, Integer, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class UserQuizAttempts(Base):
    __tablename__ = "user_quiz_attempts"

    attempt_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    quiz_id = Column(Integer, ForeignKey("quiz.quiz_id", ondelete="CASCADE"))
    score = Column(DECIMAL(5,2), nullable=False)
    attempt_date = Column(TIMESTAMP, server_default=func.now())
    time_spent = Column(Integer)

    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

