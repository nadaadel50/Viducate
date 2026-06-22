import os
import uuid
import tempfile
import yt_dlp
import requests
from fastapi import HTTPException, status
from app.services.cancellation_registry import is_cancelled, PipelineCancelledError, check_cancelled
import logging
import glob
from yt_dlp.utils import DownloadCancelled

logger = logging.getLogger(__name__)



def _is_direct_url(url: str) -> bool:
    """Check if the URL is a direct file link (R2 or S3 presigned)"""
    direct_domains = [
        "r2.cloudflarestorage.com",
        "s3.amazonaws.com",
        "storage.googleapis.com",
    ]
    return any(domain in url for domain in direct_domains)


# def _download_direct(url: str, output_path: str) -> str:
def _download_direct(url: str, output_path: str, video_id: int) -> str:
    """Download file directly using requests"""
    response = requests.get(url, stream=True, timeout=300)
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to download video: HTTP {response.status_code}"
        )
    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            check_cancelled(video_id)
            if chunk:
                f.write(chunk)
    return output_path


def _cancel_hook(video_id):
    def hook(d):
        logger.info(
            f"[HOOK] status={d.get('status')} "
            f"downloaded={d.get('downloaded_bytes')}"
        )

        if is_cancelled(video_id):
            logger.info(
                f"[HOOK] cancellation detected video_id={video_id}"
            )
            raise DownloadCancelled()

    return hook


def download_video(url: str, video_id: int) -> str:
    temp_dir = tempfile.gettempdir()
    unique_id = uuid.uuid4().hex
    output_path = os.path.join(temp_dir, f"video_{video_id}_{unique_id}.mp4")

    # If R2 or S3, download directly
    if _is_direct_url(url):
        return _download_direct(url, output_path, video_id)
    
    check_cancelled(video_id)

    # Otherwise, use yt-dlp
    ydl_opts = {
        'format': 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360]',
        'merge_output_format': 'mp4',
        'outtmpl': output_path.replace(".mp4", ".%(ext)s"),
        'quiet': True,
        'noplaylist': True,
        'retries': 5,
        'fragment_retries': 5,
        'progress_hooks': [_cancel_hook(video_id)],
        'continuedl': False,
        'http_chunk_size': 1 * 1024 * 1024,   # 1 MB chunks
    }

    # with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    #     ydl.download([url])
    check_cancelled(video_id)
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except DownloadCancelled:
        logger.info(f"[Download] Stopped mid-download for video_id={video_id}")
        # remove whatever partial/fragment files yt-dlp already wrote
        for partial in glob.glob(output_path.replace(".mp4", ".*")):
            try:
                os.remove(partial)
            except OSError:
                pass
        raise PipelineCancelledError(f"Video {video_id} was cancelled by user")

    final_file = None
    if os.path.exists(output_path):
        final_file = output_path
    else:
        for ext in [".mp4", ".mkv", ".webm"]:
            candidate = output_path.replace(".mp4", ext)
            if os.path.exists(candidate):
                final_file = candidate
                break

    if not final_file or not os.path.exists(final_file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video download failed"
        )

    return final_file