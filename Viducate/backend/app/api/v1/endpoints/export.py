import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.summary_service import SummaryService
from app.services.studynotes_service import StudyNotesService
from app.utils.export_pdf import generate_summary_pdf, generate_studynotes_pdf

router   = APIRouter(prefix="/export", tags=["Export"])
security = HTTPBearer()
logger   = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


def _pdf_response(pdf_bytes: bytes, filename: str) -> Response:
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )


def _safe_filename(text: str, max_len: int = 40) -> str:
    """Slugify a title for use in a filename."""
    import re
    slug = re.sub(r"[^\w\s-]", "", text or "document").strip()
    slug = re.sub(r"[\s]+", "_", slug)
    return slug[:max_len] or "document"


@router.get(
    "/summary/video/{video_id}",
    response_class=Response,
    responses={200: {"content": {"application/pdf": {}}}},
)
def download_video_summary_pdf(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SummaryService(db)
    data = service.get_or_generate_video_summary(video_id, current_user.id)

    content = data.get("summary")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not available for this video.",
        )

    video_title = data.get("title", f"Video {video_id}")
    doc_title   = f"Summary — {video_title}"
    filename    = f"summary_{_safe_filename(video_title)}.pdf"

    pdf_bytes = generate_summary_pdf(
        content=content,
        title=doc_title,
        video_title=video_title,
        reading_time=data.get("reading_time"),
    )

    logger.info(f"Summary PDF downloaded | video_id={video_id} | user={current_user.id}")
    return _pdf_response(pdf_bytes, filename)


@router.get(
    "/summary/video/{video_id}/segment/{segment_id}",
    response_class=Response,
    responses={200: {"content": {"application/pdf": {}}}},
)
def download_segment_summary_pdf(
    video_id:   int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SummaryService(db)
    data = service.get_or_generate_single_segment_summary(
        video_id, segment_id, current_user.id
    )

    content = data.get("summary")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not available for this segment.",
        )

    seg_title   = data.get("title", f"Segment {segment_id}")
    doc_title   = f"Summary — {seg_title}"
    filename    = f"summary_segment_{segment_id}_{_safe_filename(seg_title)}.pdf"

    pdf_bytes = generate_summary_pdf(
        content=content,
        title=doc_title,
        video_title=seg_title,
        reading_time=data.get("reading_time"),
    )

    logger.info(
        f"Segment summary PDF downloaded | "
        f"video_id={video_id} segment_id={segment_id} user={current_user.id}"
    )
    return _pdf_response(pdf_bytes, filename)


@router.get(
    "/studynotes/video/{video_id}",
    response_class=Response,
    responses={200: {"content": {"application/pdf": {}}}},
)
def download_video_studynotes_pdf(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = StudyNotesService(db)
    data = service.get_or_generate_video_studynotes(video_id, current_user.id)

    content = data.get("study_notes")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study notes not available for this video.",
        )

    video_title = (
        content.get("title", "").replace("Study Notes: ", "").strip()
        or f"Video {video_id}"
    )
    doc_title = content.get("title") or f"Study Notes — {video_title}"
    filename  = f"studynotes_{_safe_filename(video_title)}.pdf"

    pdf_bytes = generate_studynotes_pdf(
        content=content,
        title=doc_title,
        video_title=video_title,
        reading_time=data.get("reading_time"),
    )

    logger.info(f"Study notes PDF downloaded | video_id={video_id} | user={current_user.id}")
    return _pdf_response(pdf_bytes, filename)


@router.get(
    "/studynotes/video/{video_id}/segment/{segment_id}",
    response_class=Response,
    responses={200: {"content": {"application/pdf": {}}}},
)
def download_segment_studynotes_pdf(
    video_id:   int,
    segment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = StudyNotesService(db)
    data = service.get_or_generate_segment_studynotes(
        video_id, segment_id, current_user.id
    )

    content = data.get("study_notes")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study notes not available for this segment.",
        )

    seg_title = data.get("title", f"Segment {segment_id}")
    doc_title = content.get("title") or f"Study Notes — {seg_title}"
    filename  = f"studynotes_segment_{segment_id}_{_safe_filename(seg_title)}.pdf"

    pdf_bytes = generate_studynotes_pdf(
        content=content,
        title=doc_title,
        video_title=seg_title,
        reading_time=data.get("reading_time"),
    )

    logger.info(
        f"Segment study notes PDF downloaded | "
        f"video_id={video_id} segment_id={segment_id} user={current_user.id}"
    )
    return _pdf_response(pdf_bytes, filename)