import logging
import numpy as np
from typing import Optional
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# ── Lazy model reference (same instance as embedding_service) ────────────────
_model = None

def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('intfloat/multilingual-e5-base')
    return _model

THRESHOLDS = {
    "segmentation": 0.32,   # segment title+topic vs merged transcript text
    "summary":      0.30,   # summary conclusion vs segment title+topic
    "studynotes":   0.28,   # study notes intro vs segment title+topic
    "flashcard":    0.25,   # flashcard questions vs segment title+topic
    "mindmap":      0.28,   # mindmap node labels vs segment title+topic
    "quiz":         0.27,   # quiz questions vs segment title+topic
}

MAX_RETRIES = 2             # maximum regeneration attempts per content piece


# ── Embedding helpers ─────────────────────────────────────────────────────────
def _embed(text: str, is_query: bool = False) -> np.ndarray:
    prefix = "query: " if is_query else "passage: "
    return _get_model().encode(
        prefix + text[:2000],   # cap to avoid OOM on very long texts
        normalize_embeddings=True,
    )


def _cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two L2-normalised vectors."""
    return float(np.dot(a, b))


# ── Public API ────────────────────────────────────────────────────────────────

def score_against_source(
    generated_text: str,
    source_text: str,
    content_type: str,
) -> dict:
    if not generated_text or not generated_text.strip():
        logger.warning(f"[QualityService] [{content_type}] Empty generated_text — score=0")
        return {"score": 0.0, "flag": True, "threshold": THRESHOLDS[content_type]}

    if not source_text or not source_text.strip():
        logger.warning(f"[QualityService] [{content_type}] No source_text — skipping check")
        return {"score": 1.0, "flag": False, "threshold": THRESHOLDS[content_type]}

    try:
        logger.info(
            f"[QualityService] [{content_type}] scoring | "
            f"generated_len={len(generated_text)} | source_len={len(source_text)}"
        )
        logger.debug(f"[QualityService] [{content_type}] generated_text[:200]: {generated_text[:200]}")
        logger.debug(f"[QualityService] [{content_type}] source_text[:200]: {source_text[:200]}")

        gen_emb = _embed(generated_text, is_query=True)
        src_emb = _embed(source_text,    is_query=False)
        score   = round(_cosine_sim(gen_emb, src_emb), 4)
        threshold = THRESHOLDS.get(content_type, 0.28)
        flag      = score < threshold

        logger.info(
            f"[QualityService] [{content_type}] "
            f"score={score:.4f} | threshold={threshold} | "
            f"{'FLAGGED' if flag else 'PASSED'}"
        )
        return {"score": score, "flag": flag, "threshold": threshold}

    except Exception as e:
        logger.error(f"[QualityService] [{content_type}] scoring FAILED: {e}")
        return {"score": 1.0, "flag": False, "threshold": THRESHOLDS[content_type]}

# ── Mode 1: Segmentation vs merged text ──────────────────────────────────────

def extract_source_text_for_segment(
    merged: list[dict],
    start_time_seconds: int,
    end_time_seconds: int,
) -> str:
    """
    Extracts merged transcript+OCR text that falls within a segment's
    time range. Uses the same `merged` list from merge_transcript_ocr().
    """
    parts = []
    for entry in merged:
        t = entry.get("time", 0)
        if start_time_seconds <= t <= end_time_seconds:
            text = (
                entry.get("combined_text") or
                entry.get("transcript_text") or
                entry.get("ocr_text") or ""
            )
            if text and text.strip():
                parts.append(text.strip())
    return " ".join(parts)


def score_segmentation(
    segment_title: str,
    segment_main_topic: str,
    source_text: str,
) -> dict:
    """
    Mode 1: Score segment quality vs merged transcript+OCR text.
    Called during processing pipeline for NEW (non-cached) videos.
    """
    generated = f"{segment_title}. {segment_main_topic}"
    return score_against_source(generated, source_text, "segmentation")


# ── Mode 2: Feature output vs segmentation ───────────────────────────────────

def build_segment_reference_text(segment) -> str:
    """
    Builds a reference string from a TopicSegment ORM object.
    Includes title, main_topic, and all subtopic names.
    Works for both new and cached videos because segmentation is
    always persisted in the DB before any feature is generated.
    """
    parts = [segment.title or "", segment.main_topic or ""]
    for st in getattr(segment, 'subtopics', []):
        if st.name:
            parts.append(st.name)
    return " | ".join(p for p in parts if p.strip())


def score_feature_vs_segmentation(
    feature_text: str,
    segment,            # TopicSegment ORM object (already loaded with subtopics)
    content_type: str,
) -> dict:
    """
    Mode 2: Score a generated feature against the stored segmentation.
    Used for Summary, Study Notes, Flashcards, Mindmap, Quiz.
    Called after generation, before saving to DB.

    Args:
        feature_text: Representative text extracted from the generated feature.
        segment:      TopicSegment ORM object (joined with subtopics).
        content_type: One of summary/studynotes/flashcard/mindmap/quiz.
    """
    reference = build_segment_reference_text(segment)
    return score_against_source(feature_text, reference, content_type)


# ── Text extractors for each feature type ────────────────────────────────────

def extract_text_from_summary(content: dict) -> str:
    """Extract scoreable text from a summary JSON dict."""
    if not isinstance(content, dict):
        return str(content)[:500]
    parts = []
    conclusion = content.get("conclusion", "")
    if conclusion:
        parts.append(conclusion)
    for section in content.get("sections", [])[:2]:
        heading = section.get("heading", "")
        if heading:
            parts.append(heading)
    for t in content.get("takeaways", [])[:3]:
        if t:
            parts.append(t)
    return " ".join(parts)[:1500]


def extract_text_from_studynotes(content: dict) -> str:
    """Extract scoreable text from a study notes JSON dict."""
    if not isinstance(content, dict):
        return str(content)[:500]
    parts = []
    intro = content.get("introduction", "")
    if intro:
        parts.append(intro)
    for section in content.get("sections", [])[:2]:
        heading = section.get("heading", "")
        if heading:
            parts.append(heading)
        for defn in section.get("definitions", [])[:3]:
            if isinstance(defn, dict):
                parts.append(defn.get("term", ""))
    return " ".join(parts)[:1500]


def extract_text_from_flashcards(cards: list) -> str:
    """Extract scoreable text from a flashcard list."""
    if not isinstance(cards, list):
        return ""
    parts = [
        c.get("question", "") + " " + c.get("answer", "")
        for c in cards[:5]
        if isinstance(c, dict)
    ]
    return " ".join(parts)[:1500]


def extract_text_from_mindmap(result: dict) -> str:
    """Extract scoreable text from a mindmap result dict."""
    if not isinstance(result, dict):
        return ""
    nodes = result.get("nodes", [])
    labels = [
        n.get("label", "")
        for n in nodes
        if isinstance(n, dict) and n.get("type") in ("segment", "subtopic")
    ]
    return " | ".join(labels[:20])


def extract_text_from_quiz(questions: list) -> str:
    """Extract scoreable text from quiz question list."""
    if not isinstance(questions, list):
        return ""
    parts = [
        q.get("question_text", "")
        for q in questions[:5]
        if isinstance(q, dict)
    ]
    return " ".join(parts)[:1500]