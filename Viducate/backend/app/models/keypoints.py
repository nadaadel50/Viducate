from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Keypoint(Base):
    __tablename__ = "keypoints"

    keypoint_id = Column(Integer, primary_key=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"))
    description = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


    segment = relationship("TopicSegment", back_populates="keypoints")

