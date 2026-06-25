import os
import json
import logging
import re
from app.services.cancellation_registry import is_cancelled, PipelineCancelledError,  check_cancelled

from groq import Groq
from google import genai
from google.genai import types
from app.config import settings
from app.services.quality_service import (
    extract_source_text_for_segment,
    score_segmentation,
)

logger = logging.getLogger(__name__)

class SegmentationUnavailableError(Exception):
    """Raised when both Gemini and Groq fail due to overload or rate limits."""
    pass


def is_noise(part: str) -> bool:
    if re.search(r'https?://|\.com|\.org|www\.', part):
        return True
    
    if len(part) > 0 and len(re.findall(r'\d', part)) / len(part) > 0.3:
        return True
    
    weird_chars = len(re.findall(r'[^a-zA-Z0-9\u0600-\u06FF\s\.\,\!\?\-]', part))
    if len(part) > 0 and weird_chars / len(part) > 0.2:
        return True
    
    if len(part.split()) == 1 and len(part) < 4:
        return True
    
    if re.search(r'(.)\1{3,}', part):
        return True
    
    return False


# --------------------------------clean_ocr_text--------------------------------
def clean_ocr_text(ocr_text: str) -> str:
    if not ocr_text or ocr_text == "None":
        return ""
    
    parts = [p.strip() for p in ocr_text.split("|")]
    seen = set()
    unique_parts = []
    
    for part in parts:
        if not part or part in seen:
            continue
        if is_noise(part):
            continue
        seen.add(part)
        unique_parts.append(part)
    
    return " | ".join(unique_parts)


# --------------------------------clean_transcript--------------------------------
def clean_transcript(text: str) -> str:
    lines = text.split('\n')
    cleaned = []
    prev_line = ""
    
    for line in lines:
        content = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', line).strip()
        
        if content == prev_line:
            continue
        
        words = content.split()
        if len(words) < 1:
            continue
        
        cleaned.append(line)
        prev_line = content
    
    return '\n'.join(cleaned)

# --------------------------------segmentations--------------------------------
def estimate_tokens(text: str) -> int:
    return len(text)

def chunk_text(text: str, max_words: int = 2500) -> list:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i:i + max_words]))
    return chunks

#********************************************
# ── Time helpers ──────────────────────────────────────────────────────────────

def _time_str_to_seconds(t: str) -> int:
    """'00:01:30' or '01:30' or '90' → seconds int."""
    if not t:
        return 0
    parts = str(t).strip().split(":")
    try:
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
        elif len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        else:
            return int(parts[0])
    except (ValueError, IndexError):
        return 0
#********************************************

