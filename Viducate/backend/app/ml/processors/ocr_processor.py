import cv2
import os
import uuid
import tempfile
import requests
import yt_dlp
import numpy as np
from paddleocr import PaddleOCR
from difflib import SequenceMatcher
from typing import List, Dict, Tuple


class OCRProcessor:
    """
    Exact same logic as working ocr_video_paddleocr.py script.
    Differences:
    - Entry point is URL instead of local path
    - Returns structured dict instead of writing to .txt file
    - Language mapping: en=English only, ar=Arabic+English, mixed=Arabic+English
    """

    SAMPLE_INTERVAL = 2       # seconds between sampled frames
    DIFF_THRESHOLD  = 0.01    # % of pixels that must change = new slide
    MIN_TEXT_LEN    = 4
    DUP_RATIO       = 0.88
    OCR_CONFIDENCE  = 0.6

    YOUTUBE_PATTERNS = [
        "youtube.com/watch",
        "youtu.be/",
        "youtube.com/shorts/"
    ]

    def __init__(self):
        self._ocr_cache: Dict[str, PaddleOCR] = {}

    # ─────────────────────────────────────────
    # OCR INSTANCE (cached)
    # ─────────────────────────────────────────
    def _get_ocr(self, lang: str) -> PaddleOCR:
        if lang not in self._ocr_cache:
            print(f"[OCRProcessor] Loading PaddleOCR model: lang={lang}")
            self._ocr_cache[lang] = PaddleOCR(
                lang=lang,
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_textline_orientation=False,
            )
        return self._ocr_cache[lang]

    # ─────────────────────────────────────────
    # LANGUAGE MAPPING
    # ─────────────────────────────────────────
    def _detect_language(self, language: str) -> str:
        """
        Maps app language to PaddleOCR lang.

        Key insight from working script:
        - "ar" model detects BOTH Arabic AND English automatically
        - So for mixed content → use "ar" model
        - "en" model detects English only

        en    → "en"  (English only)
        ar    → "ar"  (Arabic + English both detected)
        mixed → "ar"  (Arabic + English both detected)
        """
        mapping = {
            "en": "en",
            "ar": "ar",
            "mixed": "ar"   # Arabic model handles both languages
        }
        return mapping.get(language, "en")

    # ─────────────────────────────────────────
    # HELPERS (exact same as working script)
    # ─────────────────────────────────────────
    def _frames_are_same(self, prev_gray, curr_gray) -> bool:
        """
        Returns True if slide has NOT changed enough to warrant OCR.
        Exact same logic as working script frames_are_same().
        """
        if prev_gray is None:
            return False

        diff = cv2.absdiff(prev_gray, curr_gray)
        changed_ratio = np.count_nonzero(diff > 20) / diff.size
        return changed_ratio < self.DIFF_THRESHOLD

    def _clean_text(self, text: str) -> str:
        """Exact same as working script clean_text()"""
        text = " ".join(text.split())
        text = "".join(
            c for c in text
            if c.isalnum()
            or c in " .,!?;:،؛؟-"
            or '\u0600' <= c <= '\u06FF'  # keep Arabic unicode range
        )
        return text.strip()

    def _is_duplicate(self, new_text: str, last_text: str) -> bool:
        """Exact same as working script is_duplicate()"""
        if not last_text or not new_text:
            return False
        return SequenceMatcher(None, last_text, new_text).ratio() > self.DUP_RATIO

    # ─────────────────────────────────────────
    # VIDEO DOWNLOAD
    # ─────────────────────────────────────────
    def _is_youtube(self, url: str) -> bool:
        return any(p in url for p in self.YOUTUBE_PATTERNS)

    def _download_video(self, url: str) -> Tuple[str, str]:
        """Download video to temp file. Returns (path, url_type)"""
        temp_dir = tempfile.gettempdir()
        unique_id = uuid.uuid4().hex
        temp_path = os.path.join(temp_dir, f"viducate_ocr_{unique_id}.mp4")

        if self._is_youtube(url):
            print(f"[OCRProcessor] Downloading YouTube: {url}")
            ydl_opts = {
                "outtmpl": temp_path,
                "format": "mp4",
                "quiet": True,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

            # yt-dlp may rename file — find actual path
            if not os.path.exists(temp_path):
                for ext in [".mp4", ".mkv", ".webm"]:
                    candidate = temp_path.replace(".mp4", ext)
                    if os.path.exists(candidate):
                        temp_path = candidate
                        break

            return temp_path, "youtube"

        else:
            print(f"[OCRProcessor] Downloading direct URL: {url}")
            response = requests.get(url, stream=True, timeout=120)
            response.raise_for_status()
            with open(temp_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return temp_path, "direct"

    # ─────────────────────────────────────────
    # RUN OCR ON SINGLE FRAME
    # ─────────────────────────────────────────
    def _run_ocr_on_frame(self, frame, language: str) -> List[str]:
        """
        Exact same as working script — one OCR call, one language.
        Arabic model handles mixed content automatically.
        No dual-model logic needed.
        """
        lines = []
        paddle_lang = self._detect_language(language)
        ocr = self._get_ocr(paddle_lang)

        try:
            results = ocr.predict(frame)
        except Exception as e:
            print(f"[OCRProcessor] OCR error: {e}")
            return lines

        if not results or not results[0]:
            return lines

        # Exact same parsing as working script
        rec_texts  = results[0].get("rec_texts", [])
        rec_scores = results[0].get("rec_scores", [])

        for txt, score in zip(rec_texts, rec_scores):
            if score < self.OCR_CONFIDENCE:
                continue
            cleaned = self._clean_text(txt)
            if cleaned and len(cleaned) >= self.MIN_TEXT_LEN:
                lines.append(cleaned)

        return lines

    # ─────────────────────────────────────────
    # MAIN ENTRY POINT
    # ─────────────────────────────────────────
    def process_from_url(self, url: str, language: str = "en") -> Dict:
        """
        Full pipeline — URL in, segments out.
        Exact same logic as extract_text_from_video() in working script.
        """
        temp_path = None
        try:
            # ── 1. Download ──────────────────────────────────────
            temp_path, url_type = self._download_video(url)
            print(f"[OCRProcessor] Video ready: {temp_path}")

            # ── 2. Open video ────────────────────────────────────
            cap = cv2.VideoCapture(temp_path)
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {temp_path}")

            fps          = cap.get(cv2.CAP_PROP_FPS) or 25.0
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration_min = total_frames / fps / 60
            step         = max(1, int(fps * self.SAMPLE_INTERVAL))

            print(f"[OCRProcessor] Video    : {os.path.basename(temp_path)}")
            print(f"[OCRProcessor] FPS      : {fps:.1f}")
            print(f"[OCRProcessor] Length   : {duration_min:.1f} min ({total_frames} frames)")
            print(f"[OCRProcessor] Sampling : every {step} frames = every {self.SAMPLE_INTERVAL}s")
            print(f"[OCRProcessor] Language : {language} → paddle_lang={self._detect_language(language)}")
            print(f"[OCRProcessor] Sensitivity: skip if <{self.DIFF_THRESHOLD*100:.0f}% pixels changed")

            # ── 3. Loop frames ───────────────────────────────────
            prev_gray = None
            last_text = ""
            frame_idx = 0
            ocr_count = 0
            segments  = []

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
                ocr_count += 1

                # ── Run OCR ──────────────────────────────────────
                lines = self._run_ocr_on_frame(frame, language)

                if not lines:
                    continue

                page_text = " | ".join(lines)

                # ── Skip duplicate ────────────────────────────────
                if self._is_duplicate(page_text, last_text):
                    secs = int(frame_idx / fps)
                    mm, ss = divmod(secs, 60)
                    hh, mm = divmod(mm, 60)
                    print(f"[OCRProcessor] Duplicate at {hh:02d}:{mm:02d}:{ss:02d} — skipped")
                    continue

                # ── Build timestamp ───────────────────────────────
                secs = int(frame_idx / fps)
                mm, ss = divmod(secs, 60)
                hh, mm = divmod(mm, 60)
                timestamp_label   = f"{hh:02d}:{mm:02d}:{ss:02d}"
                timestamp_seconds = round(frame_idx / fps, 2)

                segments.append({
                    "time":        timestamp_seconds,
                    "timestamp":   timestamp_label,
                    "text":        page_text,
                    "lines":       lines,
                    "frame_index": frame_idx,
                    "line_count":  len(lines)
                })
                last_text = page_text

                if ocr_count % 20 == 0:
                    pct = frame_idx / total_frames * 100
                    print(f"[OCRProcessor] {pct:5.1f}% | "
                          f"OCR runs: {ocr_count} | Saved: {len(segments)}")

            cap.release()

            print(f"\n[OCRProcessor] ✅ Done!")
            print(f"[OCRProcessor] OCR ran on  : {ocr_count} unique frames")
            print(f"[OCRProcessor] Lines saved : {len(segments)}")

            return {
                "segments": segments,
                "total":    len(segments),
                "language": language,
                "url_type": url_type
            }

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
                print(f"[OCRProcessor] Temp file deleted.")
