from sqlalchemy import JSON, BigInteger, Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Video(Base):
    __tablename__ = "video"


    vid = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    title = Column(String(500), nullable=False)
    url = Column(String(1000))
    s3_key = Column(String(1000), nullable=True)
    duration = Column(Integer)
    language = Column(String(10), default="en")
    subject = Column(String(255), nullable=True)
    processing_status = Column(String(50), default="uploaded")
    upload_date = Column(TIMESTAMP, server_default=func.now())
    created_at = Column(TIMESTAMP, server_default=func.now())

    content_hash = Column(String(64), index=True, nullable=True)

    # to dashboard
    file_size = Column(BigInteger, nullable=True)      
    storage_bytes = Column(BigInteger, default=0)     
    current_time = Column(Integer, default=0)          
    last_watched_at = Column(TIMESTAMP, nullable=True)  
    bookmarks = Column(JSON, default=[])  # [120, 350, 780]

    user = relationship("User", back_populates="videos")
    segments = relationship("TopicSegment",back_populates="video",cascade="all, delete-orphan")
    video_summary = relationship("VideoSummary", back_populates="video", uselist=False, cascade="all, delete-orphan")
    content_preferences = relationship("ContentPreferences", uselist=False, back_populates="video")
    quizzes = relationship("Quiz", back_populates="video", cascade="all, delete-orphan")
    sessions = relationship("ChatSession", back_populates="video")
    mindmap = relationship("Mindmap", back_populates="video", uselist=False, cascade="all, delete-orphan") 
    video_studynotes = relationship("VideoStudyNotes", back_populates="video", uselist=False, cascade="all, delete-orphan")
    
