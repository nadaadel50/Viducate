import re
import math

WORDS_PER_MINUTE = 120  # conservative for educational / bilingual content

def _extract_text_from_value(value) -> str:
    if isinstance(value, str):
        return value + " "
    if isinstance(value, list):
        return "".join(_extract_text_from_value(v) for v in value)
    if isinstance(value, dict):
        return "".join(_extract_text_from_value(v) for v in value.values())
    return ""


def _count_words(text: str) -> int:
    return len(re.findall(r"\S+", text))


def calculate_reading_time(content) -> dict:
    if not content:
        return {"words": 0, "minutes": 0, "label": "< 1 min read"}

    raw_text = _extract_text_from_value(content)
    word_count = _count_words(raw_text)
    minutes = max(1, math.ceil(word_count / WORDS_PER_MINUTE))
    label = f"{minutes} min read"

    return {"words": word_count, "minutes": minutes, "label": label}