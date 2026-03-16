import cv2
import os
import uuid
import time
import tempfile
import requests
import yt_dlp
import numpy as np
from paddleocr import PaddleOCR
from difflib import SequenceMatcher
from typing import List, Dict, Tuple


class OCRProcessor:
  

    SAMPLE_INTERVAL = 2
    DIFF_THRESHOLD  = 0.01
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
    # OCR INSTANCE (cached per language)
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
    # AUTO LANGUAGE DETECTION
    # ─────────────────────────────────────────
    def _detect_language_from_frame(self, frame) -> str:
        """
        Detects language by running Arabic OCR on a sample frame
        and checking ratio of Arabic characters in the result.
        Returns "ar" or "en".
        Arabic model detects both Arabic and English.
        """
        try:
            ocr = self._get_ocr("ar")
            results = ocr.predict(frame)

            if not results or not results[0]:
                return "en"

            rec_texts  = results[0].get("rec_texts", [])
            rec_scores = results[0].get("rec_scores", [])

            all_text = ""
            for txt, score in zip(rec_texts, rec_scores):
                if score >= self.OCR_CONFIDENCE:
                    all_text += " " + txt

            if not all_text.strip():
                return "en"

            arabic_chars = sum(1 for c in all_text if '\u0600' <= c <= '\u06FF')
            total_chars  = sum(1 for c in all_text if c.isalpha())

            if total_chars == 0:
                return "en"

            arabic_ratio = arabic_chars / total_chars
            print(f"[OCRProcessor] Auto-detect: arabic_ratio={arabic_ratio:.2f}")

            return "ar" if arabic_ratio > 0.3 else "en"

        except Exception as e:
            print(f"[OCRProcessor] Language detection failed: {e}, defaulting to en")
            return "en"

    def _get_paddle_lang(self, lang: str) -> str:
        """
        ar    → "ar"  (detects Arabic + English)
        en    → "en"  (English only)
        """
        return "ar" if lang == "ar" else "en"

    # ─────────────────────────────────────────
    # HELPERS
    # ─────────────────────────────────────────
    def _frames_are_same(self, prev_gray, curr_gray) -> bool:
        if prev_gray is None:
            return False
        diff = cv2.absdiff(prev_gray, curr_gray)
        changed_ratio = np.count_nonzero(diff > 20) / diff.size
        return changed_ratio < self.DIFF_THRESHOLD

    def _clean_text(self, text: str) -> str:
        text = " ".join(text.split())
        text = "".join(
            c for c in text
            if c.isalnum()
            or c in " .,!?;:،؛؟-"
            or '\u0600' <= c <= '\u06FF'
        )
        return text.strip()

    def _is_duplicate(self, new_text: str, last_text: str) -> bool:
        if not last_text or not new_text:
            return False
        return SequenceMatcher(None, last_text, new_text).ratio() > self.DUP_RATIO

    # ─────────────────────────────────────────
    # VIDEO DOWNLOAD
    # ─────────────────────────────────────────
    def _is_youtube(self, url: str) -> bool:
        return any(p in url for p in self.YOUTUBE_PATTERNS)

    def _download_video(self, url: str) -> Tuple[str, str]:
        temp_dir  = tempfile.gettempdir()
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
    def _run_ocr_on_frame(self, frame, paddle_lang: str) -> List[str]:
        """
        Runs OCR using the given paddle_lang model.
        Exact same parsing as working standalone script.
        """
        lines = []
        ocr   = self._get_ocr(paddle_lang)

        try:
            results = ocr.predict(frame)
        except Exception as e:
            print(f"[OCRProcessor] OCR error: {e}")
            return lines

        if not results or not results[0]:
            return lines

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
        Language param is ignored — language is auto-detected from video.
        URL is the only thing that matters.
        """
        temp_path = None
        cap       = None

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

            # ── 3. Auto-detect language from sample frames ───────
            print(f"[OCRProcessor] Auto-detecting language...")
            detected_lang = "en"  # default

            sample_positions = [
                int(total_frames * 0.1),
                int(total_frames * 0.3),
                int(total_frames * 0.5),
            ]
            for pos in sample_positions:
                cap.set(cv2.CAP_PROP_POS_FRAMES, pos)
                ret, sample_frame = cap.read()
                if ret:
                    detected_lang = self._detect_language_from_frame(sample_frame)
                    if detected_lang == "ar":
                        break  # Arabic found — no need to check more frames

            # Reset video to beginning
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

            paddle_lang = self._get_paddle_lang(detected_lang)

            print(f"[OCRProcessor] Video    : {os.path.basename(temp_path)}")
            print(f"[OCRProcessor] FPS      : {fps:.1f}")
            print(f"[OCRProcessor] Length   : {duration_min:.1f} min ({total_frames} frames)")
            print(f"[OCRProcessor] Sampling : every {step} frames = every {self.SAMPLE_INTERVAL}s")
            print(f"[OCRProcessor] Detected language: {detected_lang} → paddle_lang={paddle_lang}")
            print(f"[OCRProcessor] Sensitivity: skip if <{self.DIFF_THRESHOLD*100:.0f}% pixels changed")

            # ── 4. Main OCR loop ─────────────────────────────────
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

                if frame_idx % step != 0:
                    continue

                curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                if self._frames_are_same(prev_gray, curr_gray):
                    prev_gray = curr_gray
                    continue

                prev_gray = curr_gray
                ocr_count += 1

                lines = self._run_ocr_on_frame(frame, paddle_lang)

                if not lines:
                    continue

                page_text = " | ".join(lines)

                if self._is_duplicate(page_text, last_text):
                    secs = int(frame_idx / fps)
                    mm, ss = divmod(secs, 60)
                    hh, mm = divmod(mm, 60)
                    print(f"[OCRProcessor] Duplicate at {hh:02d}:{mm:02d}:{ss:02d} — skipped")
                    continue

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

            print(f"\n[OCRProcessor] ✅ Done!")
            print(f"[OCRProcessor] OCR ran on  : {ocr_count} unique frames")
            print(f"[OCRProcessor] Lines saved : {len(segments)}")

            return {
                "segments":  segments,
                "total":     len(segments),
                "language":  detected_lang,  # return what was actually detected
                "url_type":  url_type
            }

        finally:
            # Always release cap before deleting file
            if cap is not None:
                cap.release()
                print(f"[OCRProcessor] Video capture released.")

            time.sleep(0.5)  # let Windows release file handle

            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                    print(f"[OCRProcessor] Temp file deleted.")
                except Exception as e:
                    print(f"[OCRProcessor] Could not delete temp file: {e}")
