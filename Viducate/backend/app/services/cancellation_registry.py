import threading
import logging

class PipelineCancelledError(Exception):
    """Raised when a video processing job has been cancelled by the user."""

logger = logging.getLogger(__name__)

_lock = threading.Lock()
_cancelled: set[int] = set()   # video_ids that have been cancelled


def request_cancel(video_id: int) -> None:
    
    with _lock:
        _cancelled.add(video_id)
    logger.info(f"[CancellationRegistry] Cancel requested for video_id={video_id}")


def is_cancelled(video_id: int) -> bool:
    with _lock:
        return video_id in _cancelled


def clear(video_id: int) -> None:
    """
    Remove the cancel flag (call this after the pipeline has fully
    stopped and cleaned up, so a re-upload of the same video_id works).
    """
    with _lock:
        _cancelled.discard(video_id)
    logger.info(f"[CancellationRegistry] Cancel flag cleared for video_id={video_id}")


def check_cancelled(video_id: int | None) -> None:
    if video_id is not None and is_cancelled(video_id):
        raise PipelineCancelledError(
            f"Video {video_id} was cancelled by user"
        )