import json
import logging
import re
import time
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"

DIFFICULTY_CONFIGS = {
    "easy":   {"num_questions": 5,  "description": "basic recall and definition questions"},
    "medium": {"num_questions": 7,  "description": "understanding and application questions"},
    "hard":   {"num_questions": 10, "description": "analysis, evaluation, and synthesis questions"},
}


def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def _build_segment_prompt(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    difficulty: str,
    language: str,
    segment_start_time: int,
    num_questions: int,
) -> str:
    lang_note = (
        "Write all text in Arabic only."
        if language == "ar"
        else "Write all text in English only."
    )
    diff_desc = DIFFICULTY_CONFIGS[difficulty]["description"]

    subtopics_text = "\n".join(
        f"  - {st['name']}: {st.get('description', '')[:200]}"
        for st in subtopics
        if st.get("name")
    )

    return f"""You are an expert educational quiz creator.

Generate exactly {num_questions} multiple-choice questions for the following video segment.
Difficulty: {difficulty} ({diff_desc})
{lang_note}

Segment: {segment_title}
Main Topic: {main_topic}
Subtopics:
{subtopics_text}

RULES:
1. Each question must have exactly 4 choices labeled a, b, c, d.
2. Only ONE choice is correct.
3. correct_answer must be exactly one of: "a", "b", "c", "d"
4. correct_answer_text must be the full text of the correct choice.
5. explanation: one sentence explaining why the answer is correct.
6. video_timestamp: estimate the second in the segment where this topic is covered.
   The segment starts at {segment_start_time} seconds. Use values within the segment range.
7. Return ONLY a valid JSON array, no markdown, no extra text.

Format:
[
  {{
    "question_text": "...",
    "choice_a": "...",
    "choice_b": "...",
    "choice_c": "...",
    "choice_d": "...",
    "correct_answer": "a",
    "correct_answer_text": "...",
    "explanation": "...",
    "video_timestamp": {segment_start_time}
  }}
]"""


def _build_video_prompt(
    video_title: str,
    segments: list[dict],
    difficulty: str,
    language: str,
    questions_per_segment: int,
) -> str:
    lang_note = (
        "Write all text in Arabic only."
        if language == "ar"
        else "Write all text in English only."
    )
    diff_desc = DIFFICULTY_CONFIGS[difficulty]["description"]

    segments_text = ""
    for seg in segments:
        segments_text += (
            f"\nSegment {seg['segment_number']} (starts at {seg['start_time']}s): "
            f"{seg['title']} — {seg['main_topic']}\n"
        )
        for st in seg.get("subtopics", []):
            segments_text += f"  • {st['name']}\n"

    return f"""You are an expert educational quiz creator.

Generate a comprehensive quiz covering ALL segments of the video below.
Generate {questions_per_segment} question(s) per segment.
Difficulty: {difficulty} ({diff_desc})
{lang_note}

Video: {video_title}
{segments_text}

RULES:
1. Each question must have exactly 4 choices labeled a, b, c, d.
2. Only ONE choice is correct.
3. correct_answer must be exactly one of: "a", "b", "c", "d"
4. correct_answer_text must be the full text of the correct choice.
5. explanation: one sentence explaining why the answer is correct.
6. video_timestamp: the second in the video where this topic is covered (use segment start_time).
7. segment_number: which segment (1, 2, 3…) this question belongs to.
8. Return ONLY a valid JSON array, no markdown, no extra text.

Format:
[
  {{
    "segment_number": 1,
    "question_text": "...",
    "choice_a": "...",
    "choice_b": "...",
    "choice_c": "...",
    "choice_d": "...",
    "correct_answer": "a",
    "correct_answer_text": "...",
    "explanation": "...",
    "video_timestamp": 0
  }}
]"""


def _fallback_extract(raw: str) -> list:
    try:
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        logger.error(f"[QuizEngine] Fallback extraction failed: {e}")
    return []


