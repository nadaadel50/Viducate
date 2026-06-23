"""
Unit tests for app/ml/engines/mindmap_engine.py pure functions.

Covers: _split_transcript_vs_slides, _detect_language, _truncate, _parse,
_is_valid, _build_fallback.

"""
import pytest
from app.ml.engines.mindmap_engine import (
    _split_transcript_vs_slides,
    _detect_language,
    _truncate,
    _parse,
    _is_valid,
    _build_fallback,
    DETAIL_WORDS,
)


class TestSplitTranscriptVsSlides:
    def test_arabic_part_goes_to_transcript(self):
        transcript, slides = _split_transcript_vs_slides("هذا شرح بسيط")
        assert transcript == "هذا شرح بسيط"
        assert slides == ""

    def test_english_part_goes_to_slides(self):
        transcript, slides = _split_transcript_vs_slides("Binary search algorithm")
        assert slides == "Binary search algorithm"
        assert transcript == ""

    def test_pipe_separated_mixed_content_splits_correctly(self):
        transcript, slides = _split_transcript_vs_slides(
            "هذا شرح للخوارزمية | Binary Search | يعمل في وقت لوغاريتمي"
        )
        assert "Binary Search" in slides
        assert "هذا شرح للخوارزمية" in transcript
        assert "يعمل في وقت لوغاريتمي" in transcript

    def test_empty_string_returns_empty_both(self):
        transcript, slides = _split_transcript_vs_slides("")
        assert transcript == ""
        assert slides == ""

    def test_whitespace_only_parts_are_skipped(self):
        transcript, slides = _split_transcript_vs_slides("text here |    | more text")
        assert transcript.strip() != "" or slides.strip() != ""


class TestDetectLanguage:
    def test_no_segments_returns_english(self):
        assert _detect_language([]) == "en"

    def test_pure_english_segment_returns_english(self):
        segments = [{
            "main_topic": "Sorting algorithms",
            "title": "Quick sort",
            "key_points": ["Divide and conquer", "Average case O(n log n)"],
            "sub_topics": [{"name": "Partitioning", "description": "Splits the array around a pivot"}],
        }]
        assert _detect_language(segments) == "en"

    def test_pure_arabic_segment_returns_arabic(self):
        segments = [{
            "main_topic": "خوارزميات الترتيب",
            "title": "الترتيب السريع",
            "key_points": ["فرق تسد", "متوسط الحالة"],
            "sub_topics": [{"name": "التقسيم", "description": "تقسيم المصفوفة حول محور"}],
        }]
        assert _detect_language(segments) == "ar"

    def test_arabic_transcript_with_heavy_english_slides_returns_mixed(self):
        long_english_slide_text = " ".join(["term"] * 60)
        segments = [{
            "main_topic": "هذا موضوع باللغة العربية مهم جدا للشرح",
            "title": "عنوان طويل باللغة العربية لشرح الموضوع",
            "key_points": [],
            "sub_topics": [{
                "name": "subtopic",
                "description": f"هذا شرح طويل باللغة العربية لكي يتجاوز الكمية المطلوبة من النص العربي في القسم | {long_english_slide_text}",
            }],
        }]
        result = _detect_language(segments)
        assert result == "mixed"

    def test_zero_total_transcript_chars_defaults_to_english(self):
        segments = [{"main_topic": "123", "title": "456", "key_points": [], "sub_topics": []}]
        assert _detect_language(segments) == "en"


class TestTruncate:
    def test_text_within_limit_unchanged(self):
        assert _truncate("short phrase", 10) == "short phrase"

    def test_text_over_limit_truncated_with_ellipsis(self):
        text = " ".join(["word"] * 20)
        result = _truncate(text, 5)
        assert result.endswith("…")
        assert len(result.split()) == 5

    def test_exact_word_count_unchanged(self):
        text = " ".join(["word"] * DETAIL_WORDS)
        assert _truncate(text, DETAIL_WORDS) == text


class TestParse:
    def test_parses_clean_json(self):
        raw = '{"nodes": [], "edges": []}'
        result = _parse(raw)
        assert result == {"nodes": [], "edges": []}

    def test_strips_markdown_json_fence(self):
        raw = '```json\n{"nodes": [], "edges": []}\n```'
        result = _parse(raw)
        assert result == {"nodes": [], "edges": []}

    def test_strips_plain_markdown_fence(self):
        raw = '```\n{"nodes": [], "edges": []}\n```'
        result = _parse(raw)
        assert result == {"nodes": [], "edges": []}

    def test_extracts_json_object_embedded_in_text(self):
        raw = 'Here is the result: {"nodes": [{"id": "root"}], "edges": []} Hope that helps!'
        result = _parse(raw)
        assert result is not None
        assert result["nodes"][0]["id"] == "root"

    def test_completely_invalid_input_returns_none(self):
        assert _parse("this is not json at all") is None

    def test_empty_string_returns_none(self):
        assert _parse("") is None


class TestIsValid:
    def test_valid_structure_passes(self):
        data = {
            "nodes": [{"id": "root", "label": "Video"}],
            "edges": [{"id": "e1", "source": "root", "target": "seg_1"}],
        }
        assert _is_valid(data) is True

    def test_non_dict_input_fails(self):
        assert _is_valid(["not", "a", "dict"]) is False
        assert _is_valid(None) is False

    def test_missing_nodes_key_fails(self):
        assert _is_valid({"edges": []}) is False

    def test_nodes_not_a_list_fails(self):
        assert _is_valid({"nodes": "not a list", "edges": []}) is False

    def test_node_missing_id_fails(self):
        data = {"nodes": [{"label": "no id here"}], "edges": []}
        assert _is_valid(data) is False

    def test_node_missing_label_fails(self):
        data = {"nodes": [{"id": "root"}], "edges": []}
        assert _is_valid(data) is False

    def test_edge_missing_source_fails(self):
        data = {"nodes": [{"id": "root", "label": "x"}], "edges": [{"id": "e1", "target": "y"}]}
        assert _is_valid(data) is False

    def test_empty_nodes_and_edges_passes(self):
        assert _is_valid({"nodes": [], "edges": []}) is True
