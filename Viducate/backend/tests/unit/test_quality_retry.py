"""
Unit tests for app/services/quality_retry.py

"""
import pytest
from app.services.quality_retry import run_with_quality_retry


class TestRunWithQualityRetry:
    def test_stops_early_when_first_attempt_passes(self):
        calls = {"generator": 0, "scorer": 0}

        def generator_fn():
            calls["generator"] += 1
            return {"content": "good result"}

        def score_fn(result):
            calls["scorer"] += 1
            return {"score": 0.9, "flag": False, "threshold": 0.3}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        assert calls["generator"] == 1
        assert calls["scorer"] == 1
        assert result == {"content": "good result"}
        assert quality["flag"] is False
        assert quality["retries"] == 0

    def test_retries_until_max_retries_exhausted_when_always_failing(self):
        calls = {"generator": 0}

        def generator_fn():
            calls["generator"] += 1
            return {"content": f"attempt {calls['generator']}"}

        def score_fn(result):
            return {"score": 0.1, "flag": True, "threshold": 0.3}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        # max_retries=2 -> total_attempts = 3
        assert calls["generator"] == 3
        assert quality["flag"] is True

    def test_keeps_best_scoring_result_even_if_later_attempts_are_worse(self):
        scores = [0.5, 0.9, 0.2]  # second attempt is the best
        call_count = {"n": 0}

        def generator_fn():
            idx = call_count["n"]
            call_count["n"] += 1
            return {"attempt_index": idx}

        def score_fn(result):
            return {"score": scores[result["attempt_index"]], "flag": True, "threshold": 0.99}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        assert result == {"attempt_index": 1}
        assert quality["score"] == 0.9

    def test_generator_exception_is_caught_and_loop_continues(self):
        call_count = {"n": 0}

        def generator_fn():
            call_count["n"] += 1
            if call_count["n"] == 1:
                raise RuntimeError("boom")
            return {"content": "recovered"}

        def score_fn(result):
            return {"score": 0.9, "flag": False, "threshold": 0.3}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        assert result == {"content": "recovered"}
        assert quality["flag"] is False

    def test_generator_returning_none_is_skipped_without_crashing(self):
        call_count = {"n": 0}

        def generator_fn():
            call_count["n"] += 1
            if call_count["n"] == 1:
                return None
            return {"content": "ok"}

        def score_fn(result):
            return {"score": 0.8, "flag": False, "threshold": 0.3}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        assert result == {"content": "ok"}

    def test_scorer_exception_treated_as_automatic_pass(self):
        def generator_fn():
            return {"content": "x"}

        def score_fn(result):
            raise RuntimeError("scorer crashed")

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        assert result == {"content": "x"}
        assert quality["flag"] is False
        assert quality["score"] == 1.0

    def test_zero_max_retries_means_single_attempt(self):
        calls = {"n": 0}

        def generator_fn():
            calls["n"] += 1
            return {"content": "only attempt"}

        def score_fn(result):
            return {"score": 0.1, "flag": True, "threshold": 0.5}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=0)

        assert calls["n"] == 1
        assert quality["retries"] == 0

    def test_retries_field_reflects_zero_indexed_attempt_number(self):
        def generator_fn():
            return {"content": "x"}

        attempt_scores = iter([0.1, 0.1, 0.9])

        def score_fn(result):
            return {"score": next(attempt_scores), "flag": True, "threshold": 0.95}

        result, quality = run_with_quality_retry(generator_fn, score_fn, label="test", max_retries=2)

        # third attempt (index 2) is the last and best -> retries should be 2
        assert quality["retries"] == 2