import logging
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.dependencies import get_db
from app.schemas.ocr_schema import OCRTriggerRequest, OCRResponse, OCRSegment
from app.services.ocr_service import OCRService
from app.repositories.ocr_repository import OCRRepository

router = APIRouter(prefix="/ocr", tags=["OCR"])
logger = logging.getLogger(__name__)


@router.post(
    "/process",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Run OCR pipeline for a video",
    description=(
        "Pass video_id — fetches URL and language from DB automatically, "
        "runs PaddleOCR on slide frames, saves results, returns segments."
    )
)
def process_video_ocr(
    request: OCRTriggerRequest,
    db: Session = Depends(get_db)
):
    """
    Triggers the OCR pipeline for a given video ID.
    """
    service = OCRService(db)
    return service.run(request.video_id)


@router.get(
    "/results/{video_id}",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Get saved OCR results for a video"
)
def get_ocr_results(
    video_id: int,
    db: Session = Depends(get_db)
):
    """
    Returns already-saved OCR results without rerunning.
    Used by merge logic after both Whisper + OCR complete.
    """
    repo = OCRRepository(db)
    video = repo.get_video_by_id(video_id)

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    results = repo.get_ocr_results(video_id)  # returns list of dicts

    # Convert dict results to Pydantic OCRSegment models
    segments: List[OCRSegment] = []
    for r in results:
        segment = OCRSegment(
            time=r["time"],                 # float seconds
            timestamp=r["timestamp"],        # formatted HH:MM:SS
            text=r["text"],
            lines=r.get("lines", []),        # list of strings (JSON field)
            frame_index=r.get("frame_index"),
            line_count=r.get("line_count")
        )
        segments.append(segment)

    # Extract language and url_type from video record (assumed ORM object)
    language = getattr(video, 'language', None) or "en"
    url_type = getattr(video, 'url_type', None) or "youtube"

    return OCRResponse(
        video_id=video_id,
        status=video.processing_status,
        segments=segments,
        total=len(segments),
        language=language,
        url_type=url_type
    )