def build_prompt(merged_text: str, final_language: str = "ar") -> str:
    lang_instruction = "English" if final_language == "en" else "Arabic"

    return f"""
You are an expert educational content analyzer.
Analyze the following video transcript and segment it into main topics and sub-topics.

CRITICAL RULES - READ CAREFULLY:

1. DESCRIPTION MUST BE VERBATIM:
   - Copy the EXACT text from the transcript lines word for word
   - Do NOT summarize, paraphrase, shorten, or rewrite in any way
   - Do NOT add any words not in the original transcript
   - WRONG: "The lecturer explains what a struct is and its properties"
   - CORRECT: "اليوم هنتكلم في موضوع مهم جدا يا شباب وهو موضوع الاستراكت Struct | St xruct: collection of a fixed number of components members. | accessed by name | Members may be of different types."
   - Never include timestamps like [00:22:30] inside the description field

2. TIMESTAMPS:
   - start_time and end_time MUST be taken exactly from the transcript
   - Minimum sub_topic duration is 30 seconds - never make a sub_topic shorter than that
   - Every second of the transcript MUST be covered - no gaps allowed

3. LANGUAGE RULES:
   - The required output language is: {lang_instruction}
   - main_topic, title, sub_topic names, key_points MUST all be in {lang_instruction}
   - If {lang_instruction} is Arabic: use clean Arabic only, no English words, no symbols
   - If {lang_instruction} is English: use clean English only
   - description field: keep as-is from transcript, no translation

4. KEY POINTS RULES:
   - key_points MUST come from actual slide/OCR content in the transcript
   - Do NOT invent or hallucinate key points
   - Maximum 3 key points per segment
   - Must be in {lang_instruction}

5. STRUCTURE RULES:
   - Each segment must represent a clearly distinct topic
   - Each segment must have at least 2 sub_topics
   - sub_topics must be consecutive with no gaps
   - Never generate empty or placeholder content
   - If content is unclear, merge with previous segment

6. CONTENT TYPE RULES:
   - For each sub_topic, classify it as one of:
     * definition: explains what something is
     * problem: explains a problem or why something fails
     * solution: explains how to solve or steps to follow
     * example: applies concepts on a practical example
     * comparison: explains the difference between two or more concepts
     * if the sub_topic mainly uses examples to explain, classify as example not definition
     * general: anything else
   - Choose only ONE type per sub_topic

7. Return ONLY valid JSON, no markdown, no extra text.
8. Format:
{{
  "total_segments": number,
  "segments": [
    {{
      "segment_number": 1,
      "start_time": "00:00",
      "end_time": "01:16",
      "main_topic": "topic name in {lang_instruction}",
      "title": "descriptive title in {lang_instruction}",
      "sub_topics": [
        {{
          "name": "sub topic name in {lang_instruction}",
          "start_time": "00:00",
          "end_time": "00:30",
          "description": "EXACT verbatim combined text from transcript lines, no timestamps",
          "content_type": "one of: definition, problem, solution, example, general"
        }}
      ],
      "key_points": ["point 1 in {lang_instruction}", "point 2 in {lang_instruction}"]
    }}
  ]
}}

Transcript:
{merged_text}
"""


#async def call_groq_with_retry(client, chunk: str, chunk_index: int, final_language: str = "ar", max_retries: int = 3):
async def call_groq_with_retry(client,  chunk: str,  chunk_index: int,video_id: int,final_language: str = "ar",max_retries: int = 3):
    current_chunk = chunk

    for attempt in range(max_retries):
        try:
            check_cancelled(video_id)
            prompt = build_prompt(current_chunk, final_language=final_language)
            estimated_tokens = estimate_tokens(prompt)

            logger.info(f"[Segmentation] Chunk {chunk_index+1}, attempt {attempt+1}, ~{estimated_tokens} tokens")

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=30000,
                    temperature=0.3
                )
            )

            text = response.text.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            if not text.endswith("}"):
                # قطع عند آخر segment كامل
                last_bracket = text.rfind("}]")
                if last_bracket != -1:
                    text = text[:last_bracket + 2] + "\n}"

            result = json.loads(text)
            return result.get("segments", [])

        except Exception as e:
            error_str = str(e).lower()

            is_token_error = any(k in error_str for k in [
                "rate_limit", "context", "token", "exceeded", "413", "400"
            ])

            if is_token_error and attempt < max_retries - 1:
                logger.warning(f"[Segmentation] Chunk {chunk_index+1} too large, splitting...")

                words = current_chunk.split()
                if len(words) < 10:
                    return []

                mid = len(words) // 2
                half1 = " ".join(words[:mid])
                half2 = " ".join(words[mid:])

                seg1 = await call_groq_with_retry(client, half1, chunk_index, video_id, final_language,  max_retries)
                seg2 = await call_groq_with_retry(client, half2, chunk_index, video_id, final_language,  max_retries)

                return seg1 + seg2

            elif attempt < max_retries - 1:
                import asyncio
                await asyncio.sleep(2 ** attempt)

            else:
                logger.error(f"[Segmentation] Gemini failed after {max_retries} attempts for chunk {chunk_index+1}: {e}")
                logger.info(f"[Segmentation] Falling back to Groq for chunk {chunk_index+1}")

                try:
                    return await call_groq_fallback(current_chunk, chunk_index, video_id, final_language)
                except Exception as groq_error:
                    logger.error(f"[Segmentation] Groq fallback also failed for chunk {chunk_index+1}: {groq_error}")
                    raise SegmentationUnavailableError(
                        "Both Gemini and Groq are currently overloaded. Please try again tomorrow."
                    ) from groq_error

    return []



