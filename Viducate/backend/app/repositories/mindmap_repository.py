from sqlalchemy.orm import Session
from app.models.mindmap import Mindmap
from typing import Optional
from sqlalchemy.exc import IntegrityError


class MindmapRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_video(self, video_id: int) -> Optional[Mindmap]:
        return (
            self.db.query(Mindmap)
            .filter(Mindmap.video_id == video_id)
            .first()
        )

    def create(self, video_id: int, nodes: list, edges: list, language: str) -> Mindmap:
        mindmap = Mindmap(
            video_id=video_id,
            nodes=nodes,
            edges=edges,
            language=language,
        )
        self.db.add(mindmap)
        try:
            self.db.commit()
            self.db.refresh(mindmap)
            return mindmap

        except IntegrityError:
            self.db.rollback()

            return (
                self.db.query(Mindmap)
                .filter(Mindmap.video_id == video_id)
                .first()
            )

    def update(self, mindmap: Mindmap, nodes: list, edges: list, language: str) -> Mindmap:
        mindmap.nodes    = nodes
        mindmap.edges    = edges
        mindmap.language = language
        self.db.commit()
        self.db.refresh(mindmap)
        return mindmap

    def delete_by_video(self, video_id: int) -> int:
        deleted = (
            self.db.query(Mindmap)
            .filter(Mindmap.video_id == video_id)
            .delete()
        )
        self.db.commit()
        return deleted