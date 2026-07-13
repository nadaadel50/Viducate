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
import re
from app.services.cancellation_registry import is_cancelled, PipelineCancelledError,  check_cancelled
from concurrent.futures import ThreadPoolExecutor

class OCRProcessor:

    SAMPLE_INTERVAL =10
    DIFF_THRESHOLD  = 0.005 
    MIN_TEXT_LEN    = 4
    DUP_RATIO       = 0.90
    OCR_CONFIDENCE  = 0.6

    # -- Pre-flight thresholds ---------------------------------------------------
    TEXT_CONTENT_SCORE_THRESHOLD = 0.012    # If lower → skip OCR completely
    TEXT_CONTENT_SAMPLE_COUNT    = 10       # Number of frames used in pre-flight check
    TEXT_FRAMES_MIN_RATIO        = 0.15  # لو أقل من 15% من الـ frames فيها text → skip


    YOUTUBE_PATTERNS = [
        "youtube.com/watch",
        "youtu.be/",
        "youtube.com/shorts/"
    ]


    NOISE_PATTERNS = [
        r"Microsoft-MIEngine",
        r"Microsoft-M2Engine",
        r"debugAdapters",
        r"/usr/bin/env",
        r"\.vscode",
        r"WindowsDebugLauncher",
        r"--stdin=", r"--stdout=", r"--stderr=",
        r"--tbgExe", r"--bgExe",
        r"gdb\.exe",
        r"esys64", r"msys64",
        r"Contabo",
        r"up-to-date", r"up-to-carte",
        r"succleded", r"succeeded.*failed",
    ]

    def __init__(self):
        self._ocr_cache: Dict[str, PaddleOCR] = {}

    # --------------------------------------------
    # OCR cleaning (remove duplicate segments)
    # --------------------------------------------
    from difflib import SequenceMatcher

    def _deduplicate_segments(self, segments: List[Dict], is_code: bool = False, window_size: int = 3) -> List[Dict]:
        if not segments:
            return segments

        def _normalize(text: str) -> str:
            if is_code:
                return text.strip()
            return text.strip().rstrip(".,;:،؛")

        SIMILARITY_THRESHOLD = 0.80

        def _is_similar(line: str, recent_lines: list) -> bool:
            for prev_line in recent_lines:
                ratio = SequenceMatcher(None, line, prev_line).ratio()
                if ratio > SIMILARITY_THRESHOLD:
                    return True
            return False

        deduped = [segments[0]]
        # recent_lines هيحتفظ بسطور آخر window_size segments مقبولة (مش كل التاريخ)
        recent_lines = [_normalize(l) for l in segments[0]["text"].split(" | ")]

        for seg in segments[1:]:
            curr_lines = seg["text"].split(" | ")

            new_lines = [
                l for l in curr_lines
                if not _is_similar(_normalize(l), recent_lines)
            ]

            min_words = 2 if is_code else 3
            new_lines = [l for l in new_lines if len(l.split()) >= min_words]
            new_lines = new_lines[:5]

            if len(new_lines) >= 2:
                seg["text"]  = " | ".join(new_lines)
                seg["lines"] = new_lines
                deduped.append(seg)

                # اضيف سطور السيجمنت الحالي لقائمة السطور الحديثة
                recent_lines.extend(_normalize(l) for l in curr_lines)

                # سيب بس آخر window_size segments من السطور (تقريبيًا)
                # كل segment فيه عادة لحد 5 سطور، فنحسب الحد الأقصى بناء على كده
                max_recent = window_size * 5
                recent_lines = recent_lines[-max_recent:]
            else:
                print(f"[OCRProcessor] Post-dedup: removed {seg['timestamp']}")

        print(f"[OCRProcessor] Post-dedup: {len(segments)} → {len(deduped)} segments")
        return deduped
    

    # --------------------------------------------
    # check if text is from slides or code 
    # --------------------------------------------
    #def _is_code_video(self, cap, total_frames: int) -> bool:
    def _is_code_video(self, cap, total_frames, video_id=None):
        sample_indices = np.linspace(0, total_frames - 1, 5, dtype=int)
        dark_frame_count = 0
        code_content_count = 0

        for idx in sample_indices:
            check_cancelled(video_id)
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
            ret, frame = cap.read()
            if not ret:
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            mean_brightness = np.mean(gray)
            
            # Heuristic 1: dark theme
            if mean_brightness < 80:
                dark_frame_count += 1

            # Heuristic 2: uniform background (code editors have solid bg)
            # + vertical structure (indentation lines)
            edges = cv2.Canny(gray, 50, 150)
            
            # كود بيبقى فيه خطوط أفقية كتير ومتساوية (الأسطر)
            kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
            h_lines  = cv2.morphologyEx(edges, cv2.MORPH_OPEN, kernel_h)
            h_density = np.count_nonzero(h_lines) / h_lines.size

            # كود بيبقى فيه خطوط رأسية (indentation)
            kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 20))
            v_lines  = cv2.morphologyEx(edges, cv2.MORPH_OPEN, kernel_v)
            v_density = np.count_nonzero(v_lines) / v_lines.size

           
            print(f"[DEBUG] idx={idx} brightness={mean_brightness:.1f} "
                f"h_density={h_density:.4f} v_density={v_density:.4f} ")

            if h_density > 0.004  and v_density > 0.0008:
                code_content_count += 1

        is_dark_code  = dark_frame_count >= 3 and code_content_count >= 2
        is_light_code = code_content_count >= 3 and dark_frame_count < 3

        is_code = is_dark_code or is_light_code
        print(f"[OCRProcessor] Video type: {'CODE' if is_code else 'SLIDES'} "
            f"(dark={dark_frame_count}/5, code_structure={code_content_count}/5)")
        return is_code


    # --------------------------------------------
    # check if text code or not by scoring 
    # --------------------------------------------      
    def _line_score(self, line: str) -> float:
        score = 0.0

        # code-like symbols
        if re.search(r"[{}();=#<>]", line):
            score += 2.0

        # function / code patterns
        if re.search(r"[a-zA-Z_]+\s*\(", line):
            score += 1.5

        # operators
        if re.search(r"[=+\-*/]", line):
            score += 1.0

        # includes / imports
        if "include" in line or "import" in line:
            score += 2.0

        # too long → likely UI
        if len(line.split()) > 12:
            score -= 2.0

        # symbol density (code = more symbols)
        alpha = sum(c.isalpha() for c in line)
        symbols = sum(not c.isalnum() and not c.isspace() for c in line)

        if symbols > alpha:
            score += 1.5

        return score
    
    # --------------------------------------------
    # OCR INSTANCE (cached per language)
    # --------------------------------------------
    def _get_ocr(self, lang: str) -> PaddleOCR:
        if lang not in self._ocr_cache:
            print(f"[OCRProcessor] Loading PaddleOCR model: lang={lang}")
            self._ocr_cache[lang] = PaddleOCR(
                lang=lang,
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_textline_orientation=False,
                det_limit_side_len=512
            )
        return self._ocr_cache[lang]

    # --------------------------------------------
    # PRE-FLIGHT: Check if the video contains text content at all
    # --------------------------------------------
    #def _video_has_text_content(self, cap, total_frames: int) -> bool:
    def _video_has_text_content(self, cap, total_frames, video_id=None):
        """
        Samples a limited number of frames and estimates whether the video
        contains textual content using image processing only (no OCR).

        Returns False if the video is likely a talking-head or B-roll video,
        so OCR can be skipped entirely.
        """
        sample_indices = np.linspace(0, total_frames - 1, self.TEXT_CONTENT_SAMPLE_COUNT, dtype=int)
        text_scores    = []
        frames_with_text = 0  # عداد الـ frames اللي فيها text فعلاً

        for idx in sample_indices:
            check_cancelled(video_id)
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
            ret, frame = cap.read()
            if not ret:
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            if np.mean(gray) < 100:  # dark background → invert before analysis
                gray = cv2.bitwise_not(gray)

            # Heuristic 1: edge density → text produces strong edges
            edges        = cv2.Canny(gray, 100, 200)
            edge_density = np.count_nonzero(edges) / edges.size

            # Heuristic 2: horizontal line structures → text lines are horizontal
            kernel  = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
            h_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, kernel)
            h_density = np.count_nonzero(h_lines) / h_lines.size

            score = edge_density * 0.4 + h_density * 2.5
            text_scores.append(score)

            # لو الـ frame دي فيها text regions حقيقية → عدّها
            if self._frame_has_text_regions(gray):
                frames_with_text += 1

        if not text_scores:
            # Could not read frames → fallback to running OCR to avoid missing content
            return True

        avg_score = float(np.mean(text_scores))
        text_ratio       = frames_with_text / len(text_scores)

        print(f"[OCRProcessor] Pre-flight: avg_score={avg_score:.4f} | "
            f"frames_with_text={frames_with_text}/{len(text_scores)} ({text_ratio:.0%})")

        return {
        "has_text":   avg_score > self.TEXT_CONTENT_SCORE_THRESHOLD,
        "text_ratio": text_ratio,
        "avg_score":  avg_score
    }
        # print(f"[OCRProcessor] Pre-flight text score: {avg_score:.4f} "
        #       f"(threshold={self.TEXT_CONTENT_SCORE_THRESHOLD})")

        # return avg_score > self.TEXT_CONTENT_SCORE_THRESHOLD



    # --------------------------------------------
    # Check if the frame contains text content
    # --------------------------------------------
    def _frame_has_text_regions(self, gray) -> bool:
        """
        Detects whether a frame contains text-like regions using morphology only (no OCR).
        """

        if np.mean(gray) < 100:
            gray = cv2.bitwise_not(gray)
        # Convert to binary image
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # Dilate to connect characters into words
        kernel  = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
        dilated = cv2.dilate(thresh, kernel, iterations=2)

        # Find contours (candidate regions)
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        text_regions = 0
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = w / h if h > 0 else 0
            area         = w * h

            # Text regions are usually wide and of moderate size
            if 2.0 < aspect_ratio < 20.0 and 500 < area < 50000:
                text_regions += 1

        return text_regions >= 2 # At least 2 text-like regions
    
    
    # --------------------------------------------
    # AUTO LANGUAGE DETECTION
    # --------------------------------------------
    #def _detect_language_from_frame(self, frame) -> str:
    def _detect_language_from_frame(self, frame, video_id: int = None) -> str:
        """
        Detects language using OCR on only one suitable frame (not multiple).
        It searches for a frame with sufficient edge density (likely containing text).
        If none found -> fallback to middle frame.
        """
        try:
            check_cancelled(video_id)
            ocr     = self._get_ocr("ar")

            check_cancelled(video_id)
            results = ocr.predict(frame)

            check_cancelled(video_id)

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
        except PipelineCancelledError:
            raise
        except Exception as e:
            print(f"[OCRProcessor] Language detection failed: {e}, defaulting to en")
            return "en"



   # def _detect_language_fast(self, cap, total_frames: int) -> str:
    def _detect_language_fast(self, cap, total_frames, video_id=None):
        """
        Detects the language using OCR on a single suitable frame (not multiple frames).
        The function searches for a frame that likely contains text by checking
        edge density. If a suitable frame is found, OCR is applied to detect language.
        If no suitable frame is found, it falls back to English.
        """
        candidate_positions = [
            int(total_frames * 0.1),
            int(total_frames * 0.3),
            int(total_frames * 0.5),
        ]

        for pos in candidate_positions:
            check_cancelled(video_id)
            cap.set(cv2.CAP_PROP_POS_FRAMES, pos)
            ret, frame = cap.read()
            if not ret:
                continue

             # Ensure the frame likely contains text before running OCR
            gray         = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            edges        = cv2.Canny(gray, 100, 200)
            edge_density = np.count_nonzero(edges) / edges.size

            if edge_density < 0.02:
                # Frame has very little structure → likely no text
                print(f"[OCRProcessor] Frame at pos={pos} low edge density ({edge_density:.4f}), skipping")
                continue

            # Frame is likely useful → run OCR-based language detection
            lang = self._detect_language_from_frame(frame, video_id=video_id)
            print(f"[OCRProcessor] Language detected from pos={pos}: {lang}")
            return lang

        # No suitable frame found → fallback
        print(f"[OCRProcessor] No suitable frame found for lang detection, defaulting to en")
        return "en"

    def _get_paddle_lang(self, lang: str) -> str:
        return "ar" if lang == "ar" else "en"

    # --------------------------------------------
    # HELPERS
    # --------------------------------------------
    def _frames_are_same(self, prev_gray, curr_gray) -> bool:
        if prev_gray is None:
            return False
        diff          = cv2.absdiff(prev_gray, curr_gray)
        changed_ratio = np.count_nonzero(diff > 20) / diff.size
        return changed_ratio < self.DIFF_THRESHOLD

    def _clean_text(self, text: str, is_code: bool = False) -> str:
        text = " ".join(text.split())
        
        if is_code:
            # not clean symbols
            text = "".join(
                c for c in text
                if c.isalnum()
                or c in " .,!?;:،؛؟-{}()[]<>=+*/\\#@&|^%~`'\""
                or '\u0600' <= c <= '\u06FF'
            )
        else:
            # cleaning slides
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

    def _is_url_or_browser_content(self, line: str) -> bool:
        url_patterns = [
            r'https?://', r'www\.', r'\.com', r'\.org', r'\.net',
            r'Imps\.', r'Imts\.'  # OCR بيقرأ https غلط كده
        ]
        return any(re.search(p, line, re.IGNORECASE) for p in url_patterns)
    

    def _is_debug_or_ad_noise(self, line: str) -> bool:
        return any(re.search(p, line, re.IGNORECASE) for p in self.NOISE_PATTERNS)
    # --------------------------------------------
    # VIDEO DOWNLOAD
    # --------------------------------------------
    def _is_youtube(self, url: str) -> bool:
        return any(p in url for p in self.YOUTUBE_PATTERNS)

    # --------------------------------------------
    # RUN OCR ON SINGLE FRAME
    # --------------------------------------------
    #def _run_ocr_on_frame(self, frame, paddle_lang: str, is_code: bool = False) -> List[str]:
    def _run_ocr_on_frame(self, frame, paddle_lang: str, is_code: bool = False, video_id: int = None) -> List[str]:
        lines = []
        ocr   = self._get_ocr(paddle_lang)

        try:
            check_cancelled(video_id)
            #results = ocr.predict(frame)
              
            with ThreadPoolExecutor(max_workers=1) as executor:

                future = executor.submit(
                    ocr.predict,
                    frame
                )

                while not future.done():

                    check_cancelled(video_id)

                    time.sleep(0.2)

                results = future.result()

            check_cancelled(video_id)

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
            cleaned = self._clean_text(txt, is_code=is_code)
            if cleaned and len(cleaned) >= self.MIN_TEXT_LEN:
                lines.append(cleaned)

        return lines


    # --------------------------------------------
    # MAIN ENTRY POINT
    # --------------------------------------------
    #def process_from_file(self, video_path: str) -> Dict:
    def process_from_file(self, video_path: str, video_id: int = None) -> Dict:
        cap     = None
        is_temp = False

        try:
            # ----- 1. Open video ---------------------------------------------
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")

            fps          = cap.get(cv2.CAP_PROP_FPS) or 25.0
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration_min = total_frames / fps / 60
            step         = max(1, int(fps * self.SAMPLE_INTERVAL))

            print(f"[OCRProcessor] Video    : {os.path.basename(video_path)}")
            print(f"[OCRProcessor] FPS      : {fps:.1f}")
            print(f"[OCRProcessor] Length   : {duration_min:.1f} min ({total_frames} frames)")
            print(f"[OCRProcessor] Sampling : every {step} frames = every {self.SAMPLE_INTERVAL}s")

            # ----- 2. Pre-flight check ---------------------------------------
            print(f"[OCRProcessor] Running pre-flight text content check...")

            check_cancelled(video_id)
            
            preflight = self._video_has_text_content(cap, total_frames, video_id)
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

            if not preflight["has_text"] and preflight["text_ratio"] < 0.3:
                print(f"[OCRProcessor] ⏭ Low text score → skip OCR")
                return {"segments": [], "total": 0, "language": None, "url_type": "local"}

            # ----- 3. Detect video type (code vs slides) ---------------------
            check_cancelled(video_id)
            
            is_code_video = self._is_code_video(cap, total_frames, video_id)
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

            # لو مش كود وtext قليل → skip
            if not is_code_video and preflight["text_ratio"] < self.TEXT_FRAMES_MIN_RATIO:
                print(f"[OCRProcessor] ⏭ Text too sparse ({preflight['text_ratio']:.0%}) → skip OCR")
                return {"segments": [], "total": 0, "language": None, "url_type": "local"}

            # ---- 4. Language detection ---------------------------------------
            print(f"[OCRProcessor] Auto-detecting language...")
            check_cancelled(video_id)
            
            detected_lang = self._detect_language_fast(cap, total_frames, video_id)

            check_cancelled(video_id)
            
            paddle_lang   = self._get_paddle_lang(detected_lang)
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

            print(f"[OCRProcessor] Detected language : {detected_lang} → paddle_lang={paddle_lang}")
            print(f"[OCRProcessor] Sensitivity       : skip if <{self.DIFF_THRESHOLD*100:.0f}% pixels changed")

            # ---- 5. Main OCR loop -------------------------------------------
            prev_gray      = None
            last_text      = ""
            ocr_count      = 0
            segments       = []
            last_ocr_frame = -9999
            step           = max(1, int(fps * self.SAMPLE_INTERVAL))

            frame_idx = 0
            while frame_idx < total_frames:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if not ret:
                    frame_idx += step
                    continue

                curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                edges = cv2.Canny(curr_gray, 100, 200)
                if np.count_nonzero(edges) / edges.size < 0.008:
                    prev_gray = curr_gray
                    frame_idx += step
                    continue

                if self._frames_are_same(prev_gray, curr_gray):
                    prev_gray = curr_gray
                    frame_idx += step
                    continue

                if not self._frame_has_text_regions(curr_gray):
                    prev_gray = curr_gray
                    frame_idx += step
                    continue

                prev_gray = curr_gray

                ocr_count   += 1
                frame_small  = cv2.resize(frame, (0, 0), fx=0.6, fy=0.6)
                if is_code_video:
                    mean_brightness = np.mean(cv2.cvtColor(frame_small, cv2.COLOR_BGR2GRAY))
                    if mean_brightness < 100:  # dark theme → invert
                        frame_small = cv2.bitwise_not(frame_small)

                lines = self._run_ocr_on_frame(frame_small, paddle_lang, is_code=is_code_video)
                lines = [l for l in lines if not self._is_url_or_browser_content(l)]
                lines = [l for l in lines if not self._is_debug_or_ad_noise(l)]

                if is_code_video:
                    filtered_lines = [l for l in lines if self._line_score(l) >= 1.5]
                    lines = filtered_lines if filtered_lines else lines

                if not lines:
                    frame_idx += step
                    continue

                last_ocr_frame = frame_idx
                page_text      = " | ".join(lines)

                if self._is_duplicate(page_text, last_text):
                    secs   = int(frame_idx / fps)
                    mm, ss = divmod(secs, 60)
                    hh, mm = divmod(mm, 60)
                    print(f"[OCRProcessor] Duplicate at {hh:02d}:{mm:02d}:{ss:02d} — skipped")
                    frame_idx += step
                    continue

                secs              = int(frame_idx / fps)
                mm, ss            = divmod(secs, 60)
                hh, mm            = divmod(mm, 60)
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
                    print(f"[OCRProcessor] {pct:5.1f}% | OCR runs: {ocr_count} | Saved: {len(segments)}")

                frame_idx += step

            print(f"\n[OCRProcessor] ✅ Done!")
            print(f"[OCRProcessor] OCR ran on  : {ocr_count} unique frames")
            print(f"[OCRProcessor] Saved       : {len(segments)} segments")
            segments = self._deduplicate_segments(segments, is_code=is_code_video)

            return {
                "segments": segments,
                "total":    len(segments),
                "language": detected_lang,
                "url_type": "local"
            }

        finally:
            if cap is not None:
                cap.release()
                print(f"[OCRProcessor] Video capture released.")

            if is_temp and os.path.exists(video_path):
                time.sleep(0.5)
                try:
                    os.remove(video_path)
                    print(f"[OCRProcessor] Temp file deleted.")
                except Exception as e:
                    print(f"[OCRProcessor] Could not delete temp file: {e}")