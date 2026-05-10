from sqlalchemy import Column, Integer, JSON, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class SegmentSummary(Base):
    __tablename__ = "segment_summary"

    summary_id = Column(Integer, primary_key=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"), unique=True)
    content = Column(JSON, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(TIMESTAMP, server_default=func.now())

    segment = relationship("TopicSegment", back_populates="segment_summary")
