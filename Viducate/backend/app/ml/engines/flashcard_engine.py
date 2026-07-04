import json
import logging
import re
import time
from groq import Groq
from app.config import settings
from app.utils.text_sanitizer import sanitize_dict, strip_cjk
from app.services.network_errors import with_network_retry, NetworkUnavailableError

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"

CONTENT_FILTER = """
CRITICAL: Create flashcards ONLY for educational subject matter — terms, definitions, mechanisms, rules, or comparisons that belong to the topic itself.

Do NOT create flashcards about ANY of the following:

  INTRO content:
  - Greetings and opening salutations (e.g. "السلام عليكم", "hello everyone", "welcome back")
  - Course or lesson introductions (e.g. "today we will cover...", "in this lesson we will learn...")
  - Recaps of previous lessons (e.g. "last time we covered...", "we already studied this in level 1")
  - Motivational or religious opening remarks unrelated to the subject
  - Course announcements, broadcast schedules, or contact info

  OUTRO content:
  - Farewells, sign-offs, or closing blessings (e.g. "بارك الله فيكم", "see you next time", "والسلام عليكم")
  - Teasers for the next lesson (e.g. "next time we will explain...", "in the next video...")
  - Calls to action (subscribe, like, share, follow)
  - Homework reminders or administrative notices
  - Encouragement or motivational closing remarks unrelated to the subject

A flashcard is valid ONLY if the question and answer are self-contained educational facts a student can study independently of the video framing.
"""

def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def _build_prompt(
    segment_title: str,
    main_topic: str,
    subtopic_names: list[str],
    language: str,
    num_cards: int,
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
        "  ✓ Q: 'ما هو Time Complexity لـ Linear Search؟'  A: 'O(n)'\n"
        "  ✓ Q: 'ما هي ميزة Binary Search؟'  A: 'أسرع من Linear Search — Time Complexity هي O(log n)'\n"
        "WRONG examples (never do this):\n"
        "  ✗ 'البحث الخطي'    → should be 'Linear Search'\n"
        "  ✗ 'البحث الثنائي'  → should be 'Binary Search'\n"
        "  ✗ 'تعقيد الوقت'   → should be 'Time Complexity'\n"
        "  ✗ 'تعقيد المكان'   → should be 'Space Complexity'\n"
        if language == "ar"
        else "Write all questions and answers in English only."
    )
   

    topics_line = ", ".join(subtopic_names) if subtopic_names else main_topic

    return (
        f"Create {num_cards} educational flashcards for a video segment.\n"
        f"Topic: {segment_title}\n"
        f"Key concepts: {topics_line}\n"
        f"{lang_note}\n\n"
        f"{CONTENT_FILTER}\n\n"
        f"RULES:\n"
        f"1. Each flashcard must test understanding of a real educational concept.\n"
        f"2. Answers must be concise and factual.\n"
        f"3. Do NOT include explanations, just question and answer.\n\n"
        f"Return ONLY a JSON array, no extra text:\n"
        f'[{{"question":"...","answer":"...","difficulty":"easy|medium|hard"}}]'
    )


def generate_flashcards_for_segment(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    language: str = "en",
    num_cards: int = 5,
) -> list[dict]:
    
   
    subtopic_names = [st["name"] for st in subtopics if st.get("name")]

    prompt = _build_prompt(segment_title, main_topic, subtopic_names, language, num_cards)

    logger.info(
        f"[FlashcardEngine] Calling Groq | segment='{segment_title}' | "
        f"lang={language} | subtopics={len(subtopic_names)}"
    )
    logger.debug(f"[FlashcardEngine] Prompt ({len(prompt)} chars):\n{prompt}")

    client = _get_client()
    raw = ""

    for attempt in range(3):
        try:
            response = with_network_retry(
                lambda: client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=600,
                    temperature=0.3,
                ),
                context="FlashcardEngine Groq call"
            )
            raw = response.choices[0].message.content or ""
            logger.debug(f"[FlashcardEngine] Raw response: {raw[:500]}")
            break 
        
        except NetworkUnavailableError:
            raise
        
        except Exception as e:
            err_str = str(e).lower()
            if "rate_limit" in err_str or "429" in err_str or "quota" in err_str:
                wait = 30 * (attempt + 1)   # 30s, 60s, 90s
                logger.warning(
                    f"[FlashcardEngine] Rate limited (attempt {attempt+1}/3). "
                    f"Waiting {wait}s..."
                )
                time.sleep(wait)
            else:
                logger.error(f"[FlashcardEngine] Groq error (attempt {attempt+1}/3): {e}")
                if attempt == 2:
                    return []

    if not raw:
        logger.error("[FlashcardEngine] Empty response after all retries")
        return []

    #  Parse JSON 
    try:
        cleaned = _clean_json(raw)
        cards = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"[FlashcardEngine] Direct JSON parse failed: {e}. Trying fallback.")
        cards = _fallback_extract(raw)

    if not isinstance(cards, list):
        logger.error(f"[FlashcardEngine] Expected list, got {type(cards)}. raw={raw[:300]}")
        return []

    #  Validate each card 
    validated = []
    for card in cards:
        if not isinstance(card, dict):
            continue
        q = str(card.get("question", "")).strip()
        a = str(card.get("answer", "")).strip()
        d = str(card.get("difficulty", "medium")).strip().lower()

        if not q or not a:
            continue
        if d not in ("easy", "medium", "hard"):
            d = "medium"

        validated.append({
            "question": strip_cjk(q),
            "answer":   strip_cjk(a),
            "difficulty": d
        })

    logger.info(
        f"[FlashcardEngine] Done | segment='{segment_title}' | "
        f"cards_generated={len(validated)}"
    )
    return validated


def _fallback_extract(raw: str) -> list:
    """Last-resort: find a JSON array anywhere in the response text."""
    try:
        match = re.search(r'\[.*?\]', raw, re.DOTALL)
        if match:
            result = json.loads(match.group())
            logger.info(f"[FlashcardEngine] Fallback extracted {len(result)} items")
            return result
    except Exception as e:
        logger.error(f"[FlashcardEngine] Fallback extraction failed: {e}")
    return []