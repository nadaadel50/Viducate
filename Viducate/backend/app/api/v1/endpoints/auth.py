from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.schemas.user import ForgetPasswordRequest, ForgetPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, UserRegisterRequest, RegisterResponse, UserResponse, TokenResponse, UserLoginRequest
from app.services.auth_service import AuthService
from app.dependencies import get_db
import logging
from app.services.oauth import oauth
from app.config import settings 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()
router = APIRouter()
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    service = AuthService(db)
    service.logout(token)

    logger.info("User logged out successfully")
    return {"message": "Logged out successfully"}


@router.post(
    "/forgot-password",
    response_model=ForgetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Request password reset",
    description="Sends password reset email if account exists"
)
async def forgot_password(
    request: ForgetPasswordRequest,
    db: Session = Depends(get_db)
):
    service = AuthService(db)
    
    logger.info(f"Password reset requested for: {request.email}")
    
    result =await service.request_password_reset(request)
    
    return ForgetPasswordResponse(**result)


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Reset password",
    description="Resets password using token from email"
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    service = AuthService(db)
    
    logger.info(f"Password reset attempt with token: {request.token[:10]}...")
    
    result = service.reset_password(request)
    
    logger.info("Password reset completed successfully")
    
    return ResetPasswordResponse(**result)

# http://localhost:8000/api/v1/auth/google/login
@router.get(
    "/google/login",
    summary="Login with Google",
    description="Redirects user to Google OAuth consent screen"
)
async def google_login(request: Request):
    logger.info("Initiating Google OAuth login")
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        print("TOKEN RESPONSE:", token)

        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        google_id = user_info.get('sub')
        email = user_info.get('email')
        full_name = user_info.get('name')
        picture_url = user_info.get('picture')
        email_verified = user_info.get('email_verified', False)

        service = AuthService(db)
        access_token, user = service.oauth_login(
            email=email,
            full_name=full_name,
            oauth_provider="google",
            oauth_id=google_id,
            picture_url=picture_url,
            is_verified=email_verified
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": email
        }

    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        error_redirect = f"{settings.FRONTEND_URL}/auth/error?message=google_oauth_failed"
        return RedirectResponse(url=error_redirect)
