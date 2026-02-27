from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    study_field = Column(String(100))
    language_preference = Column(String(10), default='en')
    account_status = Column(String(20), default='active')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    failed_login_attempts = Column(Integer, default=0)

    # videos = relationship("Video", back_populates="user")
    # dashboard = relationship("UserDashboard", uselist=False, back_populates="user")
    settings = relationship("Settings", uselist=False, back_populates="user")
    # quiz_attempts = relationship("UserQuizAttempts", back_populates="user")
    # chats = relationship("ChatHistory", back_populates="user")
    # stuck_events = relationship("StuckEvent", back_populates="user")
