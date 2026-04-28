import os
import tempfile

from fastapi import UploadFile, File, HTTPException
from app.services.slides_service import extract_slides_text

import logging
from fastapi import APIRouter, Depends, BackgroundTasks, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.processing_service import run_processing_pipeline
from app.services.slides_store import save_slides_text



router = APIRouter(prefix="/slides", tags=["Slides"])
logger = logging.getLogger(__name__)
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)

@router.post(
    "/{video_id}/slides",
    status_code=status.HTTP_200_OK,
    summary="Upload slides file",
    description="Upload PDF or PPTX slides related to the video.",
)
async def upload_slides(
    video_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # التحقق من نوع الفايل
    if not file.filename.endswith((".pdf", ".pptx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF or PPTX files are allowed"
        )
    
    # حفظ الفايل مؤقتاً
    temp_path = os.path.join(tempfile.gettempdir(), f"{video_id}_{file.filename}")
    with open(temp_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # استخراج النص
    slides_text = extract_slides_text(temp_path)

    save_slides_text(video_id, slides_text)  # ✅ احفظيها
    
 