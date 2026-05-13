import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.studynotes_service import StudyNotesService
from app.schemas.studynotes_schema import (VideoStudyNotesResponse, SegmentStudyNotesResponse)

router = APIRouter(prefix="/studynotes", tags=["Study Notes"])
security = HTTPBearer()
logger = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.get(
    "/video/{video_id}",
    response_model=VideoStudyNotesResponse,
    status_code=status.HTTP_200_OK,
    summary="Get or generate study notes for a video",
)
def get_or_generate_video_studynotes(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = StudyNotesService(db)
    result = service.get_or_generate_video_studynotes(video_id, current_user.id)
    logger.info(
        f"Study notes returned | video_id={video_id} | cached={result['cached']}"
    )
    return result


@router.post(
    "/video/{video_id}/regenerate",
    response_model=VideoStudyNotesResponse,
    status_code=status.HTTP_200_OK,
    summary="Regenerate study notes for a video",
)
def regenerate_video_studynotes(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = StudyNotesService(db)
    result = service.regenerate_video_studynotes(video_id, current_user.id)
    logger.info(f"Study notes regenerated | video_id={video_id}")
    return result


@router.get(
    "/video/{video_id}/segment/{segment_id}",
    response_model=SegmentStudyNotesResponse,
    status_code=status.HTTP_200_OK,
    summary="Get or generate study notes for a single segment",
)
def get_or_generate_segment_studynotes(
    video_id: int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = StudyNotesService(db)
    result = service.get_or_generate_segment_studynotes(
        video_id, segment_id, current_user.id
    )
    logger.info(
        f"Segment study notes returned | video_id={video_id} | segment_id={segment_id}"
    )
    return result