async def call_groq_fallback(chunk: str, chunk_index: int, video_id: int, final_language: str = "ar", max_retries: int = 2):
    groq_client = Groq(api_key=settings.GROQ_API_KEY_segments)
    current_chunk = chunk

    for attempt in range(max_retries):
        try:
            check_cancelled(video_id)
            prompt = build_prompt(current_chunk, final_language=final_language)

            logger.info(f"[Segmentation][Groq Fallback] Chunk {chunk_index+1}, attempt {attempt+1}")

            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=8000,
            )

            text = response.choices[0].message.content.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            if not text.endswith("}"):
                last_bracket = text.rfind("}]")
                if last_bracket != -1:
                    text = text[:last_bracket + 2] + "\n}"

            result = json.loads(text)
            return result.get("segments", [])

        except Exception as e:
            error_str = str(e).lower()
            is_token_error = any(k in error_str for k in [
                "rate_limit", "context", "token", "exceeded", "413", "400"
            ])

            if is_token_error:
                logger.error(f"[Segmentation][Groq Fallback] Token/rate limit error: {e}")
                raise

            if attempt < max_retries - 1:
                import asyncio
                await asyncio.sleep(2 ** attempt)
            else:
                logger.error(f"[Segmentation][Groq Fallback] Failed: {e}")
                raise

    return []


async def segment_topics(merged: list, video_id: int, ocr_language: str ,transcript_language: str) -> dict:
    logger.info(f"[Segmentation] Starting: video_id={video_id}")

    valid_languages = {"ar", "en"}
    
    ocr_lang = (ocr_language or "").strip().lower()
    transcript_lang = (transcript_language or "").strip().lower()

    if ocr_lang in valid_languages:
        final_language = ocr_lang
    elif transcript_lang in valid_languages:
        final_language = transcript_lang
    else:
        final_language = "ar"  # fallback

    logger.info(f"[Segmentation] Final language: {final_language}")

    clean_text = ""
    for seg in merged:
        if seg.get("combined_text") and seg["combined_text"] != "None":
            clean_text += f"[{seg['timestamp']}] {seg['combined_text']}\n"
        elif seg.get("transcript_text") and seg["transcript_text"] != "None":clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"
        elif seg.get("ocr_text") and len(seg.get("ocr_text", "")) > 20:
            clean_text += f"[{seg['timestamp']}] {seg['ocr_text']}\n"

    clean_text = clean_transcript(clean_text)
    chunks = chunk_text(clean_text, max_words=2500)
    logger.info(f"[Segmentation] Split into {len(chunks)} chunks (max 2500 words each)")

    # client = Groq(api_key=settings.GROQ_API_KEY)
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    all_segments = []

    for i, chunk in enumerate(chunks):
        check_cancelled(video_id)
        logger.info(f"[Segmentation] Processing chunk {i+1}/{len(chunks)}")
        segments = await call_groq_with_retry(client, chunk, chunk_index=i, video_id=video_id, final_language=final_language)
        all_segments.extend(segments)

    for idx, seg in enumerate(all_segments):
        seg["segment_number"] = idx + 1

    #********************************************
    # ── Attach source text and quality score to every segment ────────────────
    logger.info(f"[Segmentation] Scoring {len(all_segments)} segments vs merged text")
    for seg in all_segments:
        check_cancelled(video_id)
        start_s = _time_str_to_seconds(seg.get("start_time", "00:00"))
        end_s   = _time_str_to_seconds(seg.get("end_time",   "00:00"))

        source_text = extract_source_text_for_segment(merged, start_s, end_s)
        quality     = score_segmentation(
            segment_title=seg.get("title", ""),
            segment_main_topic=seg.get("main_topic", ""),
            source_text=source_text,
        )

        seg["_source_text"] = source_text
        seg["_quality"]     = quality

        if quality["flag"]:
            logger.warning(
                f"[Segmentation] Low quality segment #{seg['segment_number']} "
                f"'{seg.get('title', '')}' — score={quality['score']:.4f}"
            )
    #********************************************

    final_result = {
        "total_segments": len(all_segments),
        "segments": all_segments
    }

    with open(f"segmentation_{video_id}.json", "w", encoding="utf-8") as f:
        json.dump(final_result, f, ensure_ascii=False, indent=2)

    logger.info(f"[Segmentation] Done: video_id={video_id}, total={len(all_segments)}")
    return final_result

