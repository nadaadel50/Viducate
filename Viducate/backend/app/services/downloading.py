import os

import yt_dlp


import os
import uuid
import tempfile
import yt_dlp


def download_video(url: str, video_id: int) -> str:
    temp_dir = tempfile.gettempdir()
    unique_id = uuid.uuid4().hex

    output_path = os.path.join(
        temp_dir,
        f"video_{video_id}_{unique_id}.mp4"
    )

    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'merge_output_format': 'mp4',
        'outtmpl': output_path.replace(".mp4", ".%(ext)s"),
        'quiet': True,
        'noplaylist': True,
        'retries': 5,
        'fragment_retries': 5,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # yt-dlp ممكن يغيّر الامتداد → نبحث عنه
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
        raise Exception("Video download failed")

    return final_file


 # def _download_video(self, url: str) -> Tuple[str, str]:
    #     temp_dir  = tempfile.gettempdir()
    #     unique_id = uuid.uuid4().hex
    #     temp_path = os.path.join(temp_dir, f"viducate_ocr_{unique_id}.mp4")

    #     if self._is_youtube(url):
    #         print(f"[OCRProcessor] Downloading YouTube: {url}")
    #         ydl_opts = {
    #             "outtmpl": temp_path,
    #             "format": "mp4",
    #             "quiet": True,
    #         }
    #         with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    #             ydl.download([url])

    #         if not os.path.exists(temp_path):
    #             for ext in [".mp4", ".mkv", ".webm"]:
    #                 candidate = temp_path.replace(".mp4", ext)
    #                 if os.path.exists(candidate):
    #                     temp_path = candidate
    #                     break

    #         return temp_path, "youtube"

    #     else:
    #         print(f"[OCRProcessor] Downloading direct URL: {url}")
    #         response = requests.get(url, stream=True, timeout=120)
    #         response.raise_for_status()
    #         with open(temp_path, "wb") as f:
    #             for chunk in response.iter_content(chunk_size=8192):
    #                 if chunk:
    #                     f.write(chunk)
    #         return temp_path, "direct"