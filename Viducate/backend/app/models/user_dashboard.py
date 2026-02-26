from sqlalchemy import Column, Integer, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class UserDashboard(Base):
    __tablename__ = "user_dashboard"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    Num_Videos_Watched = Column(Integer, default=0)
    last_quiz_time = Column(Integer, default=0)
    last_quiz_score = Column(Integer, default=0)
    avg_quiz_scores = Column(DECIMAL(5,2), default=0.0)
    flashCardsCount= Column(Integer,default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="dashboard")
