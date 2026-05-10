from sqlalchemy import Column, Integer, JSON, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class VideoSummary(Base):
    __tablename__ = "video_summary"

    sum_id = Column(Integer, primary_key=True)
    video_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"), unique=True)
    content = Column(JSON, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="video_summary")
