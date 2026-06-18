import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.report_service import ReportService
from app.schemas.report_schema import VideoReportResponse

router   = APIRouter(prefix="/reports", tags=["Reports"])
security = HTTPBearer()
logger   = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.get(
    "/video/{video_id}",
    response_model=VideoReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Get learning report for a video",
)
def get_video_report(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ReportService(db)
    result  = service.get_report(video_id, current_user.id)

    logger.info(
        f"Report served | video_id={video_id} | user={current_user.id} | "
        f"score={result['overall_score_in_video']}"
    )
    return result