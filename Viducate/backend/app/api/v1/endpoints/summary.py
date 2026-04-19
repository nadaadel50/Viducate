from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.models.video_summary import VideoSummary
from app.models.segment_summary import SegmentSummary
from app.models.topic_segment import TopicSegment

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
    summary = db.query(VideoSummary).filter(VideoSummary.video_id == video_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found. Video may still be processing.")
    return {
        "video_id": video_id,
        "summary": summary.content,
        "language": summary.language,
        "created_at": summary.created_at,
    }


@router.get("/video/{video_id}/segments")
def get_all_segment_summaries(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    segments = (
        db.query(TopicSegment)
        .filter(TopicSegment.vid_id == video_id)
        .order_by(TopicSegment.segment_number)
        .all()
    )
    if not segments:
        raise HTTPException(status_code=404, detail="No segments found for this video.")

    result = []
    for seg in segments:
        summary = db.query(SegmentSummary).filter(
            SegmentSummary.segment_id == seg.segment_id
        ).first()
        result.append({
            "segment_id": seg.segment_id,
            "segment_number": seg.segment_number,
            "title": seg.title,
            "start_time": seg.start_time,
            "end_time": seg.end_time,
            "summary": summary.content if summary else None,
            "language": summary.language if summary else None,
        })
    return result