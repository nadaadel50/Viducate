
from sqlalchemy.orm import Session
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from models import User, Video



def seed_data():
    with Session(engine) as session:
        user1 = User(
            first_name="Ahmed", last_name="Mohamed", email="ahmed@viducatee.com",
            password="hashed_password_123", study_field="Computer Science", 
            educational_level="Bachelor", language_preference="ar"
        )
        user2 = User(
            first_name="Sarah", last_name="Ali", email="sarah@viducatee.com",
            password="hashed_password_456", study_field="Engineering", 
            educational_level="Master", language_preference="en"
        )
        session.add_all([user1, user2])
        session.commit()

        video1 = Video(
            user_id=user1.id, title="Introduction to Database Systems",
            url="https://example.com/video1.mp4", duration=3600,
            language="en", section="Computer Science", processing_status="completed"
        )
        session.add(video1)
        session.commit()


        print(" Seed data added successfully!")

if __name__ == "__main__":
    seed_data()
