"""
Unit tests for app/utils/reading_time.py
"""

import pytest
from app.utils.reading_time import (
    calculate_reading_time,
    _extract_text_from_value,
    _count_words,
)

class TestExtractTextFromValue:
    def test_string_value_returns_with_trailing_space(self):
        assert _extract_text_from_value("hello") == "hello "

    def test_list_of_strings_concatenates(self):
        result = _extract_text_from_value(["one", "two", "three"])
        assert result == "one two three "

    def test_dict_extracts_all_values(self):
        result = _extract_text_from_value({"a": "first", "b": "second"})
        assert "first " in result
        assert "second " in result

    def test_nested_structure_extracts_everything(self):
        content = {
            "takeaways": ["point one", "point two"],
            "sections": [{"heading": "Intro", "content": [{"text": "body text"}]}],
        }
        result = _extract_text_from_value(content)
        assert "point one" in result
        assert "Intro" in result
        assert "body text" in result

    def test_non_string_non_list_non_dict_returns_empty(self):
        assert _extract_text_from_value(42) == ""
        assert _extract_text_from_value(None) == ""

    def test_empty_dict_returns_empty_string(self):
        assert _extract_text_from_value({}) == ""

    def test_empty_list_returns_empty_string(self):
        assert _extract_text_from_value([]) == ""


class TestCountWords:
    def test_counts_simple_sentence(self):
        assert _count_words("the quick brown fox") == 4

    def test_empty_string_is_zero_words(self):
        assert _count_words("") == 0

    def test_multiple_spaces_do_not_inflate_count(self):
        assert _count_words("word1     word2") == 2

    def test_newlines_are_treated_as_whitespace(self):
        assert _count_words("line one\nline two") == 4

    def test_arabic_text_counts_words_correctly(self):
        assert _count_words("هذا اختبار للنص العربي") == 4


class TestCalculateReadingTime:
    def test_none_content_returns_zero_words_label(self):
        result = calculate_reading_time(None)
        assert result == {"words": 0, "minutes": 0, "label": "< 1 min read"}

    def test_empty_dict_returns_zero_words_label(self):
        result = calculate_reading_time({})
        assert result["words"] == 0
        assert result["label"] == "< 1 min read"

    def test_short_content_rounds_up_to_one_minute(self):
        # WORDS_PER_MINUTE = 120
        content = {"conclusion": " ".join(["word"] * 10)}
        result = calculate_reading_time(content)
        assert result["minutes"] == 1
        assert result["label"] == "1 min read"

    def test_exactly_120_words_is_one_minute(self):
        content = {"conclusion": " ".join(["word"] * 120)}
        result = calculate_reading_time(content)
        assert result["words"] == 120
        assert result["minutes"] == 1

    def test_121_words_rounds_up_to_two_minutes(self):
        content = {"conclusion": " ".join(["word"] * 121)}
        result = calculate_reading_time(content)
        assert result["minutes"] == 2

    def test_label_format_matches_minutes(self):
        content = {"conclusion": " ".join(["word"] * 500)}
        result = calculate_reading_time(content)
        assert result["label"] == f"{result['minutes']} min read"

    def test_word_count_reflects_all_nested_text(self):
        content = {
            "takeaways": ["alpha beta", "gamma delta"],
            "sections": [{"heading": "epsilon", "content": [{"text": "zeta eta theta"}]}],
        }
        result = calculate_reading_time(content)
        assert result["words"] == 8