import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.flashcard_service import FlashcardService
from app.schemas.flashcard_schema import FlashcardsVideoResponse, FlashcardsBySegmentResponse

router   = APIRouter(prefix="/flashcards", tags=["Flashcards"])
security = HTTPBearer()
logger   = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.get(
    "/video/{video_id}",
    response_model=FlashcardsVideoResponse,
    status_code=status.HTTP_200_OK,
    summary="Get or generate flashcards for a video",
    description=(
        "Returns all flashcards grouped by segment. "
        "Generates them with Gemini on first call; subsequent calls return cached results."
    ),
)
def get_or_generate_flashcards(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = FlashcardService(db)
    result  = service.get_or_generate(video_id, current_user.id)
    logger.info(
        f"Flashcards returned: video_id={video_id}, "
        f"total={result['total_flashcards']}, cached={result['cached']}"
    )
    return result


@router.post(
    "/video/{video_id}/regenerate",
    response_model=FlashcardsVideoResponse,
    status_code=status.HTTP_200_OK,
    summary="Regenerate flashcards for a video",
    description="Deletes existing flashcards and regenerates fresh ones using Gemini.",
)
def regenerate_flashcards(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = FlashcardService(db)
    result  = service.regenerate(video_id, current_user.id)
    logger.info(f"Flashcards regenerated: video_id={video_id}")
    return result


@router.get(
    "/video/{video_id}/segment/{segment_id}",
    response_model=FlashcardsBySegmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get flashcards for one segment",
)
def get_flashcards_by_segment(
    video_id:   int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = FlashcardService(db)
    return service.get_or_generate_segment(video_id, segment_id, current_user.id)



@router.post(
    "/video/{video_id}/segment/{segment_id}/generate",
    response_model=FlashcardsBySegmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate flashcards for a specific segment",
    description="Generates (or returns cached) flashcards for a single segment by ID.",
)
def generate_flashcards_for_segment_endpoint(
    video_id:   int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = FlashcardService(db)
    return service.get_or_generate_segment(video_id, segment_id, current_user.id)