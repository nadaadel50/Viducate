from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.schemas.user import ForgetPasswordRequest, ForgetPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, UserRegisterRequest, RegisterResponse, UserResponse, TokenResponse, UserLoginRequest, UpdateLanguageRequest
from app.services.auth_service import AuthService
from app.dependencies import get_db
import logging
from app.services.oauth import oauth
from app.config import settings 
from app.services.oauth import oauth
from app.config import settings 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)
security = HTTPBearer()

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new account and returns the user with a JWT access token"
)

def register(
    request: UserRegisterRequest,
    db: Session = Depends(get_db)       
):
    service = AuthService(db)
    logger.info(f"Registration attempt for email: {request.email}")
    new_user, token = service.register(request)
    logger.info(f"User registered successfully: {new_user.email} (ID: {new_user.id})")

    return RegisterResponse(
        message="Account created successfully",
        user=UserResponse.model_validate(new_user),
        token=TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(new_user)
        )
    )

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login user",
    description="Authenticates user and returns JWT token"
)
def login(
    request: UserLoginRequest,
    db: Session = Depends(get_db)
):
    service = AuthService(db)

    logger.info(f"Login attempt: {request.email}")

    token, user = service.login(email=request.email, password=request.password)

    logger.info(f"Login successful: {user.email} (ID: {user.id})")

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description="Returns authenticated user profile"
)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    service = AuthService(db)
    token = credentials.credentials
    user = service.get_current_user(token)

    logger.info(f"User profile accessed: {user.email}")

    print("TOKEN RECEIVED:", token)
    return UserResponse.model_validate(user)    


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout user",
    description="Logs user logout event"
)
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user info")

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

        frontend_redirect = f"{settings.FRONTEND_URL}/auth/callback#access_token={access_token}&token_type=bearer"
        return RedirectResponse(url=frontend_redirect)

    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        error_redirect = f"{settings.FRONTEND_URL}/auth/error?message=google_oauth_failed"
        return RedirectResponse(url=error_redirect)
    