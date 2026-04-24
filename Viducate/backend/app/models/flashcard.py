from sqlalchemy import Column, Integer, Text, String, TIMESTAMP, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Flashcard(Base):
    __tablename__ = "flashcard"

    flashcard_id = Column(Integer, primary_key=True, autoincrement=True)
    segment_id   = Column(
        Integer,
        ForeignKey("topic_segment.segment_id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    video_id     = Column(
        Integer,
        ForeignKey("video.vid", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    question     = Column(Text, nullable=False)
    answer       = Column(Text, nullable=False)
    language     = Column(String(10), default="en")
    difficulty   = Column(String(20), default="medium")   # easy / medium / hard
    created_at   = Column(TIMESTAMP, server_default=func.now())

    segment = relationship("TopicSegment", back_populates="flashcards")