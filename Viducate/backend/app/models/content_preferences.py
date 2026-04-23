from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class ContentPreferences(Base):
    __tablename__ = "content_preferences"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    video_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"), unique=True)
    summary_language = Column(String(10), nullable=True)    # null = same as video
    quiz_language = Column(String(10), nullable=True)
    flashcard_language = Column(String(10), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="content_preferences")
    video = relationship("Video", back_populates="content_preferences")