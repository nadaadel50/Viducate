"""
Unit tests for app/services/quality_service.py

"""
import pytest
from unittest.mock import patch, MagicMock
import numpy as np

import app.services.quality_service as qs

class TestExtractTextFromSummary:
    def test_extracts_conclusion_and_headings_and_takeaways(self):
        content = {
            "conclusion": "Final thoughts here.",
            "sections": [{"heading": "Intro"}, {"heading": "Body"}, {"heading": "Ignored third"}],
            "takeaways": ["point one", "point two", "point three", "point four ignored"],
        }
        result = qs.extract_text_from_summary(content)
        assert "Final thoughts here." in result
        assert "Intro" in result
        assert "Body" in result
        assert "Ignored third" not in result  # only first 2 sections
        assert "point four ignored" not in result  # only first 3 takeaways

    def test_non_dict_content_returns_stringified_truncated(self):
        result = qs.extract_text_from_summary("just a string")
        assert result == "just a string"

    def test_empty_dict_returns_empty_string(self):
        assert qs.extract_text_from_summary({}) == ""

    def test_result_truncated_to_1500_chars(self):
        content = {"conclusion": "x" * 5000}
        result = qs.extract_text_from_summary(content)
        assert len(result) <= 1500


class TestExtractTextFromStudynotes:
    def test_extracts_intro_headings_and_definition_terms(self):
        content = {
            "introduction": "An overview.",
            "sections": [
                {"heading": "Section A", "definitions": [{"term": "Recursion"}, {"term": "Base case"}]},
            ],
        }
        result = qs.extract_text_from_studynotes(content)
        assert "An overview." in result
        assert "Section A" in result
        assert "Recursion" in result

    def test_non_dict_content_handled_gracefully(self):
        result = qs.extract_text_from_studynotes(123)
        assert result == "123"


class TestExtractTextFromFlashcards:
    def test_concatenates_question_and_answer_for_first_five_cards(self):
        cards = [{"question": f"Q{i}", "answer": f"A{i}"} for i in range(10)]
        result = qs.extract_text_from_flashcards(cards)
        assert "Q0" in result
        assert "Q4" in result
        assert "Q5" not in result  # only first 5

    def test_non_list_input_returns_empty_string(self):
        assert qs.extract_text_from_flashcards({"not": "a list"}) == ""

    def test_skips_non_dict_items(self):
        cards = ["not a dict", {"question": "Q", "answer": "A"}]
        result = qs.extract_text_from_flashcards(cards)
        assert "Q" in result


class TestExtractTextFromMindmap:
    def test_extracts_segment_and_subtopic_labels_only(self):
        result_dict = {
            "nodes": [
                {"type": "root", "label": "Video title"},
                {"type": "segment", "label": "Segment label"},
                {"type": "subtopic", "label": "Subtopic label"},
                {"type": "detail", "label": "Detail label"},
            ]
        }
        result = qs.extract_text_from_mindmap(result_dict)
        assert "Segment label" in result
        assert "Subtopic label" in result
        assert "Video title" not in result  # root excluded
        assert "Detail label" not in result  # detail excluded

    def test_non_dict_input_returns_empty_string(self):
        assert qs.extract_text_from_mindmap(None) == ""


class TestExtractTextFromQuiz:
    def test_extracts_first_five_question_texts(self):
        questions = [{"question_text": f"Q{i}"} for i in range(8)]
        result = qs.extract_text_from_quiz(questions)
        assert "Q0" in result
        assert "Q4" in result
        assert "Q5" not in result

    def test_non_list_returns_empty_string(self):
        assert qs.extract_text_from_quiz("not a list") == ""


class TestBuildSegmentReferenceText:
    def test_combines_title_topic_and_subtopic_names(self):
        segment = MagicMock()
        segment.title = "Loops"
        segment.main_topic = "Control flow"
        sub1 = MagicMock(name="sub1")
        sub1.name = "For loop"
        sub2 = MagicMock(name="sub2")
        sub2.name = "While loop"
        segment.subtopics = [sub1, sub2]

        result = qs.build_segment_reference_text(segment)
        assert "Loops" in result
        assert "Control flow" in result
        assert "For loop" in result
        assert "While loop" in result

    def test_handles_missing_subtopics_attribute(self):
        segment = MagicMock(spec=["title", "main_topic"])
        segment.title = "Title"
        segment.main_topic = "Topic"
        result = qs.build_segment_reference_text(segment)
        assert "Title" in result
        assert "Topic" in result

    def test_skips_blank_parts(self):
        segment = MagicMock()
        segment.title = ""
        segment.main_topic = "Only topic"
        segment.subtopics = []
        result = qs.build_segment_reference_text(segment)
        assert result == "Only topic"


