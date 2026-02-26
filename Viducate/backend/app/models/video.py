from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Video(Base):
    __tablename__ = "video"

    vid = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    title = Column(String(500), nullable=False)
    url = Column(String(1000))
    duration = Column(Integer)
    language = Column(String(10), default="en")
    processing_status = Column(String(50), default="uploaded")
    upload_date = Column(TIMESTAMP, server_default=func.now())
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="videos")
    summaries = relationship("VideoSummary", back_populates="video")
    slides = relationship("Slide", back_populates="video")
    segments = relationship("TopicSegment", back_populates="video")
    chats = relationship("ChatHistory", back_populates="video")
    mindmap = relationship("Mindmap", uselist=False, back_populates="video")
