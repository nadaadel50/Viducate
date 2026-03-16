from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class TopicSegment(Base):
    __tablename__ = "topic_segment"

    segment_id = Column(Integer, primary_key=True)
    vid_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"))
    segment_number = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    maintopic = Column(Text)
    start_time = Column(Integer, nullable=False)
    end_time = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="segments")
    segment_summary = relationship("SegmentSummary", uselist=False, back_populates="segment")
    subtopics = relationship("Subtopic", back_populates="segment")
    keypoints = relationship("Keypoint", back_populates="segment")
    quizzes = relationship("Quiz", back_populates="segment")

    __table_args__ = (UniqueConstraint("vid_id", "segment_number", name="uq_vid_segment"),)
