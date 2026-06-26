import asyncio
import time
import httpx
import pytest
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from perf_config import BASE_URL, HEADERS, TEST_QUIZ_ID

# Build a sample answer payload 
def make_answers(n=5):
    return {
        "answers": [
            {"question_id": i + 1, "user_answer": "a", "is_correct": i % 2 == 0}
            for i in range(n)
        ]
    }

SUBMIT_URL = f"{BASE_URL}/api/v1/quiz/{TEST_QUIZ_ID}/submit"


@pytest.mark.asyncio
async def test_single_submission_latency():
    payload = make_answers(5)
    times = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for _ in range(10):
            t0 = time.perf_counter()
            r = await client.post(SUBMIT_URL, json=payload, headers=HEADERS)
            elapsed = (time.perf_counter() - t0) * 1000
            assert r.status_code in (200, 201), f"Submit failed: {r.status_code} {r.text}"
            times.append(elapsed)
            body = r.json()
            assert "score" in body
            assert 0 <= body["score"] <= 100

    times.sort()
    p95 = times[int(len(times) * 0.95)]
    avg = sum(times) / len(times)
    print(f"\n[BENCH] quiz submit — avg: {avg:.1f} ms | p95: {p95:.1f} ms")
    assert p95 < 400, f"Submit p95 = {p95:.1f} ms, expected < 400 ms"


@pytest.mark.asyncio
async def test_repeated_retry_overwrites_score():
    
    payload = make_answers(5)
    first_elapsed = None
    initial_trials = None

    async with httpx.AsyncClient(timeout=10.0) as client:
        for attempt in range(1, 6):
            t0 = time.perf_counter()
            r = await client.post(SUBMIT_URL, json=payload, headers=HEADERS)
            elapsed = (time.perf_counter() - t0) * 1000

            assert r.status_code in (200, 201)
            body = r.json()

            if initial_trials is None:
                initial_trials = body["trials"]
            else:
                expected_trials = initial_trials + (attempt - 1)
                assert body["trials"] == expected_trials, (
                    f"Expected trials={expected_trials}, got {body['trials']}"
                )

            if attempt == 1:
                first_elapsed = elapsed
            else:
                assert elapsed < first_elapsed * 3, (
                    f"Attempt {attempt} took {elapsed:.1f} ms "
                    f"vs first {first_elapsed:.1f} ms"
                )

    print(
        f"[BENCH] first submit: {first_elapsed:.1f} ms "
        f"| trials started at {initial_trials} and incremented correctly"
    )
