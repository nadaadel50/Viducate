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
    timestamp_seconds = Column(Float, nullable=False)   
    timestamp_label = Column(String(12), nullable=False) 
    text = Column(Text, nullable=False)                 
    raw_lines = Column(Text, nullable=True)             
    frame_index = Column(Integer, nullable=True)         
    created_at = Column(TIMESTAMP, server_default=func.now())