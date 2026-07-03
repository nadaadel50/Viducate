import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.chat_repository import ChatRepository
from app.repositories.video_repository import VideoRepository

from app.ml.engines.chat_engine import generate_answer
from app.services.embedding_service import search
from app.schemas.chat_schema import AskResponse, MessageResponse, SessionResponse
from app.services.network_errors import NetworkUnavailableError

logger = logging.getLogger(__name__)


def _build_context(search_results: list) -> str:
    if not search_results:
        return "No relevant content found in the video."

    context_parts = []
    for r in search_results:
        context_parts.append(
            f"- [{r['title']} > {r['sub_topic_name']}] (at second {r['start_time']})\n"
            f"  {r['sub_topic_description']}"
        )
    return "\n".join(context_parts)


def _build_history(messages: list) -> list[dict]:
    """Convert ChatMessage objects to Groq format"""
    history = []
    for msg in messages:
        history.append({"role": "user",      "content": msg.question})
        history.append({"role": "assistant", "content": msg.answer})
    return history


def create_session(video_id: int, db: Session):
    repo = ChatRepository(db)
    return repo.create_session(video_id)


def ask(session_id: int, video_id: int, question: str, current_time: int | None, db: Session):
    repo = ChatRepository(db)

    video_repo = VideoRepository(db)
    video = video_repo.get_by_id(video_id)
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    if session_id is None or session_id == 0:
        session = repo.create_session(video_id=video_id, title=question[:100])
        session_id = session.session_id
    else:
        session = repo.get_session(session_id)
        if not session or session.video_id != video_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    # 2. Get history from DB
    messages = repo.get_session_messages(session_id)
    history = _build_history(messages)

    try:
        # 3. Search chroma for relevant video content
        search_results = search(video_id=video_id, query=question, db=db)
        context = _build_context(search_results)

        # 4. Generate answer from Groq
        answer = generate_answer(context=context, history=history, question=question)
    except NetworkUnavailableError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Network connection issue. Please try sending your message again.",
        )

    # 5. Save question and answer
    message = repo.save_message(
        session_id=session_id,
        question=question,
        answer=answer,
        current_time=current_time
    )

    return AskResponse(
        session=SessionResponse(
            session_id=session.session_id,
            title=session.title,   
            video_id=video_id,

        ),
        message=MessageResponse(
            message_id=message.message_id,
            content=message.answer,
        )
    )
