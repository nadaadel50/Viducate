import logging
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.repositories.segment_repository import SegmentRepository
from app.schemas.segment_schema import SegmentResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials



router = APIRouter(prefix="/segments", tags=["Segments"])
logger = logging.getLogger(__name__)
security = HTTPBearer()


# =========================
# AUTH
# =========================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)



# =========================
# GET SEGMENTS BY VIDEO
# =========================
@router.get(
    "/videos/{video_id}",
    response_model=list[SegmentResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all segments of a video",
)
def get_segments_by_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = SegmentRepository(db)
    return repo.get_by_video(video_id)

# =========================
# DELETE SEGMENT
# =========================
@router.delete(
    "/{segment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete segment",
)
def delete_segment(
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = SegmentRepository(db)
    return repo.delete(segment_id)