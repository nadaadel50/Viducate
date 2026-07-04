import json
import logging
import re
import time
from groq import Groq
from app.config import settings
from app.utils.text_sanitizer import sanitize_dict, strip_cjk
from app.services.network_errors import NetworkUnavailableError, with_network_retry

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"

DIFFICULTY_CONFIGS = {
    "easy":   {"description": "basic recall and definition questions",   "subtopics_multiplier": 1.0},
    "medium": {"description": "understanding and application questions", "subtopics_multiplier": 1.5},
    "hard":   {"description": "analysis, evaluation, and synthesis questions", "subtopics_multiplier": 2.0},
}

CONTENT_FILTER = """
CRITICAL: Test ONLY educational subject matter — concepts, definitions, mechanisms, comparisons, and applications that belong to the topic itself.

Do NOT generate questions about ANY of the following, regardless of how much transcript space they occupy:

  INTRO content:
  - Greetings and opening salutations (e.g. "السلام عليكم", "hello everyone", "welcome back")
  - Course or lesson introductions (e.g. "today we will cover...", "in this lesson we will learn...")
  - Recaps of previous lessons (e.g. "last time we covered...", "we already studied this in level 1")
  - Motivational or religious opening remarks unrelated to the subject
  - Course announcements, broadcast schedules, or contact info (e.g. "the course airs daily at 7pm", "WhatsApp number")

  OUTRO content:
  - Farewells, sign-offs, or closing blessings (e.g. "بارك الله فيكم", "see you next time", "والسلام عليكم")
  - Teasers for the next lesson (e.g. "next time we will explain...", "in the next video...")
  - Calls to action (subscribe, like, share, follow)
  - Homework reminders or administrative notices
  - Encouragement or motivational closing remarks unrelated to the subject

A question is valid ONLY if a student who never watched the intro or outro could still answer it from the subject content alone.
"""

SEGMENT_MIN_QUESTIONS = 3
SEGMENT_MAX_QUESTIONS = 10
VIDEO_MAX_QUESTIONS   = 30


def _calc_segment_questions(num_subtopics: int, duration_seconds: int, difficulty: str) -> int:
    """
    Dynamically calculates how many questions to generate for a segment.
    Base: 1 question per subtopic, scaled by difficulty multiplier.
    Also adds 1 question per every 2 minutes of content.
    Clamped between SEGMENT_MIN_QUESTIONS and SEGMENT_MAX_QUESTIONS.
    """
    multiplier  = DIFFICULTY_CONFIGS[difficulty]["subtopics_multiplier"]
    base        = round(num_subtopics * multiplier)
    time_bonus  = duration_seconds // 120          # +1 per 2 minutes
    total       = base + time_bonus
    return max(SEGMENT_MIN_QUESTIONS, min(SEGMENT_MAX_QUESTIONS, total))


def _calc_video_questions(segments: list[dict], difficulty: str) -> int:
 
    total = 0
    for seg in segments:
        num_subtopics   = len(seg.get("subtopics", []))
        duration        = seg.get("end_time", 0) - seg.get("start_time", 0)
        total          += _calc_segment_questions(num_subtopics, duration, difficulty)
    return min(VIDEO_MAX_QUESTIONS, total)



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
        "OUTPUT LANGUAGE: Arabic only for prose and explanations.\n"
        "STRICT PROHIBITION: Do NOT output any Chinese, Japanese, Korean, or other CJK characters.\n\n"
        "TECHNICAL TERMS RULE — the following categories of terms MUST remain in English exactly as-is, "
        "never translated or transliterated into Arabic:\n"
        "  - Algorithm names: Linear Search, Binary Search, Bubble Sort, Merge Sort, Quick Sort, etc.\n"
        "  - Data structures: Array, Stack, Queue, Linked List, Tree, Graph, Heap, Hash Table, etc.\n"
        "  - Complexity notation: Big O, O(n), O(log n), O(1), O(n^2), Time Complexity, Space Complexity\n"
        "  - Programming concepts: Loop, Recursion, Pointer, Variable, Function, Class, Object, etc.\n"
        "  - CS concepts: Binary, Index, Node, Edge, Path, Depth, Height, etc.\n"
        "  - Any term that appears in English in the original video content\n\n"
        "CORRECT examples:\n"
        "  ✓ 'ما هو تعريف Time Complexity؟'\n"
        "  ✓ 'ما هي ميزة Linear Search؟'\n"
        "  ✓ 'ما الفرق بين Linear Search و Binary Search؟'\n"
        "  ✓ 'ما هو تعقيد Big O لـ Binary Search؟'\n"
        "WRONG examples (never do this):\n"
        "  ✗ 'ما هو تعريف تعقيد الوقت؟'  → should be 'Time Complexity'\n"
        "  ✗ 'ما هي ميزة البحث الخطي؟'   → should be 'Linear Search'\n"
        "  ✗ 'ما هو البحث الثنائي؟'       → should be 'Binary Search'\n"
        "  ✗ 'تعقيد الوقت O(n)'           → should be 'Time Complexity O(n)'\n"
        if language == "ar"
        else "OUTPUT LANGUAGE: English only. No Arabic, no CJK characters."
    )
    # lang_note = (
    #     "Write all text in Arabic only."
    #     if language == "ar"
    #     else "Write all text in English only."
    # )

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
{CONTENT_FILTER}
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
7. concept: a short concept or skill being tested
   (e.g. "Gradient Descent", "Binary Search", "Photosynthesis").
