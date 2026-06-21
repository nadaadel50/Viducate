from sqlalchemy import JSON, Column, Integer, Text, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Quiz(Base):
    __tablename__ = "quiz"

    quiz_id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(Integer, ForeignKey("video.vid", ondelete="CASCADE"), nullable=False, index=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="CASCADE"), nullable=True, index=True)
    # null segment_id  → whole-video quiz
    # non-null         → single-segment quiz
    difficulty = Column(String(20), default="medium")   # easy | medium | hard
    language = Column(String(10), default="en")
    quiz_type = Column(String(20), default="segment")   # "segment" | "video"
    created_at = Column(TIMESTAMP, server_default=func.now())

    video = relationship("Video", back_populates="quizzes")
    segment = relationship("TopicSegment", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    result = relationship("UserQuizResult", back_populates="quiz", uselist=False, cascade="all, delete-orphan")



class QuizQuestion(Base):
    __tablename__ = "quiz_question"
    question_id = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id = Column(Integer, ForeignKey("quiz.quiz_id", ondelete="CASCADE"), nullable=False, index=True)
    segment_id = Column(Integer, ForeignKey("topic_segment.segment_id", ondelete="SET NULL"), nullable=True)
    # Always store which segment this question belongs to (even in video-level quiz)

    question_text = Column(Text, nullable=False)
    choice_a = Column(Text, nullable=False)
    choice_b = Column(Text, nullable=False)
    choice_c = Column(Text, nullable=False)
    choice_d = Column(Text, nullable=False)
    correct_answer = Column(String(1), nullable=False)   
    correct_answer_text = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    video_timestamp = Column(Integer, nullable=True)     # seconds 
    timestamp_label = Column(String(12), nullable=True)  # "00:02:35"
    created_at = Column(TIMESTAMP, server_default=func.now())
    concept = Column(String(255), nullable=True)

    quiz = relationship("Quiz", back_populates="questions")
    segment = relationship("TopicSegment")


class UserQuizResult(Base):
    __tablename__ = "user_quiz_results"

    __table_args__ = (
        UniqueConstraint("quiz_id", "user_id", name="uq_quiz_user"),
    )

    id             = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id        = Column(Integer, ForeignKey("quiz.quiz_id", ondelete="CASCADE"), nullable=False)
    user_id        = Column(Integer, ForeignKey("user.id",      ondelete="CASCADE"), nullable=False)
    correct_count  = Column(Integer, nullable=False)
    wrong_count    = Column(Integer, nullable=False)
    score          = Column(Integer, nullable=False)         
    trials         = Column(Integer, nullable=False, default=1)
    answers        = Column(JSON, nullable=True)          
    submitted_at   = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    quiz = relationship("Quiz", back_populates="result")