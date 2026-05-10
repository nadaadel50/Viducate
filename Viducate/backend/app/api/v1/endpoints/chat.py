import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.schemas.chat_schema import (
    CreateSessionRequest,
    SessionResponse,
    ChatRequest,
    ChatResponse,
    MessageResponse,
    MessageSessionResponse,
)
from app.services.chat_service import create_session, ask
from app.repositories.chat_repository import ChatRepository
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)



@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_chat_session(body: CreateSessionRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_session(video_id=body.video_id, db=db)


@router.post("/ask", response_model=MessageResponse)
def ask_question(body: ChatRequest, db: Session = Depends(get_db),current_user = Depends(get_current_user)):
    return ask(
        video_id=body.video_id,
        session_id=body.session_id,
        question=body.question,
        current_time=body.current_time,
        db=db
    )

@router.get("/videos/{video_id}/sessions/{session_id}/messages", response_model=list[MessageSessionResponse])
def get_session_messages(
    video_id: int,
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    repo = ChatRepository(db)
    
    session = repo.get_session(session_id)
    if not session or session.video_id != video_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    
    messages = repo.get_session_messages(session_id)
    
    result = []
    for msg in messages:
        result.append(MessageSessionResponse(
            message_id=msg.message_id,
            role="user",
            content=msg.question,
            time=msg.current_time,
            created_at=msg.question_at
        ))
        result.append(MessageSessionResponse(
            message_id=msg.message_id,
            role="assistant",
            content=msg.answer,
            time=None,
            created_at=msg.answer_at
        ))
    
    return result