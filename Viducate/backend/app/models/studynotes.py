from sqlalchemy import Column, Integer, JSON, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class VideoStudyNotes(Base):
    __tablename__ = "video_studynotes"

    notes_id   = Column(Integer, primary_key=True)
    video_id   = Column(
        Integer,
        ForeignKey("video.vid", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    content    = Column(JSON, nullable=False)
    language   = Column(String(10), default="en")
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="video_studynotes")


class SegmentStudyNotes(Base):
    __tablename__ = "segment_studynotes"

    notes_id   = Column(Integer, primary_key=True)
    segment_id = Column(
        Integer,
        ForeignKey("topic_segment.segment_id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    content    = Column(JSON, nullable=False)  
    language   = Column(String(10), default="en")
    created_at = Column(TIMESTAMP, server_default=func.now())

    segment = relationship("TopicSegment", back_populates="segment_studynotes")