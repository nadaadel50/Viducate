from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/summaries", tags=["Summaries"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.get("/video/{video_id}")
def get_video_summary(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SummaryService(db)
    return service.get_or_generate_video_summary(video_id, current_user.id)


@router.get("/video/{video_id}/segments")
def get_segment_summaries(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SummaryService(db)
    return service.get_or_generate_segment_summaries(video_id, current_user.id)

@router.get("/video/{video_id}/segment/{segment_id}")
def get_segment_summary(
    video_id: int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SummaryService(db)
    return service.get_or_generate_single_segment_summary(video_id, segment_id, current_user.id)