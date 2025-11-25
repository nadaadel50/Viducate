import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env")

engine = create_engine(DATABASE_URL, echo=True, future=True)

from models.base import Base

from models.user import User
from models.user_analytics import UserAnalytics
from models.settings import Settings
from models.video import Video
from models.video_summary import VideoSummary
from models.slide import Slide
from models.topic_segment import TopicSegment
from models.segment_summary import SegmentSummary
from models.subtopics import Subtopic
from models.keypoints import Keypoint
from models.quiz import Quiz
from models.question import Question
from models.answer_options import AnswerOption
from models.user_quiz_attempts import UserQuizAttempts
from models.chat_history import ChatHistory
from models.stuck_event import StuckEvent
from models.mindmap import Mindmap

def create_tables():
    Base.metadata.create_all(bind=engine)
    print(" All tables created successfully!")

    # تأكيد الجداول
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
        ))
        tables = [row[0] for row in result]
        print("\n Current tables in database:")
        for table in tables:
            print(f" - {table}")

if __name__ == "__main__":
    create_tables()
