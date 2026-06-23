from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UpdateLanguageRequest,UserProfileResponse
from app.schemas.profile_schema import UpdateProfileRequest

from app.services.profile_service import UpdateProfileService
from app.services.auth_service import AuthService

from app.dependencies import get_db
import logging
from app.services.oauth import oauth
from app.config import settings 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/profile", tags=["Profile"])
logger = logging.getLogger(__name__)
security = HTTPBearer()

@router.get(
    "/profile/get",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user profile",
    description="Returns current user profile data"
)
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    auth_service = AuthService(db)
    user = auth_service.get_current_user(token)  
    
    return UserProfileResponse(
        **UserResponse.model_validate(user).model_dump(),
        has_password=user.password is not None,
    )


@router.put("/profile/language")
def update_language(
    request: UpdateLanguageRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    service = AuthService(db)
    user = service.get_current_user(token)
    profile_service = UpdateProfileService(db)
    updated_user = profile_service.update_language(user.id, request.language)

    return {
        "message": "Language updated successfully",
        "language": updated_user.language_preference
    }

@router.patch(
    "/profile/UpdateAccount",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user profile",
)
def update_profile(
    request: UpdateProfileRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    auth_service = AuthService(db)
    user = auth_service.get_current_user(token)  

    profile_service = UpdateProfileService(db)
    updated_user = profile_service.update_profile(user.id, request)
    
    return UserResponse.model_validate(updated_user)


@router.delete(
    "/profile/DeleteAccount",
    status_code=status.HTTP_200_OK,
    summary="Delete account",
    description="Permanently deletes the authenticated user account"
)
def delete_account(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    auth_service = AuthService(db)
    user = auth_service.get_current_user(token)

    profile_service = UpdateProfileService(db)
    return profile_service.delete_account(user.id)