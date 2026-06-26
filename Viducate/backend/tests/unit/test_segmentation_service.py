"""
Unit tests for app/services/segmentation_service.py pure helper functions.

Covers: is_noise, clean_ocr_text, clean_transcript, estimate_tokens,
chunk_text, _time_str_to_seconds.

"""
import pytest
from app.services.segmentation_service import (
    is_noise,
    clean_ocr_text,
    clean_transcript,
    estimate_tokens,
    chunk_text,
    _time_str_to_seconds,
)

class TestIsNoise:
    @pytest.mark.parametrize("text", [
        "https://example.com/page",
        "visit www.example.com",
        "check out example.com",
        "see example.org for details",
    ])
    def test_urls_are_flagged_as_noise(self, text):
        assert is_noise(text) is True

    def test_high_digit_ratio_is_noise(self):
        # >30% of characters are digits
        assert is_noise("12345678") is True

    def test_single_short_word_is_noise(self):
        assert is_noise("ok") is True

    def test_repeated_character_run_is_noise(self):
        assert is_noise("aaaaaaaa") is True

    def test_normal_sentence_is_not_noise(self):
        assert is_noise("This is a normal sentence about loops") is False

    def test_normal_arabic_sentence_is_not_noise(self):
        assert is_noise("هذا شرح عن المصفوفات في البرمجة") is False

    def test_high_weird_character_ratio_is_noise(self):
        assert is_noise("@#$%^&*()!@#$") is True

    def test_single_long_word_is_not_flagged_by_short_word_rule(self):
        assert is_noise("recursion") is False

    def test_empty_string_is_not_noise(self):
        assert is_noise("") is False


class TestCleanOcrText:
    def test_none_string_literal_returns_empty(self):
        assert clean_ocr_text("None") == ""

    def test_empty_string_returns_empty(self):
        assert clean_ocr_text("") == ""

    def test_deduplicates_repeated_parts(self):
        result = clean_ocr_text("struct definition | struct definition | members")
        parts = result.split(" | ")
        assert parts.count("struct definition") == 1

    def test_filters_out_noisy_parts(self):
        result = clean_ocr_text("normal text about classes | https://example.com | ok")
        assert "https://example.com" not in result
        assert "ok" not in result
        assert "normal text about classes" in result

    def test_strips_whitespace_from_parts(self):
        result = clean_ocr_text("  struct fields  | members list  ")
        assert "  struct fields  " not in result
        assert "struct fields" in result

    def test_all_noise_parts_returns_empty_joined_string(self):
        result = clean_ocr_text("ok | hi | www.spam.com")
        assert result == ""

    def test_preserves_order_of_first_occurrence(self):
        result = clean_ocr_text("first concept here | second concept here")
        parts = result.split(" | ")
        assert parts[0] == "first concept here"
        assert parts[1] == "second concept here"


class TestCleanTranscript:
    def test_skips_consecutive_duplicate_lines(self):
        text = "Hello there\nHello there\nDifferent line"
        result = clean_transcript(text)
        lines = result.split("\n")
        assert lines.count("Hello there") == 1

    def test_keeps_non_consecutive_duplicates(self):
        text = "Hello there\nDifferent line\nHello there"
        result = clean_transcript(text)
        assert result.count("Hello there") == 2

    def test_empty_lines_are_dropped(self):
        text = "Real content\n\n   \nMore content"
        result = clean_transcript(text)
        lines = [l for l in result.split("\n") if l.strip() == ""]
        assert len(lines) == 0

    def test_empty_input_returns_empty_string(self):
        assert clean_transcript("") == ""


class TestEstimateTokens:
    def test_returns_character_length(self):
        assert estimate_tokens("hello world") == len("hello world")

    def test_empty_string_is_zero(self):
        assert estimate_tokens("") == 0

    def test_arabic_text_length(self):
        text = "مرحبا"
        assert estimate_tokens("مرحبا") == len(text)


class TestChunkText:
    def test_short_text_returns_single_chunk(self):
        text = "one two three four five"
        chunks = chunk_text(text, max_words=2500)
        assert len(chunks) == 1
        assert chunks[0] == text

    def test_splits_text_longer_than_max_words(self):
        words = ["word"] * 6000
        text = " ".join(words)
        chunks = chunk_text(text, max_words=2500)
        assert len(chunks) == 3  

    def test_chunk_word_counts_respect_max_words(self):
        words = [f"w{i}" for i in range(5000)]
        text = " ".join(words)
        chunks = chunk_text(text, max_words=2500)
        for chunk in chunks[:-1]:
            assert len(chunk.split()) == 2500

    def test_all_words_preserved_across_chunks(self):
        words = [f"w{i}" for i in range(100)]
        text = " ".join(words)
        chunks = chunk_text(text, max_words=30)
        rejoined = " ".join(chunks).split()
        assert rejoined == words

    def test_empty_text_returns_empty_list(self):
        assert chunk_text("", max_words=2500) == []


class TestTimeStrToSeconds:
    def test_hh_mm_ss_format(self):
        assert _time_str_to_seconds("01:02:03") == 3723

    def test_mm_ss_format(self):
        assert _time_str_to_seconds("02:30") == 150

    def test_plain_seconds_format(self):
        assert _time_str_to_seconds("90") == 90

    def test_zero_time(self):
        assert _time_str_to_seconds("00:00:00") == 0

    def test_empty_string_returns_zero(self):
        assert _time_str_to_seconds("") == 0

    def test_none_returns_zero(self):
        assert _time_str_to_seconds(None) == 0

    def test_malformed_string_returns_zero_not_raises(self):
        assert _time_str_to_seconds("not-a-time") == 0

    def test_integer_input_converted_via_str(self):
        assert _time_str_to_seconds(125) == 125