from sqlalchemy import Column, Integer, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class UserAnalytics(Base):
    __tablename__ = "user_analytics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    total_watch_time = Column(Integer, default=0)
    total_videos_watched = Column(Integer, default=0)
    total_quizzes_taken = Column(Integer, default=0)
    avg_quiz_scores = Column(DECIMAL(5,2), default=0.0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="analytics")
