import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.schemas.chat_schema import (
    AskResponse,
    SessionListResponse,
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


@router.post("/ask", response_model=AskResponse)
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
            message_id=f"{msg.message_id}-user",     
            role="user",
            content=msg.question,
            time=msg.current_time,
            created_at=msg.question_at
        ))
        result.append(MessageSessionResponse(
            message_id=f"{msg.message_id}-assistant", 
            role="assistant",
            content=msg.answer,
            time=None,
            created_at=msg.answer_at
        ))
    
    return result


@router.get("/videos/{video_id}/sessions", response_model=list[SessionListResponse])
def get_video_sessions(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    repo = ChatRepository(db)
    sessions = repo.get_video_sessions(video_id)

    return [
        SessionListResponse(
            id=s.session_id,
            title=s.title,
            created_at=s.created_at,
            last_message_at=repo.get_last_message_time(s.session_id)
        )
        for s in sessions
    ]


@router.delete("/videos/{video_id}/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    video_id: int,
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    repo = ChatRepository(db)
    deleted = repo.delete(video_id=video_id, session_id=session_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")