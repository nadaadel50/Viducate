import os
import json
import logging
import re
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)

# --------------------------------is noise --------------------------------
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

6. Return ONLY valid JSON, no markdown, no extra text.
7. Format:
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
          "description": "EXACT verbatim combined text from transcript lines, no timestamps"
        }}
      ],
      "key_points": ["point 1 in {lang_instruction}", "point 2 in {lang_instruction}"]
    }}
  ]
}}

Transcript:
{merged_text}
"""


async def call_groq_with_retry(client: Groq, chunk: str, chunk_index: int, final_language: str = "ar", max_retries: int = 3) -> list:
    current_chunk = chunk

    for attempt in range(max_retries):
        try:
            prompt = build_prompt(current_chunk, final_language=final_language)
            estimated_tokens = estimate_tokens(prompt)
            logger.info(f"[Segmentation] Chunk {chunk_index+1}, attempt {attempt+1}, ~{estimated_tokens} tokens")

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2500,
            )

            text = response.choices[0].message.content.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
            return result.get("segments", [])

        except Exception as e:
            error_str = str(e).lower()
            is_token_error = any(keyword in error_str for keyword in [
                "rate_limit", "context_length", "token", "too long", "exceeded", "413", "400"
            ])

            if is_token_error and attempt < max_retries - 1:
                logger.warning(
                    f"[Segmentation] Chunk {chunk_index+1} too large (attempt {attempt+1}), splitting in half..."
                )
                words = current_chunk.split()
                if len(words) < 10:
                    logger.error(f"[Segmentation] Chunk too small to split further, skipping...")
                    return []

                mid = len(words) // 2
                half1 = " ".join(words[:mid])
                half2 = " ".join(words[mid:])

                segments_1 = await call_groq_with_retry(client, half1, chunk_index, final_language, max_retries)
                segments_2 = await call_groq_with_retry(client, half2, chunk_index, final_language, max_retries)
                return segments_1 + segments_2

            elif not is_token_error and attempt < max_retries - 1:
                import asyncio
                wait_time = 2 ** attempt
                logger.warning(f"[Segmentation] Non-token error: {e}, retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            else:
                logger.error(f"[Segmentation] Chunk {chunk_index+1} failed after {max_retries} attempts: {e}")
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
        elif seg.get("transcript_text") and seg["transcript_text"] != "None":
            clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"
        elif seg.get("ocr_text") and len(seg.get("ocr_text", "")) > 20:
            clean_text += f"[{seg['timestamp']}] {seg['ocr_text']}\n"

    clean_text = clean_transcript(clean_text)
    chunks = chunk_text(clean_text, max_words=2500)
    logger.info(f"[Segmentation] Split into {len(chunks)} chunks (max 2500 words each)")

    client = Groq(api_key=settings.GROQ_API_KEY)
    all_segments = []

    for i, chunk in enumerate(chunks):
        logger.info(f"[Segmentation] Processing chunk {i+1}/{len(chunks)}")
        segments = await call_groq_with_retry(client, chunk, chunk_index=i, final_language=final_language)
        all_segments.extend(segments)

    for idx, seg in enumerate(all_segments):
        seg["segment_number"] = idx + 1

    final_result = {
        "total_segments": len(all_segments),
        "segments": all_segments
    }

    with open(f"segmentation_{video_id}.json", "w", encoding="utf-8") as f:
        json.dump(final_result, f, ensure_ascii=False, indent=2)

    logger.info(f"[Segmentation] Done: video_id={video_id}, total={len(all_segments)}")
    return final_result