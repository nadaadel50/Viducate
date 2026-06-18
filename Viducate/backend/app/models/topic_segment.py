from sqlalchemy import Boolean, Column, Integer, String, Text, TIMESTAMP, ForeignKey, UniqueConstraint, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class TopicSegment(Base):
    __tablename__ = "topic_segment"

    segment_id = Column(Integer, primary_key=True)
    vid_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"))
    segment_number = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    main_topic = Column(Text)
    start_time = Column(Integer, nullable=False)
    end_time = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    is_completed = Column(Boolean, default=False)

    # Quality validation columns
    quality_score  = Column(Float,   nullable=True)
    quality_flag   = Column(Boolean, server_default='false', nullable=False)
    retry_count    = Column(Integer, server_default='0',     nullable=False)

    video = relationship("Video", back_populates="segments")
    keypoints = relationship("Keypoint", back_populates="segment", cascade="all, delete-orphan")
    subtopics = relationship("Subtopic", back_populates="segment", cascade="all, delete-orphan")
    
    segment_summary = relationship("SegmentSummary", uselist=False, back_populates="segment")
    flashcards     = relationship("Flashcard",       back_populates="segment", cascade="all, delete-orphan")  
    quizzes = relationship("Quiz", back_populates="segment", cascade="all, delete-orphan")
    segment_studynotes = relationship("SegmentStudyNotes", uselist=False, back_populates="segment", cascade="all, delete-orphan")

    __table_args__ = (UniqueConstraint("vid_id", "segment_number", name="uq_vid_segment"),)
