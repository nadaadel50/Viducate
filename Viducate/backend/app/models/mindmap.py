from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Mindmap(Base):
    __tablename__ = "mindmap"

    map_id = Column(Integer, primary_key=True)
    video_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"), unique=True)
    structure_json = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="mindmap")
