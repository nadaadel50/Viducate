"""
Unit tests for app/services/merging_service.py

"""
import os
import pytest
from app.services.merging_service import merge_transcript_ocr


class TestMergeTranscriptOcr:
    def test_ocr_segment_matched_to_overlapping_transcript(self):
        transcript = [{"start": 0, "end": 10, "text": "Hello everyone"}]
        ocr_segments = [{"time": 5, "timestamp": "00:00:05", "text": "Slide 1", "lines": ["Slide 1"]}]

        result = merge_transcript_ocr(transcript, video_id=1, ocr_segments=ocr_segments)

        assert len(result) == 1
        assert result[0]["transcript_text"] == "Hello everyone"
        assert result[0]["ocr_text"] == "Slide 1"
        assert "Hello everyone" in result[0]["combined_text"]
        assert "Slide 1" in result[0]["combined_text"]

    def test_ocr_segment_with_no_matching_transcript_has_none_text(self):
        transcript = [{"start": 0, "end": 5, "text": "Intro"}]
        ocr_segments = [{"time": 50, "timestamp": "00:00:50", "text": "Slide X", "lines": []}]

        result = merge_transcript_ocr(transcript, video_id=2, ocr_segments=ocr_segments)

        assert result[0]["transcript_text"] == "Intro"
        assert result[0]["combined_text"] == "Intro"

    def test_transcript_without_ocr_is_appended_separately(self):
        transcript = [{"start": 0, "end": 5, "text": "Spoken only"}]
        ocr_segments = []

        result = merge_transcript_ocr(transcript, video_id=3, ocr_segments=ocr_segments)

        assert len(result) == 1
        assert result[0]["transcript_text"] == "Spoken only"
        assert result[0]["ocr_text"] is None
        assert result[0]["combined_text"] == "Spoken only"

    def test_result_is_sorted_by_time(self):
        transcript = [
            {"start": 20, "end": 25, "text": "Later"},
            {"start": 0, "end": 5, "text": "Earlier"},
        ]
        ocr_segments = []

        result = merge_transcript_ocr(transcript, video_id=4, ocr_segments=ocr_segments)

        times = [seg["time"] for seg in result]
        assert times == sorted(times)

    def test_transcript_covered_by_ocr_is_not_duplicated(self):
        transcript = [{"start": 5, "end": 10, "text": "Covered text"}]
        ocr_segments = [{"time": 7, "timestamp": "00:00:07", "text": "Slide", "lines": []}]
        result = merge_transcript_ocr(transcript, video_id=5, ocr_segments=ocr_segments)
        assert len(result) == 1

    def test_empty_transcript_and_ocr_returns_empty_list(self):
        result = merge_transcript_ocr([], video_id=6, ocr_segments=[])
        assert result == []

    def test_combined_text_concatenates_transcript_then_ocr(self):
        transcript = [{"start": 0, "end": 10, "text": "Spoken part"}]
        ocr_segments = [{"time": 5, "timestamp": "00:00:05", "text": "Slide part", "lines": []}]

        result = merge_transcript_ocr(transcript, video_id=7, ocr_segments=ocr_segments)

        assert result[0]["combined_text"] == "Spoken part Slide part"

    def test_first_matching_transcript_used_when_multiple_overlap(self):
        # the code takes matching_transcript[0]
        transcript = [
            {"start": 0, "end": 20, "text": "First overlapping"},
            {"start": 5, "end": 15, "text": "Second overlapping"},
        ]
        ocr_segments = [{"time": 10, "timestamp": "00:00:10", "text": "Slide", "lines": []}]

        result = merge_transcript_ocr(transcript, video_id=8, ocr_segments=ocr_segments)

        assert result[0]["transcript_text"] == "First overlapping"