# import os
# import json
# import logging
# import re
# # from groq import Groq
# from app.config import settings

# import google.generativeai as genai
# import asyncio

# # إعداد Gemini (يفضل يكون بره الدالة)
# genai.configure(api_key=settings.GEMINI_API_KEY) # اتأكدي إن المفتاح في الـ settings
# model = genai.GenerativeModel('gemini-3.1-flash-lite')


# logger = logging.getLogger(__name__)

# # --------------------------------is noise --------------------------------
# def is_noise(part: str) -> bool:
#     if re.search(r'https?://|\.com|\.org|www\.', part):
#         return True
    
#     if len(part) > 0 and len(re.findall(r'\d', part)) / len(part) > 0.3:
#         return True
    
#     weird_chars = len(re.findall(r'[^a-zA-Z0-9\u0600-\u06FF\s\.\,\!\?\-]', part))
#     if len(part) > 0 and weird_chars / len(part) > 0.2:
#         return True
    
#     if len(part.split()) == 1 and len(part) < 4:
#         return True
    
#     if re.search(r'(.)\1{3,}', part):
#         return True
    
#     return False


# # --------------------------------clean_ocr_text--------------------------------
# def clean_ocr_text(ocr_text: str) -> str:
#     if not ocr_text or ocr_text == "None":
#         return ""
    
#     parts = [p.strip() for p in ocr_text.split("|")]
#     seen = set()
#     unique_parts = []
    
#     for part in parts:
#         if not part or part in seen:
#             continue
#         if is_noise(part):
#             continue
#         seen.add(part)
#         unique_parts.append(part)
    
#     return " | ".join(unique_parts)


# # --------------------------------clean_transcript--------------------------------
# def clean_transcript(text: str) -> str:
#     lines = text.split('\n')
#     cleaned = []
#     prev_line = ""
    
#     for line in lines:
#         content = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', line).strip()
        
#         if content == prev_line:
#             continue
        
#         words = content.split()
#         if len(words) < 1:
#             continue
        
#         cleaned.append(line)
#         prev_line = content
    
#     return '\n'.join(cleaned)

# # --------------------------------segmentations--------------------------------
# def estimate_tokens(text: str) -> int:
#     return len(text)

# def chunk_text(text: str, max_words: int = 2500) -> list:
#     words = text.split()
#     chunks = []
#     for i in range(0, len(words), max_words):
#         chunks.append(" ".join(words[i:i + max_words]))
#     return chunks


# def build_prompt(merged_text: str, final_language: str = "ar", start_time_hint: str = None) -> str:
#     lang_instruction = "English" if final_language == "en" else "Arabic"
#     continuation_note = ""
#     if start_time_hint:
#         continuation_note = f"""
# IMPORTANT: This transcript is a CONTINUATION of a longer video.
# The previous part ended at {start_time_hint}.
# ALL timestamps MUST be >= {start_time_hint}. Do NOT start from 00:00:00.
# """
        
#     return f"""    
# You are an expert educational content analyzer.
# {continuation_note}
# Analyze the following video transcript and segment it into main topics and sub-topics.

# CRITICAL RULES - READ CAREFULLY:

# 1. DESCRIPTION MUST BE VERBATIM:
#    - Copy the EXACT text from the transcript lines word for word
#    - Do NOT summarize, paraphrase, shorten, or rewrite in any way
#    - Do NOT add any words not in the original transcript
#    - WRONG: "The lecturer explains what a struct is and its properties"
#    - CORRECT: "اليوم هنتكلم في موضوع مهم جدا يا شباب وهو موضوع الاستراكت Struct | St xruct: collection of a fixed number of components members. | accessed by name | Members may be of different types."
#    - Never include timestamps like [00:22:30] inside the description field

# 2. TIMESTAMPS:
#    - start_time and end_time MUST be taken exactly from the transcript
#    - Minimum sub_topic duration is 30 seconds - never make a sub_topic shorter than that
#    - Every second of the transcript MUST be covered - no gaps allowed

