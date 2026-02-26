from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class StuckEvent(Base):
    __tablename__ = "stuck_event"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"))
    pause_duration = Column(Integer)
    rewatch_count = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="stuck_events")
    segment = relationship("TopicSegment")


