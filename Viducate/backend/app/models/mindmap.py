from sqlalchemy import Column, Integer, JSON, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Mindmap(Base):
    __tablename__ = "mindmap"

    map_id     = Column(Integer, primary_key=True, autoincrement=True)
    video_id   = Column(
        Integer,
        ForeignKey("video.vid", ondelete="CASCADE"),
        nullable=False,
        unique=True,          
        index=True,
    )
    nodes      = Column(JSON, nullable=False)   
    edges      = Column(JSON, nullable=False)   
    language   = Column(String(10), default="en")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    video = relationship("Video", back_populates="mindmap")