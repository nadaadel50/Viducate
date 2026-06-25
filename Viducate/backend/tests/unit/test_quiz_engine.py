"""
Unit tests for app/ml/engines/quiz_engine.py pure functions.

Covers: _parse_and_validate,_fallback_extract.

"""
import pytest
import json
from app.ml.engines.quiz_engine import (
    _parse_and_validate,
    _fallback_extract,
    REQUIRED_KEYS,
)


class TestParseAndValidate:
    VALID_ITEM = {
        "question_text": "What is recursion?",
        "choice_a": "A loop", "choice_b": "A function calling itself",
        "choice_c": "A variable", "choice_d": "A class",
        "correct_answer": "b", "correct_answer_text": "A function calling itself",
        "concept": "Recursion",
    }

    def test_parses_clean_json_array(self):
        raw = json.dumps([self.VALID_ITEM])
        result = _parse_and_validate(raw, REQUIRED_KEYS)
        assert len(result) == 1
        assert result[0]["question_text"] == "What is recursion?"

    def test_parses_fenced_json_array(self):
        raw = "```json\n" + json.dumps([self.VALID_ITEM]) + "\n```"
        result = _parse_and_validate(raw, REQUIRED_KEYS)
        assert len(result) == 1

    def test_invalid_correct_answer_letter_is_skipped(self):
        bad = {**self.VALID_ITEM, "correct_answer": "z"}
        raw = json.dumps([bad])
        result = _parse_and_validate(raw, REQUIRED_KEYS)
        assert len(result) == 0

    def test_correct_answer_normalized_to_lowercase(self):
        upper = {**self.VALID_ITEM, "correct_answer": "B"}
        raw = json.dumps([upper])
        result = _parse_and_validate(raw, REQUIRED_KEYS)
        assert result[0]["correct_answer"] == "b"

    def test_garbage_input_returns_empty_list(self):
        result = _parse_and_validate("not json at all, sorry", REQUIRED_KEYS)
        assert result == []



class TestFallbackExtract:
    def test_extracts_json_array_from_surrounding_text(self):
        raw = 'Here is your quiz: [{"a": 1}] enjoy!'
        result = _fallback_extract(raw)
        assert result == [{"a": 1}]

    def test_no_array_present_returns_empty_list(self):
        assert _fallback_extract("no array here at all") == []

    def test_malformed_array_returns_empty_list(self):
        assert _fallback_extract("[not valid json,,,]") == []