import secrets
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, create_access_token
from app.schemas.user import UserRegisterRequest , ForgetPasswordRequest,ResetPasswordRequest
from fastapi import HTTPException, status
from datetime import timedelta
from app.config import settings
from app.core.security import verify_password, decode_access_token
from datetime import datetime
from app.services import email_service

LOCKOUT_DURATION_MINUTES = 15
MAX_LOGIN_ATTEMPTS = 5

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
        
        # Check if account is temporarily locked
        if user.locked_until and datetime.utcnow() < user.locked_until:
            remaining = int((user.locked_until - datetime.utcnow()).total_seconds() / 60)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account temporarily locked due to too many failed attempts. Remaining time: {remaining} minutes.",
            )

         # If lockout period has expired, reset the counter automatically
        if user.locked_until and datetime.utcnow() >= user.locked_until:
            user.failed_login_attempts = 0
            user.locked_until = None
            self.user_repo.update(user)

        if not verify_password(password, user.password):
            user.failed_login_attempts += 1

            # Lock the account when max attempts reached
            if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
                self.user_repo.update(user)
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Too many failed attempts. Account locked for {LOCKOUT_DURATION_MINUTES} minutes.",
                )

            attempts_left = MAX_LOGIN_ATTEMPTS - user.failed_login_attempts
            self.user_repo.update(user)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )

        # Successful login
        user.failed_login_attempts = 0
        user.locked_until = None
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
    

#User Forget Password and request to reset password 

    async def request_password_reset(self,request:ForgetPasswordRequest):
        
        existing_user = self.user_repo.get_by_email(request.email)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email not exists")
                
        
        if existing_user.oauth_provider is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This account is registered using {existing_user.oauth_provider}. Please sign in with {existing_user.oauth_provider} instead."
            )
        
        reset_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        existing_user.reset_token = reset_token
        existing_user.reset_token_expires = expires_at
        self.user_repo.update(existing_user)

        reset_url =  f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        await email_service.send_reset_email(existing_user.email, reset_url)    

        return{ "message": "If an account with that email exists, "
                      "we've sent password reset instructions."
        }


    def reset_password(self, request:ResetPasswordRequest):
        user = self.user_repo.get_by_reset_token(request.token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Check if token expired
        if user.reset_token_expires < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired. Please request a new one."
            )
        

        hashed_password = hash_password(request.new_password)
        user.password = hashed_password
        user.reset_token = None 
        user.reset_token_expires = None
        user.failed_login_attempts = 0 
        user.locked_until = None
        self.user_repo.update(user)
        return {"message": "Password reset successful! You can now login."}


    def oauth_login(
    self,
    email: str,
    full_name: str,
    oauth_provider: str,
    oauth_id: str,
    picture_url: str,
    is_verified: bool):
        user = self.user_repo.get_by_oauth(oauth_provider, oauth_id)

        if user:
            token = create_access_token(
                data={"sub": str(user.id), "email": user.email},
                expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            )

            return token, user

        user = self.user_repo.get_by_email(email)
        if user:
            user.oauth_provider = oauth_provider
            user.oauth_id = oauth_id
            user.profile_picture = picture_url
            user.is_email_verified = is_verified

            self.user_repo.update(user)

        else:
            first_name = full_name.split(" ")[0]
            last_name = full_name.split(" ")[-1]

            user_data = {
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": None, 
                "study_field": None,
                "language_preference": "en",
                "account_status": "active",
                "oauth_provider": oauth_provider,
                "oauth_id": oauth_id,
                "profile_picture": picture_url,
                "is_email_verified": is_verified
            }

            user = self.user_repo.create(user_data)

        token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return token, user
    

