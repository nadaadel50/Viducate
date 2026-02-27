from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, create_access_token
from app.schemas.user import UserRegisterRequest
from fastapi import HTTPException, status
from datetime import timedelta
from app.config import settings
from app.core.security import verify_password, decode_access_token
from datetime import datetime


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

    def login(self, email: str, password: str):
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        if user.failed_login_attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account locked due to multiple failed attempts"
            )

        if not verify_password(password, user.password):
            user.failed_login_attempts += 1
            self.user_repo.update(user)

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Successful login
        user.failed_login_attempts = 0
        user.last_login = datetime.utcnow()
        self.user_repo.update(user)

        # Create JWT
        token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email
            },
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return token, user
    
    def get_current_user(self, token: str):
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )

        user_id = payload.get("sub")
        user = self.user_repo.get_by_id(int(user_id))

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user
    
    def logout(self, token: str):
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return True