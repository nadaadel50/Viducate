import os
import logging
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.ocr_schema import OCRTriggerRequest, OCRResponse
from app.services.ocr_service import OCRService
from app.repositories.video_repository import VideoRepository

router = APIRouter(prefix="/ocr", tags=["OCR"])
logger = logging.getLogger(__name__)


@router.post(
    "/process",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Run OCR pipeline for a video",
)
def process_video_ocr(
    request: OCRTriggerRequest,
    db: Session = Depends(get_db)
):
    video = VideoRepository(db).get_by_id(request.video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    service  = OCRService(db)
    segments = service.run(request.video_id)

    detected_language = "ar" if any(
        any('\u0600' <= c <= '\u06FF' for c in seg["text"])
        for seg in segments
    ) else "en"

    return {
        "video_id": request.video_id,
        "status":   "completed",
        "segments": segments,
        "total":    len(segments),
        "language": detected_language,
        "url_type": None
    }


@router.get(
    "/results/{video_id}",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Get saved OCR results from text file"
)
def get_ocr_results(
    video_id: int,
    db: Session = Depends(get_db)
):
    output_file = f"logs/ocr_outputs/ocr_video_{video_id}.txt"

    if not os.path.exists(output_file):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No OCR results for video {video_id}. Run /ocr/process first."
        )

    segments = []
    with open(output_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("[") and "]" in line:
                timestamp = line[1:line.index("]")]
                text      = line[line.index("]") + 2:]
                parts     = timestamp.split(":")
                seconds   = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
                segments.append({
                    "time":        float(seconds),
                    "timestamp":   timestamp,
                    "text":        text,
                    "lines":       text.split(" | "),
                    "frame_index": None,
                    "line_count":  len(text.split(" | "))
                })

    detected_language = "ar" if any(
        any('\u0600' <= c <= '\u06FF' for c in seg["text"])
        for seg in segments
    ) else "en"

    return {
        "video_id": video_id,
        "status":   "completed",
        "segments": segments,
        "total":    len(segments),
        "language": detected_language,
        "url_type": None
    }
