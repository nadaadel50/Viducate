from sqlalchemy import Column, Integer, Text, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Slide(Base):
    __tablename__ = "slide"

    slide_id = Column(Integer, primary_key=True)
    vid_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"))
    slide_num = Column(Integer, nullable=False)
    text = Column(Text)
    timestamp = Column(Integer)
    image_path = Column(String(1000))
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="slides")
    __table_args__ = (UniqueConstraint("vid_id", "slide_num", name="uq_vid_slide"),)