# 3. LANGUAGE RULES:
#    - The required output language is: {lang_instruction}
#    - main_topic, title, sub_topic names, key_points MUST all be in {lang_instruction}
#    - If {lang_instruction} is Arabic: use clean Arabic only, no English words, no symbols
#    - If {lang_instruction} is English: use clean English only
#    - description field: keep as-is from transcript, no translation

# 4. KEY POINTS RULES:
#    - key_points MUST come from actual slide/OCR content in the transcript
#    - Do NOT invent or hallucinate key points
#    - Maximum 3 key points per segment
#    - Must be in {lang_instruction}

# 5. STRUCTURE RULES:
#    - Each segment must represent a clearly distinct topic
#    - Each segment must have at least 2 sub_topics
#    - sub_topics must be consecutive with no gaps
#    - Never generate empty or placeholder content
#    - If content is unclear, merge with previous segment

# 6. Return ONLY valid JSON, no markdown, no extra text.
# 7. Format:
# {{
#   "total_segments": number,
#   "segments": [
#     {{
#       "segment_number": 1,
#       "start_time": "00:00:00",
#       "end_time": "01:16:00",
#       "main_topic": "topic name in {lang_instruction}",
#       "title": "descriptive title in {lang_instruction}",
#       "sub_topics": [
#         {{
#           "name": "sub topic name in {lang_instruction}",
#           "start_time": "00:00:00",
#           "end_time": "00:30:00",
#           "description": "EXACT verbatim combined text from transcript lines, no timestamps"
#         }}
#       ],
#       "key_points": ["point 1 in {lang_instruction}", "point 2 in {lang_instruction}"]
#     }}
#   ]
# }}

# Transcript:
# {merged_text}
# """


# async def call_gemini_with_retry(chunk: str, chunk_index: int, final_language: str = "ar", max_retries: int = 3, start_time_hint=None) -> list:
#     current_chunk = chunk

#     for attempt in range(max_retries):
#         try:
#             prompt = build_prompt(current_chunk, final_language=final_language, start_time_hint=start_time_hint)
#             logger.info(f"[Segmentation] Chunk {chunk_index+1}, attempt {attempt+1}")

#             # تشغيل Gemini في thread منفصل عشان ما يعطلش الـ async loop
#             # لأن مكتبة google-generativeai مش async بشكل كامل في الـ calls البسيطة
#             loop = asyncio.get_event_loop()
#             response = await loop.run_in_executor(
#                 None, 
#                 lambda: model.generate_content(prompt)
#             )

#             text = response.text.strip()
            
#             # تنظيف الرد من علامات الـ markdown لو موجودة
#             text = text.replace("```json", "").replace("```", "").strip()
            
#             result = json.loads(text)
#             return result.get("segments", [])

#         except Exception as e:
#             error_str = str(e).lower()
#             # التحقق من أخطاء الـ Tokens أو الـ Rate Limit
#             is_token_error = any(keyword in error_str for keyword in ["rate_limit", "429", "context", "limit"])

#             if is_token_error and attempt < max_retries - 1:
#                 logger.warning(f"[Segmentation] Chunk {chunk_index+1} too large, splitting...")
#                 words = current_chunk.split()
#                 if len(words) < 10: return []

#                 mid = len(words) // 2
#                 half1 = " ".join(words[:mid])
#                 half2 = " ".join(words[mid:])

#                 # نداء الدالة لنفسها (Recursion) للأجزاء الصغيرة
#                 seg1 = await call_gemini_with_retry(half1, chunk_index, final_language, max_retries, start_time_hint)
#                 last_hint = seg1[-1].get("end_time") if seg1 else start_time_hint
#                 seg2 = await call_gemini_with_retry(half2, chunk_index, final_language, max_retries, last_hint)
#                 return seg1 + seg2

#             elif attempt < max_retries - 1:
#                 wait_time = 2 ** attempt
#                 logger.warning(f"[Segmentation] Error: {e}, retrying in {wait_time}s...")
#                 await asyncio.sleep(wait_time)
#             else:
#                 logger.error(f"[Segmentation] Chunk {chunk_index+1} failed: {e}")
#                 raise
#     return []


