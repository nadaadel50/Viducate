from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage
from typing import Optional, List


class ChatRepository:
     def __init__(self, db: Session):
        self.db = db

     
     def create_session(self, video_id: int, title: str = None) -> ChatSession:
          session = ChatSession(video_id=video_id, title=title)
          self.db.add(session)
          self.db.commit()
          self.db.refresh(session)
          return session
     
     def get_session(self, session_id: int) -> Optional[ChatSession]:
        return self.db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

     def get_session_by_video(self, video_id: int) -> Optional[ChatSession]:
        return self.db.query(ChatSession).filter(ChatSession.video_id == video_id).first()


     def save_message(self, session_id: int, question: str, answer: str, current_time: Optional[int] = None) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            question=question,
            answer=answer,
            current_time=current_time,
            answer_at=func.now()
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message


     def get_session_messages(self, session_id: int) -> List[ChatMessage]:
        return self.db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.question_at).all()


     def get_video_sessions(self, video_id: int) -> List[ChatSession]:
         return self.db.query(ChatSession).filter(
            ChatSession.video_id == video_id
         ).order_by(ChatSession.created_at.desc()).all()

     def get_last_message_time(self, session_id: int):
         msg = self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
         ).order_by(ChatMessage.answer_at.desc()).first()
         return msg.answer_at if msg else None
     
     def delete(self, video_id: int, session_id:int) -> bool:
        session = self.get_session(session_id)
        if not session or session.video_id != video_id:
            return False
        self.db.delete(session)
        self.db.commit()
        return True