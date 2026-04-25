import json
import logging
import re
import time
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"


def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)


def _clean_json(raw: str) -> str:
    """Strip markdown fences."""
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
    """
    Builds a SHORT prompt using only subtopic names (not full descriptions)
    to stay well under Groq token limits.
    """
    lang_note = (
        "Write all questions and answers in Arabic only."
        if language == "ar"
        else "Write all questions and answers in English only."
    )

    topics_line = ", ".join(subtopic_names) if subtopic_names else main_topic

    return (
        f"Create {num_cards} educational flashcards for a video segment.\n"
        f"Topic: {segment_title}\n"
        f"Key concepts: {topics_line}\n"
        f"{lang_note}\n\n"
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
    """
    Generates flashcards using Groq.
    Uses only subtopic NAMES (not descriptions) to minimize token usage.
    Retries up to 3 times on rate limit errors with backoff.
    """
    # Only names — keep prompt tiny
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
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.3,
            )
            raw = response.choices[0].message.content or ""
            logger.debug(f"[FlashcardEngine] Raw response: {raw[:500]}")
            break  # success — exit retry loop

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

    # ── Parse JSON ──────────────────────────────────────────────────────────
    try:
        cleaned = _clean_json(raw)
        cards = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"[FlashcardEngine] Direct JSON parse failed: {e}. Trying fallback.")
        cards = _fallback_extract(raw)

    if not isinstance(cards, list):
        logger.error(f"[FlashcardEngine] Expected list, got {type(cards)}. raw={raw[:300]}")
        return []

    # ── Validate each card ──────────────────────────────────────────────────
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

        validated.append({"question": q, "answer": a, "difficulty": d})

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