# def enrich_subtopics_with_combined(segments: list, merged: list) -> list:
#     def time_to_seconds(t: str) -> int:
#         parts = t.strip().split(":")
#         parts = [int(p) for p in parts]
#         if len(parts) == 2:      # MM:SS
#             return parts[0] * 60 + parts[1]
#         elif len(parts) == 3:    # HH:MM:SS
#             return parts[0] * 3600 + parts[1] * 60 + parts[2]
#         return 0

#     merged_index = {}
#     for seg in merged:
#         ts = seg.get("timestamp", "")
#         combined = seg.get("combined_text", "") 
#         if ts and combined and combined != "None":
#             merged_index[time_to_seconds(ts)] = combined.strip()

#     for segment in segments:
#         for sub in segment.get("sub_topics", []):
#             start = time_to_seconds(sub.get("start_time", "0:00"))
#             end   = time_to_seconds(sub.get("end_time",   "0:00"))

#             combined_parts = [
#                 text
#                 for sec, text in merged_index.items()
#                 if start <= sec < end
#             ]

#             if combined_parts:


#                 sub["description"] = " | ".join(combined_parts)

#     return segments


# async def segment_topics(merged: list, video_id: int, ocr_language: str, transcript_language: str) -> dict:
#     logger.info(f"[Segmentation] Starting: video_id={video_id}")

#     valid_languages = {"ar", "en"}
    
#     ocr_lang = (ocr_language or "").strip().lower()
#     transcript_lang = (transcript_language or "").strip().lower()

#     if ocr_lang in valid_languages:
#         final_language = ocr_lang
#     elif transcript_lang in valid_languages:
#         final_language = transcript_lang
#     else:
#         final_language = "ar"

#     logger.info(f"[Segmentation] Final language: {final_language}")

#     clean_text = ""
#     for seg in merged:
#         if seg.get("combined_text") and seg["combined_text"] != "None":
#             clean_text += f"[{seg['timestamp']}] {seg['combined_text']}\n"
#         elif seg.get("transcript_text") and seg["transcript_text"] != "None":
#             clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"
#         elif seg.get("ocr_text") and len(seg.get("ocr_text", "")) > 20:
#             clean_text += f"[{seg['timestamp']}] {seg['ocr_text']}\n"

#     clean_text = clean_transcript(clean_text)
#     logger.info(f"[Segmentation] Total chars: {estimate_tokens(clean_text)}")

#     all_segments = await call_gemini_with_retry(
#         clean_text,
#         chunk_index=0,
#         final_language=final_language
#     )

#     for idx, seg in enumerate(all_segments):
#         seg["segment_number"] = idx + 1

#     all_segments = enrich_subtopics_with_combined(all_segments, merged)

#     final_result = {
#         "total_segments": len(all_segments),
#         "segments": all_segments
#     }

#     with open(f"segmentation_{video_id}.json", "w", encoding="utf-8") as f:
#         json.dump(final_result, f, ensure_ascii=False, indent=2)

#     logger.info(f"[Segmentation] Done: video_id={video_id}, total={len(all_segments)}")
#     return final_result
# # import time
# # import asyncio
# # import logging

# # logger = logging.getLogger(__name__)

# # async def compare_segmentation_approaches(merged: list, video_id: int, ocr_language: str, transcript_language: str):
    
# #     # ============ APPROACH 1: OLD (combined text for segmentation) ============
# #     logger.info("=" * 60)
# #     logger.info("[COMPARE] Starting OLD approach (combined text)")
# #     logger.info("=" * 60)

# #     clean_text_old = ""
# #     for seg in merged:
# #         if seg.get("combined_text") and seg["combined_text"] != "None":
# #             clean_text_old += f"[{seg['timestamp']}] {seg['combined_text']}\n"

# #     clean_text_old = clean_transcript(clean_text_old)
# #     chunks_old = chunk_text(clean_text_old, max_words=2500)
# #     total_tokens_old = estimate_tokens(clean_text_old)

# #     logger.info(f"[COMPARE][OLD] Total chars (≈tokens): {total_tokens_old}")
# #     logger.info(f"[COMPARE][OLD] Number of chunks: {len(chunks_old)}")

# #     client = Groq(api_key=settings.GROQ_API_KEY)
# #     start_old = time.time()

