import datetime
from typing import Optional

from pydantic import BaseModel


class SessionResponse(BaseModel):
    session_id: int
    title: str  | None = None
    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
     video_id: int
     session_id: int | None = None 
     question: str
     current_time: Optional[int] = None


class MessageResponse(BaseModel):
    message_id:int
    content: str
    class Config:
        from_attributes = True



class AskResponse(BaseModel):
    session: SessionResponse
    message: MessageResponse


class MessageSessionResponse(BaseModel):
    message_id: str 
    role: str       
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


class SessionListResponse(BaseModel):
    id: int
    title: str | None
    created_at: datetime.datetime
    last_message_at: datetime.datetime | None

    class Config:
        from_attributes = True