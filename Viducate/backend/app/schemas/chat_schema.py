import datetime
from typing import Optional

from pydantic import BaseModel

class CreateSessionRequest(BaseModel):
     video_id: int

class SessionResponse(BaseModel):
    session_id: int
    video_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
     video_id: int
     session_id: int
     question: str
     current_time: Optional[int] = None


class MessageResponse(BaseModel):
    message_id: int
    role: str        # "user" or "assistant"
    content: str
    time: Optional[int] = None

    class Config:
        from_attributes = True


class MessageSessionResponse(BaseModel):
    message_id: int
    role: str        # "user" or "assistant"
    content: str
    time: Optional[int] = None
    created_at:  datetime.datetime    # question_at or answer_at

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    session_id: int
    messages: list[MessageSessionResponse]

    class Config:
        from_attributes = True