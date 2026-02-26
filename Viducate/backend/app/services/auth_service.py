from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, create_access_token
from app.schemas.user import UserRegisterRequest
from fastapi import HTTPException, status
from datetime import timedelta
from app.config import settings


class AuthService:

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register(self, request: UserRegisterRequest):
     
        # Check if email already exists
        existing_user = self.user_repo.get_by_email(request.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists"
            )

        # Hash the password
        hashed = hash_password(request.password)

        # Build user data dict
        user_data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "password": hashed,              
            "study_field": request.study_field,
            "language_preference": request.language_preference,
            "account_status": "active",
        }

        # Save to DB
        new_user = self.user_repo.create(user_data)

        # Create JWT token
        token = create_access_token(
            data={"sub": str(new_user.id), "email": new_user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return new_user, token
