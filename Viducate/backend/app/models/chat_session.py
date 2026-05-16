from sqlalchemy import TIMESTAMP, Column, ForeignKey,Integer,DateTime, String, func
from .base import Base
from sqlalchemy.orm import relationship



class ChatSession(Base):
    __tablename__ = "chat_sessions"
    session_id  = Column(Integer, primary_key=True, autoincrement=True)
    title      = Column(String(255), nullable=True) 
    video_id    = Column(Integer, ForeignKey("video.vid"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    messages = relationship("ChatMessage", back_populates="session",cascade="all, delete-orphan")
    video = relationship("Video",back_populates="sessions")