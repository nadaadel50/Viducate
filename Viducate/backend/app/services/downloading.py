import os
import uuid
import tempfile
import yt_dlp
from fastapi import HTTPException, status



def download_video(url: str, video_id: int) -> str:
    temp_dir = tempfile.gettempdir()
    unique_id = uuid.uuid4().hex

    output_path = os.path.join(
        temp_dir,
        f"video_{video_id}_{unique_id}.mp4"
    )

    ydl_opts = {
        'format': 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360]',
        'merge_output_format': 'mp4',
        'outtmpl': output_path.replace(".mp4", ".%(ext)s"),
        'quiet': True,
        'noplaylist': True,
        'retries': 5,
        'fragment_retries': 5,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

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