8. Return ONLY a valid JSON array, no markdown, no extra text.


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
    "video_timestamp": {segment_start_time},
    "concept": "Name of the main concept tested by this question"
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
        "OUTPUT LANGUAGE: Arabic only for prose and explanations.\n"
        "STRICT PROHIBITION: Do NOT output any Chinese, Japanese, Korean, or other CJK characters.\n\n"
        "TECHNICAL TERMS RULE — the following categories of terms MUST remain in English exactly as-is, "
        "never translated or transliterated into Arabic:\n"
        "  - Algorithm names: Linear Search, Binary Search, Bubble Sort, Merge Sort, Quick Sort, etc.\n"
        "  - Data structures: Array, Stack, Queue, Linked List, Tree, Graph, Heap, Hash Table, etc.\n"
        "  - Complexity notation: Big O, O(n), O(log n), O(1), O(n^2), Time Complexity, Space Complexity\n"
        "  - Programming concepts: Loop, Recursion, Pointer, Variable, Function, Class, Object, etc.\n"
        "  - CS concepts: Binary, Index, Node, Edge, Path, Depth, Height, etc.\n"
        "  - Any term that appears in English in the original video content\n\n"
        "CORRECT examples:\n"
        "  ✓ 'ما هو تعريف Time Complexity؟'\n"
        "  ✓ 'ما هي ميزة Linear Search؟'\n"
        "  ✓ 'ما الفرق بين Linear Search و Binary Search؟'\n"
        "  ✓ 'ما هو تعقيد Big O لـ Binary Search؟'\n"
        "WRONG examples (never do this):\n"
        "  ✗ 'ما هو تعريف تعقيد الوقت؟'  → should be 'Time Complexity'\n"
        "  ✗ 'ما هي ميزة البحث الخطي؟'   → should be 'Linear Search'\n"
        "  ✗ 'ما هو البحث الثنائي؟'       → should be 'Binary Search'\n"
        "  ✗ 'تعقيد الوقت O(n)'           → should be 'Time Complexity O(n)'\n"
        if language == "ar"
        else "OUTPUT LANGUAGE: English only. No Arabic, no CJK characters."
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
{CONTENT_FILTER}

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
8. concept: short concept or skill tested.
9. Return ONLY a valid JSON array, no markdown, no extra text.


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
    "video_timestamp": 0,
    "concept": "Name of the main concept tested by this question"
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
        # Sanitize CJK leakage from all text fields
        for field in ("question_text", "choice_a", "choice_b", "choice_c", "choice_d",
                    "correct_answer_text", "explanation", "concept"):
            if isinstance(item.get(field), str):
                item[field] = strip_cjk(item[field])
        
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
            response = with_network_retry(
                lambda: client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=2500,
                    temperature=0.4,
                ),
                context="QuizEngine Groq call",
            )
            return response.choices[0].message.content or ""
        except NetworkUnavailableError:
            raise
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



REQUIRED_KEYS = [
    "question_text", "choice_a", "choice_b", "choice_c", "choice_d",
    "correct_answer", "correct_answer_text", "concept"
]


def generate_segment_quiz(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    difficulty: str,
    language: str,
    segment_start_time: int,
    segment_end_time: int = 0,     
) -> list[dict]:
    duration = max(0, segment_end_time - segment_start_time)
    num_q    = _calc_segment_questions(len(subtopics), duration, difficulty)

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
    # enforce max limit
    questions = questions[:10]

    # enforce min quality threshold
    if len(questions) < 3:
        logger.warning(
            f"[QuizEngine] Too few valid questions ({len(questions)}) for segment '{segment_title}'"
        )
        return [] 
    

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
    total_target          = _calc_video_questions(segments, difficulty)
    questions_per_segment = max(1, total_target // max(len(segments), 1))
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
        chunk_questions = chunk_questions[:10]

        all_questions.extend(chunk_questions)

        # Rate-limit pause between chunks
        if chunk_idx < len(seg_chunks) - 1:
            time.sleep(3)

    logger.info(f"[QuizEngine] Total questions generated for video: {len(all_questions)}")
    if len(all_questions) > 30:
        logger.warning(
            f"[QuizEngine] Clamping video quiz from {len(all_questions)} to 30 questions"
        )
        all_questions = all_questions[:30]

        
    return all_questions