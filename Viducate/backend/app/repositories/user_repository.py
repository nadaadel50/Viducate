from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

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
    
    # Get User by reset token
    def get_by_reset_token(self, token: str):
        return self.db.query(User).filter(User.reset_token==token).first()
    
    def get_by_oauth(self, provider: str, oauth_id: str):
        return (
            self.db.query(User)
            .filter(
                User.oauth_provider == provider,
                User.oauth_id == oauth_id
            )
            .first()
        )
    
    def update_language(self, user, language: str):
        user.language_preference = language
        self.db.commit()
        self.db.refresh(user)
        return user
    

    def delete_user(self, user_id: int) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True
        