from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    # Find user by email by checking if email already exists
    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    # Create new user
    def create(self, user_data: dict) -> User:
        db_user = User(**user_data)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user) 
        return db_user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user