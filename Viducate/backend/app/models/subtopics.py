from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Subtopic(Base):
    __tablename__ = "subtopics"

    subtopic_id = Column(Integer, primary_key=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"))
    name = Column(String(500), nullable=False)
    description = Column(Text,nullable=False)
    start_time = Column(Integer)
    end_time = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())


    segment = relationship("TopicSegment", back_populates="subtopics")
