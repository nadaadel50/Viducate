from fastapi import APIRouter, Depends, HTTPException,status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.embedding_service import search
from app.schemas.search import SearchRequest

router = APIRouter(prefix="/semantic_search", tags=["Search"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.post("/video/{video_id}/search")
def semantic_search(video_id: int, request: SearchRequest, db: Session = Depends(get_db)):
    try:
        results = search(video_id, request.query, db)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))