import cv2
import numpy as np
from typing import List, Tuple


class FrameExtractor:
   # Extracting unique frames where slide content changes
    def __init__(
        self,
        sample_interval: int = 2,       # seconds between sampled frames
        diff_threshold: float = 0.01,   # % of pixels that must change = new slide
        pixel_change_sensitivity: int = 20  # brightness delta to count as "changed"
    ):
        self.sample_interval = sample_interval
        self.diff_threshold = diff_threshold
        self.pixel_change_sensitivity = pixel_change_sensitivity

    def _frames_are_same(
        self, prev_gray: np.ndarray, curr_gray: np.ndarray
    ) -> bool:
        if prev_gray is None:
            return False 

        diff = cv2.absdiff(prev_gray, curr_gray)
        changed_ratio = (
            np.count_nonzero(diff > self.pixel_change_sensitivity) / diff.size
        )
        return changed_ratio < self.diff_threshold

    def extract(self, video_path: str) -> List[Tuple[int, float, str, np.ndarray]]:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        step = max(1, int(fps * self.sample_interval))

        print(f"[FrameExtractor] FPS={fps:.1f} | "
              f"Frames={total_frames} | Step={step} | "
              f"Diff threshold={self.diff_threshold}")

        extracted = []
        prev_gray = None
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_idx += 1

            # Only sample every N frames
            if frame_idx % step != 0:
                continue

            curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Skip if slide hasn't changed
            if self._frames_are_same(prev_gray, curr_gray):
                prev_gray = curr_gray
                continue

            prev_gray = curr_gray

            # Build timestamp
            secs = int(frame_idx / fps)
            mm, ss = divmod(secs, 60)
            hh, mm = divmod(mm, 60)
            timestamp_label = f"{hh:02d}:{mm:02d}:{ss:02d}"
            timestamp_seconds = round(frame_idx / fps, 2)

            extracted.append((frame_idx, timestamp_seconds, timestamp_label, frame.copy()))

        cap.release()
        print(f"[FrameExtractor] Extracted {len(extracted)} unique slide frames")
        return extracted