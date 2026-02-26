from sqlalchemy import Column, Integer, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class AnswerOption(Base):
    __tablename__ = "answer_options"

    option_id = Column(Integer, primary_key=True)
    ques_id = Column(Integer, ForeignKey("question.ques_id", ondelete="CASCADE"))
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    question = relationship("Question", back_populates="options")

