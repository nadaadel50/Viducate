from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from typing import List, Optional


class FlashcardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_video(self, video_id: int) -> List[Flashcard]:
        return (
            self.db.query(Flashcard)
            .filter(Flashcard.video_id == video_id)
            .order_by(Flashcard.segment_id, Flashcard.flashcard_id)
            .all()
        )

    def get_by_segment(self, segment_id: int) -> List[Flashcard]:
        return (
            self.db.query(Flashcard)
            .filter(Flashcard.segment_id == segment_id)
            .order_by(Flashcard.flashcard_id)
            .all()
        )

    def count_by_video(self, video_id: int) -> int:
        return (
            self.db.query(Flashcard)
            .filter(Flashcard.video_id == video_id)
            .count()
        )

    def delete_by_video(self, video_id: int) -> int:
        deleted = (
            self.db.query(Flashcard)
            .filter(Flashcard.video_id == video_id)
            .delete()
        )
        self.db.commit()
        return deleted
    
    def get_segments_with_cards(self, video_id: int) -> set:
        results = (
            self.db.query(Flashcard.segment_id)
            .filter(Flashcard.video_id == video_id)
            .distinct()
            .all()
        )
        return {r[0] for r in results}
    