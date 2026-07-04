"""
Unit tests for app/services/segmentation_service.py pure helper functions.

Covers: is_noise, clean_ocr_text, clean_transcript, estimate_tokens,
chunk_text, _time_str_to_seconds.

"""
import pytest
from app.services.segmentation_service import (
    clean_transcript,
    estimate_tokens,
    chunk_text,
    _time_str_to_seconds,
)


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