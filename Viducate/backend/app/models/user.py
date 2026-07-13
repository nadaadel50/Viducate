from sqlalchemy import Column, Integer, String, TIMESTAMP,DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum
class AuthProvider(str, enum.Enum):
    LOCAL = "local"
    GOOGLE = "google"
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=True)
    study_field = Column(String(100))
    language_preference = Column(String(10), default='en')
    account_status = Column(String(20), default='active')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    failed_login_attempts = Column(Integer, default=0)
    reset_token = Column(String,nullable=True)
    reset_token_expires = Column(DateTime,nullable=True)
    oauth_provider = Column(String(50), nullable=True) 
    oauth_id = Column(String(255), nullable=True)
    profile_picture = Column(String, nullable=True)
    is_email_verified = Column(Boolean, default=False)
    locked_until = Column(DateTime, nullable=True)

    videos = relationship("Video", back_populates="user")
    content_preferences = relationship("ContentPreferences", back_populates="user")
    settings = relationship("Settings", uselist=False, back_populates="user")
    

