from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, Text
from .base import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func



class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.session_id"))
    question   = Column(Text, nullable=False)
    answer     = Column(Text, nullable=False)
    current_time    = Column(Integer, nullable=True)
    question_at     = Column(TIMESTAMP, server_default=func.now())  
    answer_at       = Column(TIMESTAMP, nullable=True) 

    session = relationship("ChatSession", back_populates="messages")