# #     all_segments_old = []
# #     for i, chunk in enumerate(chunks_old):
# #         segments = await call_groq_with_retry(client, chunk, chunk_index=i, final_language="ar")
# #         all_segments_old.extend(segments)

# #     time_old = time.time() - start_old
# #     logger.info(f"[COMPARE][OLD] Total segments: {len(all_segments_old)}")
# #     logger.info(f"[COMPARE][OLD] Time taken: {time_old:.2f}s")

# #     # ============ APPROACH 2: NEW (transcript only + enrich after) ============
# #     logger.info("=" * 60)
# #     logger.info("[COMPARE] Starting NEW approach (transcript only + enrich)")
# #     logger.info("=" * 60)

# #     clean_text_new = ""
# #     for seg in merged:
# #         if seg.get("transcript_text") and seg["transcript_text"] != "None":
# #             clean_text_new += f"[{seg['timestamp']}] {seg['transcript_text']}\n"
# #         elif seg.get("ocr_text") and len(seg.get("ocr_text", "")) > 20:
# #             clean_text_new += f"[{seg['timestamp']}] {seg['ocr_text']}\n"

# #     clean_text_new = clean_transcript(clean_text_new)
# #     chunks_new = chunk_text(clean_text_new, max_words=2500)
# #     total_tokens_new = estimate_tokens(clean_text_new)

# #     logger.info(f"[COMPARE][NEW] Total chars (≈tokens): {total_tokens_new}")
# #     logger.info(f"[COMPARE][NEW] Number of chunks: {len(chunks_new)}")

# #     start_new = time.time()

# #     all_segments_new = []
# #     for i, chunk in enumerate(chunks_new):
# #         segments = await call_groq_with_retry(client, chunk, chunk_index=i, final_language="ar")
# #         all_segments_new.extend(segments)

# #     all_segments_new = enrich_subtopics_with_combined(all_segments_new, merged)
# #     time_new = time.time() - start_new

# #     logger.info(f"[COMPARE][NEW] Total segments: {len(all_segments_new)}")
# #     logger.info(f"[COMPARE][NEW] Time taken: {time_new:.2f}s")

# #     # ============ SUMMARY ============
# #     token_saved = total_tokens_old - total_tokens_new
# #     token_saved_pct = (token_saved / total_tokens_old * 100) if total_tokens_old > 0 else 0
# #     time_saved = time_old - time_new
# #     chunks_saved = len(chunks_old) - len(chunks_new)

# #     logger.info("=" * 60)
# #     logger.info("[COMPARE] ===== FINAL SUMMARY =====")
# #     logger.info(f"[COMPARE] Tokens OLD:      {total_tokens_old}")
# #     logger.info(f"[COMPARE] Tokens NEW:      {total_tokens_new}")
# #     logger.info(f"[COMPARE] Tokens saved:    {token_saved} ({token_saved_pct:.1f}%)")
# #     logger.info(f"[COMPARE] Chunks OLD:      {len(chunks_old)}")
# #     logger.info(f"[COMPARE] Chunks NEW:      {len(chunks_new)}")
# #     logger.info(f"[COMPARE] Chunks saved:    {chunks_saved}")
# #     logger.info(f"[COMPARE] Time OLD:        {time_old:.2f}s")
# #     logger.info(f"[COMPARE] Time NEW:        {time_new:.2f}s")
# #     logger.info(f"[COMPARE] Time saved:      {time_saved:.2f}s")
# #     logger.info(f"[COMPARE] Segments OLD:    {len(all_segments_old)}")
# #     logger.info(f"[COMPARE] Segments NEW:    {len(all_segments_new)}")
# #     logger.info("=" * 60)

# #     return {
# #         "old": all_segments_old,
# #         "new": all_segments_new,
# #         "stats": {
# #             "tokens_old": total_tokens_old,
# #             "tokens_new": total_tokens_new,
# #             "token_saved_pct": round(token_saved_pct, 1),
# #             "time_old": round(time_old, 2),
# #             "time_new": round(time_new, 2),
# #             "chunks_old": len(chunks_old),
# #             "chunks_new": len(chunks_new),
# #         }
# #     }