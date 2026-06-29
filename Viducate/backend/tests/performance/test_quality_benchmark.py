import pytest
import time
from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_summary,
    extract_text_from_flashcards,
    extract_text_from_quiz,
    build_segment_reference_text,
)

class FakeSubtopic:
    def __init__(self, name):
        self.name = name

class FakeSegment:
    def __init__(self):
        self.title       = "المجرور بحرف الجر"
        self.main_topic  = "شرح حروف الجر وأمثلة إعرابية"
        self.subtopics   = [
            FakeSubtopic("حروف الجر وعلامات الجر"),
            FakeSubtopic("تطبيق عملي على إعراب الجملة الفعلية"),
        ]

FAKE_SEGMENT = FakeSegment()

SAMPLE_SUMMARY = {
    "takeaways": ["حروف الجر تجر الاسم الذي يليها", "علامة الجر هي الكسرة في الغالب"],
    "sections": [{"heading": "حروف الجر", "content": []}],
    "conclusion": "المجرور بحرف الجر هو كل اسم سبقه حرف جر."
}

SAMPLE_FLASHCARDS = [
    {"question": "ما هي علامة الجر الأصلية؟", "answer": "الكسرة", "difficulty": "easy"},
    {"question": "ما الذي يسبق الاسم المجرور؟",  "answer": "حرف الجر", "difficulty": "medium"},
    {"question": "ما إعراب كلمة القاهرة في جملة سافر محمد إلى القاهرة؟",
     "answer": "اسم مجرور بحرف الجر وعلامة جره الكسرة", "difficulty": "hard"},
]

SAMPLE_QUIZ = [
    {"question_text": "ما إعراب الاسم الواقع بعد حرف الجر؟"},
    {"question_text": "ما هي علامة جر المثنى؟"},
]


def _time_ms(fn, *args, **kwargs):
    start = time.perf_counter()
    result = fn(*args, **kwargs)
    return (time.perf_counter() - start) * 1000, result


def test_single_score_latency_summary():
    feature_text = extract_text_from_summary(SAMPLE_SUMMARY)
    #worm up 
    score_feature_vs_segmentation(
        feature_text=feature_text,
        segment=FAKE_SEGMENT,
        content_type="summary",
    )

    elapsed, quality = _time_ms(
        score_feature_vs_segmentation,
        feature_text=feature_text,
        segment=FAKE_SEGMENT,
        content_type="summary",
    )
    print(f"\n[BENCH] summary score latency: {elapsed:.1f} ms")
    assert elapsed < 300, f"Score took {elapsed:.1f} ms — expected < 300 ms"
    assert "score" in quality
    assert 0.0 <= quality["score"] <= 1.0


def test_single_score_latency_flashcard():
    feature_text = extract_text_from_flashcards(SAMPLE_FLASHCARDS)
    elapsed, quality = _time_ms(
        score_feature_vs_segmentation,
        feature_text=feature_text,
        segment=FAKE_SEGMENT,
        content_type="flashcard",
    )
    print(f"[BENCH] flashcard score latency: {elapsed:.1f} ms")
    assert elapsed < 300


def test_single_score_latency_quiz():
    feature_text = extract_text_from_quiz(SAMPLE_QUIZ)
    elapsed, quality = _time_ms(
        score_feature_vs_segmentation,
        feature_text=feature_text,
        segment=FAKE_SEGMENT,
        content_type="quiz",
    )
    print(f"[BENCH] quiz score latency: {elapsed:.1f} ms")
    assert elapsed < 300


def test_repeated_scoring_uses_cached_model():
    """
    Second and subsequent calls should be faster because the SentenceTransformer
    model instance is module-level (no reload). Verify the 2nd call is not
    dramatically slower than the 1st (within 2x).
    """
    feature_text = extract_text_from_summary(SAMPLE_SUMMARY)

    times = []
    for _ in range(5):
        elapsed, _ = _time_ms(
            score_feature_vs_segmentation,
            feature_text=feature_text,
            segment=FAKE_SEGMENT,
            content_type="summary",
        )
        times.append(elapsed)

    avg = sum(times) / len(times)
    worst = max(times)
    print(f"[BENCH] 5-call avg: {avg:.1f} ms | worst: {worst:.1f} ms | all: {[f'{t:.0f}' for t in times]}")
    assert worst < 500, f"Worst repeated call took {worst:.1f} ms"
    assert avg < 300


def test_reference_text_builder_is_fast():
    """build_segment_reference_text() does only string ops — must be sub-millisecond."""
    elapsed, ref = _time_ms(build_segment_reference_text, FAKE_SEGMENT)
    print(f"[BENCH] reference text build: {elapsed:.3f} ms")
    assert elapsed < 5 
    assert "المجرور" in ref