def _parse_and_validate(raw: str, expected_keys: list[str]) -> list[dict]:
    try:
        cleaned = _clean_json(raw)
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("[QuizEngine] Direct JSON parse failed, trying fallback")
        data = _fallback_extract(raw)

    if not isinstance(data, list):
        logger.error(f"[QuizEngine] Expected list, got {type(data)}")
        return []

    validated = []
    for item in data:
        if not isinstance(item, dict):
            continue
        missing = [k for k in expected_keys if not item.get(k)]
        if missing:
            logger.warning(f"[QuizEngine] Skipping question missing keys: {missing}")
            continue
        # Normalise correct_answer to lowercase single letter
        ca = str(item.get("correct_answer", "")).strip().lower()
        if ca not in ("a", "b", "c", "d"):
            logger.warning(f"[QuizEngine] Invalid correct_answer '{ca}', skipping")
            continue
        item["correct_answer"] = ca
        validated.append(item)

    return validated


def _call_groq_with_retry(client: Groq, prompt: str, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2500,
                temperature=0.4,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            err = str(e).lower()
            if "rate_limit" in err or "429" in err:
                wait = 30 * (attempt + 1)
                logger.warning(f"[QuizEngine] Rate limited, waiting {wait}s (attempt {attempt+1})")
                time.sleep(wait)
            else:
                logger.error(f"[QuizEngine] Groq error attempt {attempt+1}: {e}")
                if attempt == max_retries - 1:
                    raise
    return ""


# ─── PUBLIC API ───────────────────────────────────────────────────────────────

REQUIRED_KEYS = [
    "question_text", "choice_a", "choice_b", "choice_c", "choice_d",
    "correct_answer", "correct_answer_text",
]


def generate_segment_quiz(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    difficulty: str,
    language: str,
    segment_start_time: int,
) -> list[dict]:
    """
    Generates MCQ questions for a single segment.
    Returns a list of validated question dicts.
    No caching — always fresh.
    """
    num_q = DIFFICULTY_CONFIGS.get(difficulty, DIFFICULTY_CONFIGS["medium"])["num_questions"]

    prompt = _build_segment_prompt(
        segment_title=segment_title,
        main_topic=main_topic,
        subtopics=subtopics,
        difficulty=difficulty,
        language=language,
        segment_start_time=segment_start_time,
        num_questions=num_q,
    )

    logger.info(
        f"[QuizEngine] Generating segment quiz | title='{segment_title}' | "
        f"difficulty={difficulty} | lang={language} | target_questions={num_q}"
    )

    client = _get_client()
    raw = _call_groq_with_retry(client, prompt)

    if not raw:
        logger.error("[QuizEngine] Empty response from Groq")
        return []

    questions = _parse_and_validate(raw, REQUIRED_KEYS)
    logger.info(f"[QuizEngine] Got {len(questions)} valid questions for segment '{segment_title}'")
    return questions


def generate_video_quiz(
    video_title: str,
    segments: list[dict],
    difficulty: str,
    language: str,
) -> list[dict]:
    """
    Generates MCQ questions covering ALL segments of a video.
    Each question carries a segment_number so we can link it back.
    No caching — always fresh.

    For long videos (>5 segments) we split into chunks and merge.
    """
    questions_per_segment = 2 if difficulty == "easy" else 3 if difficulty == "medium" else 4

    # Split into chunks of 4 segments to avoid token limits
    CHUNK_SIZE = 4
    all_questions: list[dict] = []
    client = _get_client()

    seg_chunks = [segments[i:i + CHUNK_SIZE] for i in range(0, len(segments), CHUNK_SIZE)]
    logger.info(
        f"[QuizEngine] Video quiz | title='{video_title}' | segments={len(segments)} | "
        f"chunks={len(seg_chunks)} | difficulty={difficulty} | lang={language}"
    )

    for chunk_idx, chunk in enumerate(seg_chunks):
        prompt = _build_video_prompt(
            video_title=video_title,
            segments=chunk,
            difficulty=difficulty,
            language=language,
            questions_per_segment=questions_per_segment,
        )

        logger.info(f"[QuizEngine] Processing chunk {chunk_idx + 1}/{len(seg_chunks)}")
        raw = _call_groq_with_retry(client, prompt)

        if not raw:
            logger.warning(f"[QuizEngine] Empty response for chunk {chunk_idx + 1}")
            continue

        chunk_questions = _parse_and_validate(raw, REQUIRED_KEYS + ["segment_number"])
        all_questions.extend(chunk_questions)

        # Rate-limit pause between chunks
        if chunk_idx < len(seg_chunks) - 1:
            time.sleep(3)

    logger.info(f"[QuizEngine] Total questions generated for video: {len(all_questions)}")
    return all_questions