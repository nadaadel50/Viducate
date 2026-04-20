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
    
    # percent of digits exist is high
    if len(part) > 0 and len(re.findall(r'\d', part)) / len(part) > 0.3:
        return True
    
    # (OCR errors)
    weird_chars = len(re.findall(r'[^a-zA-Z0-9\u0600-\u06FF\s\.\,\!\?\-]', part))
    if len(part) > 0 and weird_chars / len(part) > 0.2:
        return True
    
    # 
    if len(part.split()) == 1 and len(part) < 4:
        return True
    
    # (OCR artifact)
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

def chunk_text(text: str, max_words: int = 4000) -> list:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i:i + max_words]))
    return chunks


def build_prompt(merged_text: str) -> str:
    return f"""
You are an expert educational content analyzer.
Analyze the following video transcript and segment it into main topics and sub-topics.

Rules:
1. Each sub-topic description MUST be the EXACT text from the transcript, not a summary.
2. Return ONLY valid JSON, no extra text, no markdown.
3. start_time and end_time MUST be taken exactly from the transcript timestamps, not estimated.
4. Determine the number of segments naturally based on the content - don't force a specific number.
5. Each segment should represent a clearly distinct topic or concept.
6. Each segment should have at least 2 sub_topics.
7. description MUST be a complete sentence or paragraph from the transcript, not just a fragment and NEVER include timestamps like [00:22:30] inside the description field.
8. Never cut a sentence in the middle - always include the full thought.
9. Every minute of the transcript MUST be covered by a sub_topic. No gaps allowed between sub_topics.
10. sub_topics must be consecutive and cover the full time range of their parent segment.
11. key_points should only include the most important concepts, maximum 3 points per segment.
12. key_points MUST contain only Arabic or English - no other languages
13. VERY IMPORTANT:
- If the transcript is in Arabic → ALL output MUST be in Arabic, main_topic MUST be in Arabic, title MUST be in Arabic, key_points MUST be in Arabic
- If the transcript is in Arabic → sub_topic names MUST be in Arabic
- If the transcript is in Arabic →  Sub-topic names MUST be clean Arabic phrases only.
- If the transcript is in Arabic →  Remove any foreign words, symbols, or non-Arabic characters.
- If the transcript is in Arabic →  Do NOT mix languages in any field.
- If the transcript is in Arabic →  If a word is unclear or corrupted, rewrite it in correct Arabic.

14. DO NOT translate into English under any condition if the transcript is Arabic.
15. QUALITY RULES:
- key_points MUST contain only Arabic or English - no other languages
- If transcript text is repetitive or unclear, use the OCR/slide content instead
- NEVER generate empty or placeholder segments
- If a segment has no clear content, merge it with the previous segment
- NEVER invent or hallucinate content not present in the transcript
16. Format:
{{
  "total_segments": number,
  "segments": [
    {{
      "segment_number": 1,
      "start_time": "00:00",
      "end_time": "01:16",
      "main_topic": "topic name",
      "title": "descriptive title",
      "sub_topics": [
        {{
          "name": "sub topic name",
          "start_time": "00:00",
          "end_time": "00:30",
          "description": "EXACT text from transcript"
        }}
      ],
      "key_points": ["point 1", "point 2"]
    }}
  ]
}}

Transcript:
{merged_text}
"""


async def call_groq_with_retry(client: Groq, chunk: str, chunk_index: int, max_retries: int = 3) -> list:

    current_chunk = chunk
    
    for attempt in range(max_retries):
        try:
            prompt = build_prompt(current_chunk)
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
                    f"[Segmentation] Chunk {chunk_index+1} too large, skipping..."
                )
                return []

            elif not is_token_error and attempt < max_retries - 1:
                # network error 
                import asyncio
                wait_time = 2 ** attempt  # exponential backoff: 1s, 2s, 4s
                logger.warning(f"[Segmentation] Non-token error: {e}, retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            else:
                logger.error(f"[Segmentation] Chunk {chunk_index+1} failed after {max_retries} attempts: {e}")
                raise

    return []


async def segment_topics(merged: list, video_id: int) -> dict:
    logger.info(f"[Segmentation] Starting: video_id={video_id}")

    clean_text = ""
    for seg in merged:
        if seg.get("combined_text") and seg["combined_text"] != "None":
            clean_text += f"[{seg['timestamp']}] {seg['combined_text']}\n"
        # fallback: transcript
        elif seg.get("transcript_text") and seg["transcript_text"] != "None":
            clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"
        # fallback: ocr 
        elif seg.get("ocr_text") and len(seg.get("ocr_text", "")) > 20:
            clean_text += f"[{seg['timestamp']}] {seg['ocr_text']}\n"
    
    clean_text = clean_transcript(clean_text)
    chunks = chunk_text(clean_text, max_words=4000)
    logger.info(f"[Segmentation] Split into {len(chunks)} chunks (max 4000 words each)")

    client = Groq(api_key=settings.GROQ_API_KEY)
    all_segments = []

    for i, chunk in enumerate(chunks):
        logger.info(f"[Segmentation] Processing chunk {i+1}/{len(chunks)}")
        
        segments = await call_groq_with_retry(client, chunk, chunk_index=i)
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