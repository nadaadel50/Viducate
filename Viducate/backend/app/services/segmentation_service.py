import os
import json
import logging
import asyncio
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)


def chunk_text(text: str, max_words: int = 10000, overlap: int = 200) -> list:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        end = min(i + max_words, len(words))
        chunks.append(" ".join(words[i:end]))
        i += max_words - overlap
    return chunks


def _topics_similar(topic1: str, topic2: str) -> bool:
    words1 = set(topic1.split())
    words2 = set(topic2.split())
    if not words1 or not words2:
        return False
    intersection = words1 & words2
    union = words1 | words2
    jaccard = len(intersection) / len(union)
    return jaccard >= 0.5


def merge_boundary_segments(all_segments: list) -> list:
    if not all_segments:
        return all_segments

    merged = [all_segments[0]]

    for current in all_segments[1:]:
        previous = merged[-1]

        prev_topic = previous["main_topic"].strip().lower()
        curr_topic = current["main_topic"].strip().lower()

        if prev_topic == curr_topic or _topics_similar(prev_topic, curr_topic):
            previous["end_time"] = current["end_time"]
            previous["sub_topics"].extend(current["sub_topics"])
            previous["key_points"] = list(set(
                previous["key_points"] + current["key_points"]
            ))[:3]
        else:
            merged.append(current)

    return merged


def build_prompt(transcript_text: str) -> str:
    return f"""
You are an expert educational content analyzer.
Analyze the following video transcript and segment it into main topics and sub-topics.

Rules:
1. Each sub-topic description MUST be the EXACT text from the transcript, not a summary.
2. Return ONLY valid JSON, no extra text, no markdown.
3. start_time and end_time MUST be taken exactly from the transcript timestamps, not estimated.
4."Each DISTINCT concept or algorithm MUST be its own segment.
For example, if the transcript covers G-Cost, H-Cost, and F-Cost separately,
these MUST be 3 different segments, not combined into one.
Aim for one segment per concept, typically 2-5 minutes per segment."
5. Each segment should represent a clearly distinct topic or concept.
6. Each segment should have at least 2 sub_topics.
7. description MUST be a complete sentence or paragraph from the transcript, not just a fragment.
8. Never cut a sentence in the middle - always include the full thought.
9. Every minute of the transcript MUST be covered by a sub_topic. No gaps allowed between sub_topics.
10. sub_topics must be consecutive and cover the full time range of their parent segment.
11. key_points should only include the most important concepts, maximum 3 points per segment.
12. VERY IMPORTANT:
- If the transcript is in Arabic → ALL output MUST be in Arabic, main_topic MUST be in Arabic, title MUST be in Arabic, key_points MUST be in Arabic
- If the transcript is in Arabic → sub_topic names MUST be in Arabic
- If the transcript is in Arabic → Sub-topic names MUST be clean Arabic phrases only.
- If the transcript is in Arabic → Remove any foreign words, symbols, or non-Arabic characters.
- If the transcript is in Arabic → Do NOT mix languages in any field.
- If the transcript is in Arabic → If a word is unclear or corrupted, rewrite it in correct Arabic.

13. DO NOT translate into English under any condition if the transcript is Arabic.
14. Format:
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
{transcript_text}
"""


async def segment_topics(transcript: list, video_id: int) -> dict:
    logger.info(f"[Segmentation] Starting: video_id={video_id}")
    transcript_file = f"transcript_{video_id}.txt"
    if os.path.exists(transcript_file):
        logger.info(f"[Segmentation] Reading from file: {transcript_file}")
        with open(transcript_file, "r", encoding="utf-8") as f:
            clean_text = f.read()
    else:
        clean_text = ""
        for seg in transcript:
            if seg.get("transcript_text") and seg["transcript_text"] != "None":
                clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"

    chunks = chunk_text(clean_text, max_words=3000, overlap=50)

    # clean_text = ""
    # for seg in transcript:
    #     if seg.get("transcript_text") and seg["transcript_text"] != "None":
    #         clean_text += f"[{seg['timestamp']}] {seg['transcript_text']}\n"

    # chunks = chunk_text(clean_text, max_words=6000, overlap=200)
    # logger.info(f"[Segmentation] Split into {len(chunks)} chunks")

    client = Groq(api_key=settings.GROQ_API_KEY)
    all_segments = []

    for i, chunk in enumerate(chunks):
        logger.info(f"[Segmentation] Processing chunk {i+1}/{len(chunks)}")
        prompt = build_prompt(chunk)

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )

            text = response.choices[0].message.content.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
            all_segments.extend(result["segments"])

            if i < len(chunks) - 1:
                tokens_used = response.usage.total_tokens
                wait_time = max(10, tokens_used / 100)
                logger.info(f"[Segmentation] Waiting {wait_time:.1f}s for rate limit...")
                await asyncio.sleep(wait_time)

        except json.JSONDecodeError as e:
            logger.error(f"[Segmentation] JSON parse error in chunk {i+1}: {e}")
            continue
        except Exception as e:
            logger.error(f"[Segmentation] Error in chunk {i+1}: {e}")
            raise

    all_segments = merge_boundary_segments(all_segments)

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