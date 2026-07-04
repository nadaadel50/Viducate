from sqlalchemy.orm import Session
from app.models.video import Video
from app.models.ocr_result import OCRResult
from typing import Optional, List


class OCRRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_video_by_id(self, video_id: int) -> Optional[Video]:
        return self.db.query(Video).filter(Video.vid == video_id).first()

    def update_video_status(self, video_id: int, processing_status: str) -> None:
        self.db.query(Video).filter(Video.vid == video_id).update(
            {"processing_status": processing_status}
        )
        self.db.commit()
        print(f"[OCRRepository] Video {video_id} → {processing_status}")

    def save_ocr_segments(self, video_id: int, segments: list) -> None:
        self.db.query(OCRResult).filter(
            OCRResult.video_id == video_id
        ).delete()

        for seg in segments:
            self.db.add(OCRResult(
                video_id=video_id,
                timestamp_seconds=seg["time"],
                timestamp_label=seg["timestamp"],
                text=seg["text"],
                raw_lines="|".join(seg.get("lines", [])),  # ← store individual lines
                frame_index=seg.get("frame_index")
            ))

        self.db.commit()
        print(f"[OCRRepository] Saved {len(segments)} OCR segments for video {video_id}")

    def get_ocr_results(self, video_id: int) -> list:
        results = (
            self.db.query(OCRResult)
            .filter(OCRResult.video_id == video_id)
            .order_by(OCRResult.timestamp_seconds)
            .all()
        )
        # Return with lines split back out for merge logic
        return [
            {
                "time": r.timestamp_seconds,
                "timestamp": r.timestamp_label,
                "text": r.text,
                "lines": r.raw_lines.split("|") if r.raw_lines else [],
                "frame_index": r.frame_index
            }
            for r in results
        ]
        