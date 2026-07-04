import logging
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.repositories.segment_repository import SegmentRepository
from app.schemas.segment_schema import SegmentResponse, VideoSegmentsResponse, VideoQualityResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.repositories.video_repository import VideoRepository

from typing import Optional
from app.models.topic_segment import TopicSegment

router = APIRouter(prefix="/segments", tags=["Segments"])
logger = logging.getLogger(__name__)
security = HTTPBearer()


# AUTH
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


# GET SEGMENTS BY VIDEO
@router.get(
    "/videos/{video_id}",
    response_model=VideoSegmentsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all segments of a video",
)
def get_segments_by_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = SegmentRepository(db)
    segments = repo.get_by_video(video_id)

    video_repo = VideoRepository(db)
    video = video_repo.get_by_id(video_id)

    return {
        "video_id": video_id,
        "title":video.title,
        "video_url": video.url if video else None,
        "current_time" :video.current_time ,       
        "last_watched_at" :video.last_watched_at,
        "bookmarks":video.bookmarks,
        "segments": [
            {
                "segment_id": s.segment_id,
                "segment_number": s.segment_number,
                "start_time": s.start_time,
                "end_time": s.end_time,
                "main_topic": s.main_topic,
                "title": s.title,
                "is_completed": s.is_completed,
                "sub_topics": [
                    {
                        "name": st.name,
                        "start_time": st.start_time,
                    }
                    for st in s.subtopics
                ],
                "quality_score":  s.quality_score,
                "quality_flag":   s.quality_flag,
                "retry_count":    s.retry_count,
            }
            for s in segments
        ]
    }


@router.get(
    "/videos/{video_id}/quality",
    response_model=VideoQualityResponse,
    status_code=status.HTTP_200_OK,
    summary="Get quality scores for all segments of a video",
    description=(
        "Returns per-segment quality scores. "
        "quality_flag=true means the segment's generated content did not "
        "pass the semantic similarity threshold and may need regeneration."
    ),
)
def get_video_quality(
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

    scored   = [s for s in segments if s.quality_score is not None]
    avg      = round(sum(s.quality_score for s in scored) / len(scored), 4) if scored else None
    flagged  = sum(1 for s in segments if s.quality_flag)

    return {
        "video_id":         video_id,
        "total_segments":   len(segments),
        "flagged_segments": flagged,
        "average_score":    avg,
        "segments": [
            {
                "segment_id":     s.segment_id,
                "segment_number": s.segment_number,
                "title":          s.title,
                "quality_score":  s.quality_score,
                "quality_flag":   s.quality_flag,
                "retry_count":    s.retry_count,
            }
            for s in segments
        ],
    }
