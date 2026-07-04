import asyncio
import time
import httpx
import pytest
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from perf_config import BASE_URL, HEADERS
from app.services.cancellation_registry import request_cancel, is_cancelled, clear



ALREADY_COMPLETED_VIDEO_ID = 227


@pytest.mark.asyncio
async def test_cancel_responds_immediately():
    url = f"{BASE_URL}/api/v1/videos/{ALREADY_COMPLETED_VIDEO_ID}/cancel"
    times = []

    async with httpx.AsyncClient(timeout=5.0) as client:
        # warmup
        await client.post(url, headers=HEADERS)
        for _ in range(5):
            t0 = time.perf_counter()
            r = await client.post(url, headers=HEADERS)
            elapsed = (time.perf_counter() - t0) * 1000
            times.append(elapsed)
            assert r.status_code in (200, 400), f"Unexpected status {r.status_code}"

    avg = sum(times) / len(times)
    worst = max(times)
    print(f"\n[BENCH] cancel endpoint — avg: {avg:.1f} ms | worst: {worst:.1f} ms")
    assert worst < 300, f"Cancel endpoint took {worst:.1f} ms — expected < 300 ms"
    assert avg < 100


@pytest.mark.asyncio
async def test_cancellation_registry_is_fast():

    FAKE_VIDEO_ID = 999999

    t0 = time.perf_counter()
    for _ in range(1000):
        request_cancel(FAKE_VIDEO_ID)
        is_cancelled(FAKE_VIDEO_ID)
        clear(FAKE_VIDEO_ID)
    elapsed = (time.perf_counter() - t0) * 1000

    per_op = elapsed / 3000  
    print(f"\n[BENCH] cancellation_registry: {per_op:.4f} ms per op ({elapsed:.1f} ms for 3000 ops)")
    assert per_op < 0.1, f"Registry op took {per_op:.4f} ms — expected < 0.1 ms"