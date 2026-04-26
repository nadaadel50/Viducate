from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.preferences_service import PreferencesService
from app.schemas.preferences import ContentPreferencesRequest, ContentPreferencesResponse

router = APIRouter(prefix="/preferences", tags=["Preferences"])
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.put(
    "/content-language",
    response_model=ContentPreferencesResponse,
    status_code=status.HTTP_200_OK,
    summary="Save content language preferences for a video",
)
def save_preferences(
    request: ContentPreferencesRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = PreferencesService(db)
    return service.save(current_user.id, request)


@router.get(
    "/content-language/{video_id}",
    response_model=ContentPreferencesResponse,
    status_code=status.HTTP_200_OK,
    summary="Get content language preferences for a video",
)
def get_preferences(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = PreferencesService(db)
    return service.get(current_user.id, video_id)