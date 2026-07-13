import os
import json
import logging
import re
from app.services.cancellation_registry import is_cancelled, PipelineCancelledError,  check_cancelled
from app.services.network_errors import NetworkUnavailableError, with_network_retry

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


# --------------------------------clean_transcript--------------------------------
def clean_transcript(text: str) -> str:
    lines = text.split('\n')
    cleaned = []
    prev_line = ""
    
    for line in lines:
        # Remove timestamp from the text if here
        content = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', line).strip()
        
        if content == prev_line:
            continue
        
        words = content.split()
        if len(words) < 1:
            continue
        
        cleaned.append(line)
        prev_line = content
    
    return '\n'.join(cleaned)

# segmentations
def estimate_tokens(text: str) -> int:
    return len(text)

def chunk_text(text: str, max_words: int = 2500) -> list:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i:i + max_words]))
    return chunks

# Time helpers 

def _time_str_to_seconds(t: str) -> int:
    
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

def _seconds_to_time_str(seconds: int) -> str:
    hh = seconds // 3600
    mm = (seconds % 3600) // 60
    ss = seconds % 60
    return f"{hh:02d}:{mm:02d}:{ss:02d}"


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
   - TIMESTAMPS format MUST be "HH:MM:SS" exactly
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
      "start_time": "00:00:00",
      "end_time": "01:16:00",
      "main_topic": "topic name in {lang_instruction}",
      "title": "descriptive title in {lang_instruction}",
      "sub_topics": [
        {{
          "name": "sub topic name in {lang_instruction}",
          "start_time": "00:00:00",
          "end_time": "00:30:00",
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


async def call_groq_with_retry(client,  chunk: str,  chunk_index: int,video_id: int,final_language: str = "ar",max_retries: int = 3):
    current_chunk = chunk

    for attempt in range(max_retries):
        try:
            check_cancelled(video_id)
            prompt = build_prompt(current_chunk, final_language=final_language)
            estimated_tokens = estimate_tokens(prompt)

            logger.info(f"[Segmentation] Chunk {chunk_index+1}, attempt {attempt+1}, ~{estimated_tokens} tokens")

            response = with_network_retry(
                lambda: client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        max_output_tokens=30000,
                        temperature=0.3
                )),
                context="SegmentationService Gemini call"
            )

            text = response.text.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            if not text.endswith("}"):
                last_bracket = text.rfind("}]")
                if last_bracket != -1:
                    text = text[:last_bracket + 2] + "\n}"

            result = json.loads(text)
            return result.get("segments", [])
        
        except NetworkUnavailableError:
            raise

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

            response = with_network_retry(
                lambda: groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=8000,
                ),
                context="SegmentationService Groq fallback call"
            )

            text = response.choices[0].message.content.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            if not text.endswith("}"):
                last_bracket = text.rfind("}]")
                if last_bracket != -1:
                    text = text[:last_bracket + 2] + "\n}"

            result = json.loads(text)
            return result.get("segments", [])
        
        except NetworkUnavailableError:
            raise

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

        # Normalize timestamps
    for seg in all_segments:
        seg["start_time"] = _seconds_to_time_str(_time_str_to_seconds(seg.get("start_time", "00:00:00")))
        seg["end_time"]   = _seconds_to_time_str(_time_str_to_seconds(seg.get("end_time", "00:00:00")))
        for sub in seg.get("sub_topics", []):
            sub["start_time"] = _seconds_to_time_str(_time_str_to_seconds(sub.get("start_time", "00:00:00")))
            sub["end_time"]   = _seconds_to_time_str(_time_str_to_seconds(sub.get("end_time", "00:00:00")))

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

    final_result = {
        "total_segments": len(all_segments),
        "segments": all_segments
    }

    with open(f"segmentation_{video_id}.json", "w", encoding="utf-8") as f:
        json.dump(final_result, f, ensure_ascii=False, indent=2)

    logger.info(f"[Segmentation] Done: video_id={video_id}, total={len(all_segments)}")
    return final_result
