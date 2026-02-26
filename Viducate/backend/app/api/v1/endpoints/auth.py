from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.user import UserRegisterRequest, RegisterResponse, UserResponse, TokenResponse
from app.services.auth_service import AuthService
from app.dependencies import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

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
    new_user, token = service.register(request)

    return RegisterResponse(
        message="Account created successfully",
        user=UserResponse.model_validate(new_user),
        token=TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(new_user)
        )
    )
