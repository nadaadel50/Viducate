"""
Unit tests for app/ml/engines/studynotes_engine.py pure functions.

Covers: _clean_json, _parse, _is_valid.
"""

import pytest
from app.ml.engines.studynotes_engine import _clean_json, _parse, _is_valid


class TestCleanJson:
    def test_strips_json_markdown_fence(self):
        raw = '```json\n{"a": 1}\n```'
        assert _clean_json(raw) == '{"a": 1}'

    def test_strips_plain_markdown_fence(self):
        raw = '```\n{"a": 1}\n```'
        assert _clean_json(raw) == '{"a": 1}'

    def test_leaves_clean_json_unchanged(self):
        raw = '{"a": 1}'
        assert _clean_json(raw) == '{"a": 1}'

    def test_strips_surrounding_whitespace(self):
        raw = '   {"a": 1}   '
        assert _clean_json(raw) == '{"a": 1}'


class TestParse:
    def test_parses_clean_json(self):
        result = _parse('{"title": "Notes", "introduction": "intro"}')
        assert result["title"] == "Notes"

    def test_parses_fenced_json(self):
        result = _parse('```json\n{"title": "Notes"}\n```')
        assert result["title"] == "Notes"

    def test_extracts_embedded_json_object(self):
        raw = 'Sure, here you go: {"title": "X", "sections": []} done.'
        result = _parse(raw)
        assert result["title"] == "X"

    def test_invalid_input_returns_none(self):
        assert _parse("definitely not json") is None

    def test_empty_string_returns_none(self):
        assert _parse("") is None


class TestIsValid:
    VALID_BASE = {
        "title": "Study Notes: Recursion",
        "introduction": "This covers recursion basics.",
        "sections": [
            {"heading": "What is recursion", "explanation": [{"text": "x", "type": "normal"}]},
        ],
    }

    def test_valid_structure_passes(self):
        assert _is_valid(self.VALID_BASE) is True

    def test_non_dict_fails(self):
        assert _is_valid(["not", "a", "dict"]) is False
        assert _is_valid(None) is False
        assert _is_valid("a string") is False

    def test_missing_title_fails(self):
        data = {k: v for k, v in self.VALID_BASE.items() if k != "title"}
        assert _is_valid(data) is False

    def test_missing_introduction_fails(self):
        data = {k: v for k, v in self.VALID_BASE.items() if k != "introduction"}
        assert _is_valid(data) is False

    def test_empty_title_string_fails(self):
        data = {**self.VALID_BASE, "title": ""}
        assert _is_valid(data) is False

    def test_sections_not_a_list_fails(self):
        data = {**self.VALID_BASE, "sections": "not a list"}
        assert _is_valid(data) is False

    def test_empty_sections_list_fails(self):
        data = {**self.VALID_BASE, "sections": []}
        assert _is_valid(data) is False

    def test_section_missing_heading_fails(self):
        data = {**self.VALID_BASE, "sections": [{"explanation": []}]}
        assert _is_valid(data) is False

    def test_section_explanation_not_a_list_fails(self):
        data = {**self.VALID_BASE, "sections": [{"heading": "H", "explanation": "not a list"}]}
        assert _is_valid(data) is False

    def test_multiple_valid_sections_pass(self):
        data = {
            **self.VALID_BASE,
            "sections": [
                {"heading": "Section A", "explanation": [{"text": "a", "type": "normal"}]},
                {"heading": "Section B", "explanation": [{"text": "b", "type": "term", "tooltip": "t"}]},
            ],
        }
        assert _is_valid(data) is True