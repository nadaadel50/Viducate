import logging
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.video import Video
from app.models.topic_segment import TopicSegment
from app.models.mindmap import Mindmap
from app.repositories.mindmap_repository import MindmapRepository
from app.repositories.video_repository import VideoRepository
from app.ml.engines.mindmap_engine import generate_mindmap
from app.services.network_errors import NetworkUnavailableError

from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_mindmap,
)
from app.services.quality_retry import run_with_quality_retry
import re

logger = logging.getLogger(__name__)

print(" MINDMAP SERVICE LOADED FROM:", __file__)

def _format_seconds(seconds: int) -> str:
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"



def _clean_description(text: str, max_chars: int = 300) -> str:
    if not text:
        return ""

    # Split on pipe (OCR separator) 
    parts = [p.strip() for p in text.split("|")]

    cleaned_parts = []
    for part in parts:
        if len(part.split()) < 3:
            continue
       
        weird = len(re.findall(r'[^a-zA-Z\u0600-\u06FF\s\d\(\)\-\.,]', part))
        if len(part) > 0 and weird / len(part) > 0.15:
            continue

        words = part.split()
        if len(words) >= 2 and words[0] == words[1]:
            continue
        cleaned_parts.append(part)

    result = " | ".join(cleaned_parts) if cleaned_parts else ""
    return result[:max_chars]

def _segments_to_engine_input(segments: list[TopicSegment]) -> list[dict]:
    
    result = []
    for seg in segments:
        result.append({
            "segment_number": seg.segment_number,
            "title":          seg.title,
            "main_topic":     seg.main_topic or seg.title,
            "start_time":     _format_seconds(seg.start_time),
            "end_time":       _format_seconds(seg.end_time),
            "sub_topics": [
                {"name": st.name, "description": _clean_description(st.description or "")}
                for st in seg.subtopics
                if st.name
            ],
            "key_points": [kp.description for kp in seg.keypoints if kp.description],
        })
    return result


class MindmapService:
    def __init__(self, db: Session):
        self.db          = db
        self.repo        = MindmapRepository(db)
        self.video_repo  = VideoRepository(db)


    def _get_video_or_404(self, video_id: int) -> Video:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        return video

    def _check_ownership(self, video: Video, user_id: int):
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    def _check_processing_complete(self, video: Video):
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Video is not ready yet. "
                    f"Current status: {video.processing_status}. "
                    f"Please wait for processing to complete."
                ),
            )

    def _get_segments_or_404(self, video_id: int) -> list[TopicSegment]:
        segments = (
            self.db.query(TopicSegment)
            .options(
                joinedload(TopicSegment.subtopics),
                joinedload(TopicSegment.keypoints),
            )
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )
        if not segments:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No segments found for this video. Run the processing pipeline first.",
            )
        return segments


    def _build_response(self, video: Video, mindmap: Mindmap, cached: bool) -> dict:
        return {
            "video_id":   video.vid,
            "title":      video.title,
            "language":   mindmap.language,
            "cached":     cached,
            "nodes":      mindmap.nodes,
            "edges":      mindmap.edges,
            "created_at": mindmap.created_at,
        }


    def get_or_generate(self, video_id: int, user_id: int) -> dict:
        
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        existing = self.repo.get_by_video(video_id)
        if existing:
            logger.info(f"[MindmapService] Cache hit for video_id={video_id}")
            return self._build_response(video, existing, cached=True)

        logger.info(f"[MindmapService] Cache miss — generating for video_id={video_id}")
        segments     = self._get_segments_or_404(video_id)
        engine_input = _segments_to_engine_input(segments)

        
        reference_segment = segments[0]

        try:
            result, quality = run_with_quality_retry(
                generator_fn=lambda: generate_mindmap(
                    video_title=video.title,
                    segments=engine_input,
                ),
                score_fn=lambda res, seg=reference_segment: score_feature_vs_segmentation(
                    feature_text=extract_text_from_mindmap(res),
                    segment=seg,
                    content_type="mindmap",
                ),
                label=f"mindmap video_id={video_id}",
            )
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating mind map. Please try again.",
            )

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Mindmap generation failed.",
            )

        logger.info(
            f"[MindmapService] VALIDATION COMPLETE | video_id={video_id} | "
            f"final_score={quality.get('score', 0.0):.4f} | "
            f"flag={quality.get('flag')} | "
            f"retries_used={quality.get('retries', 0)}"
        )

        if quality.get("flag"):
            logger.warning(
                f"[MindmapService] Mindmap quality BELOW threshold "
                f"(score={quality['score']:.4f} < {quality['threshold']}) "
                f"after {quality.get('retries', 0) + 1} attempts — saving best result"
            )
        else:
            logger.info(
                f"[MindmapService]  Mindmap quality PASSED "
                f"(score={quality['score']:.4f}) in {quality.get('retries', 0) + 1} attempt(s)"
            )

        


        mindmap = self.repo.create(
            video_id=video_id,
            nodes=result["nodes"],
            edges=result["edges"],
            language=result["language"],
        )

        logger.info(
            f"[MindmapService] Generated & cached | video_id={video_id} | "
            f"nodes={len(mindmap.nodes)} | edges={len(mindmap.edges)}"
        )
        return self._build_response(video, mindmap, cached=False)

    def regenerate(self, video_id: int, user_id: int) -> dict:
      
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        deleted = self.repo.delete_by_video(video_id)
        logger.info(f"[MindmapService] Deleted {deleted} old mindmap(s) for video_id={video_id}")

        return self.get_or_generate(video_id, user_id)