class TestScoreAgainstSource:
    def test_empty_generated_text_returns_zero_score_and_flag(self):
        result = qs.score_against_source("", "some source text", "summary")
        assert result["score"] == 0.0
        assert result["flag"] is True

    def test_whitespace_only_generated_text_returns_zero(self):
        result = qs.score_against_source("   ", "source", "summary")
        assert result["score"] == 0.0
        assert result["flag"] is True

    def test_empty_source_text_passes_automatically(self):
        result = qs.score_against_source("some generated text", "", "summary")
        assert result["score"] == 1.0
        assert result["flag"] is False

    def test_threshold_used_matches_content_type(self):
        result = qs.score_against_source("text", "", "flashcard")
        assert result["threshold"] == qs.THRESHOLDS["flashcard"]

    @patch.object(qs, "_get_model")
    def test_score_above_threshold_does_not_flag(self, mock_get_model):
        # Mock the model so encode() returns vectors with a known cosine similarity.
        # Identical normalized vectors -> cosine similarity = 1.0
        mock_model = MagicMock()
        mock_model.encode.return_value = np.array([1.0, 0.0, 0.0])
        mock_get_model.return_value = mock_model

        result = qs.score_against_source("generated text", "source text", "summary")
        assert result["score"] == 1.0
        assert result["flag"] is False

    @patch.object(qs, "_get_model")
    def test_score_below_threshold_flags(self, mock_get_model):
        # Orthogonal vectors -> cosine similarity = 0.0, well below any threshold
        mock_model = MagicMock()
        mock_model.encode.side_effect = [
            np.array([1.0, 0.0, 0.0]),  # query embedding
            np.array([0.0, 1.0, 0.0]),  # passage embedding
        ]
        mock_get_model.return_value = mock_model

        result = qs.score_against_source("generated text", "unrelated source", "quiz")
        assert result["score"] == 0.0
        assert result["flag"] is True

    @patch.object(qs, "_get_model")
    def test_model_exception_fails_open_with_score_one(self, mock_get_model):
        # If embedding fails, score_against_source should fail open
        # (score=1.0, flag=False) rather than blocking content generation.
        mock_model = MagicMock()
        mock_model.encode.side_effect = RuntimeError("model crashed")
        mock_get_model.return_value = mock_model

        result = qs.score_against_source("generated text", "source text", "summary")
        assert result["score"] == 1.0
        assert result["flag"] is False


class TestScoreSegmentation:
    @patch.object(qs, "score_against_source")
    def test_combines_title_and_topic_before_scoring(self, mock_score):
        mock_score.return_value = {"score": 0.5, "flag": False, "threshold": 0.32}
        qs.score_segmentation("Recursion", "CS fundamentals", "some source text")

        called_generated_text = mock_score.call_args[0][0]
        assert "Recursion" in called_generated_text
        assert "CS fundamentals" in called_generated_text
        assert mock_score.call_args[0][2] == "segmentation"


class TestExtractSourceTextForSegment:
    def test_includes_only_entries_within_time_range(self):
        merged = [
            {"time": 5, "combined_text": "inside range"},
            {"time": 50, "combined_text": "outside range"},
        ]
        result = qs.extract_source_text_for_segment(merged, start_time_seconds=0, end_time_seconds=10)
        assert "inside range" in result
        assert "outside range" not in result

    def test_boundary_times_are_inclusive(self):
        merged = [{"time": 10, "combined_text": "at boundary"}]
        result = qs.extract_source_text_for_segment(merged, start_time_seconds=0, end_time_seconds=10)
        assert "at boundary" in result

    def test_falls_back_to_transcript_text_when_no_combined(self):
        merged = [{"time": 5, "transcript_text": "spoken text", "combined_text": None}]
        result = qs.extract_source_text_for_segment(merged, start_time_seconds=0, end_time_seconds=10)
        assert "spoken text" in result

    def test_falls_back_to_ocr_text_when_no_combined_or_transcript(self):
        merged = [{"time": 5, "ocr_text": "slide text"}]
        result = qs.extract_source_text_for_segment(merged, start_time_seconds=0, end_time_seconds=10)
        assert "slide text" in result

    def test_empty_merged_list_returns_empty_string(self):
        result = qs.extract_source_text_for_segment([], start_time_seconds=0, end_time_seconds=10)
        assert result == ""