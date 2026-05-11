import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.mindmap_service import MindmapService
from app.schemas.mindmap_schema import MindmapResponse

router   = APIRouter(prefix="/mindmap", tags=["Mindmap"])
security = HTTPBearer()
logger   = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.get(
    "/video/{video_id}",
    response_model=MindmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Get or generate mind map for a video",
    description=(
        "Returns a React-Flow-compatible mind map (nodes + edges) for the full video. "
        "Generates it with Groq on the first call; subsequent calls return the cached result. "
        "Language is detected automatically from the video's segmented text."
    ),
)
def get_or_generate_mindmap(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = MindmapService(db)
    result  = service.get_or_generate(video_id, current_user.id)
    logger.info(
        f"Mindmap returned | video_id={video_id} | "
        f"nodes={len(result['nodes'])} | cached={result['cached']}"
    )
    return result


@router.post(
    "/video/{video_id}/regenerate",
    response_model=MindmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Regenerate mind map for a video",
    description="Deletes the cached mind map and generates a fresh one using Groq.",
)
def regenerate_mindmap(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = MindmapService(db)
    result  = service.regenerate(video_id, current_user.id)
    logger.info(f"Mindmap regenerated | video_id={video_id}")
    return result