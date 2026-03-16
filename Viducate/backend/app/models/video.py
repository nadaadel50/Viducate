from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Video(Base):
    __tablename__ = "video"

    vid = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    title = Column(String(500), nullable=False)
    url = Column(String(1000))
    s3_key = Column(String(1000), nullable=True)
    duration = Column(Integer)
    language = Column(String(10), default="en")
    subject = Column(String(255), nullable=True)
    processing_status = Column(String(50), default="uploaded")
    upload_date = Column(TIMESTAMP, server_default=func.now())
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="videos")
    
