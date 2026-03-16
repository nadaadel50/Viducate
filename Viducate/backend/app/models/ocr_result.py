from sqlalchemy import Column, Integer, Float, Text, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.models.base import Base


class OCRResult(Base):
    __tablename__ = "ocr_result"

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(
        Integer,
        ForeignKey("video.vid", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    timestamp_seconds = Column(Float, nullable=False)   # 12.5
    timestamp_label = Column(String(12), nullable=False) # "00:00:12"
    text = Column(Text, nullable=False)                  # cleaned OCR text
    raw_lines = Column(Text, nullable=True)              # original lines joined by |
    frame_index = Column(Integer, nullable=True)         # which frame number
    created_at = Column(TIMESTAMP, server_default=func.now())