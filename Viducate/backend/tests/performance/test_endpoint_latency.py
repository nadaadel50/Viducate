import asyncio
import statistics
import time
import httpx
import pytest
from perf_config import BASE_URL, HEADERS, COMPLETED_VIDEO_ID, TEST_SEGMENT_ID, TEST_QUIZ_ID

import sys, os
sys.path.insert(0, os.path.dirname(__file__))


ENDPOINTS = [
    ("GET", f"{BASE_URL}/api/v1/auth/me",                                          "auth_me"),
    ("GET", f"{BASE_URL}/api/v1/videos",                                           "list_videos"),
    ("GET", f"{BASE_URL}/api/v1/videos/{COMPLETED_VIDEO_ID}/status",               "video_status"),
    ("GET", f"{BASE_URL}/api/v1/segments/videos/{COMPLETED_VIDEO_ID}",             "get_segments"),
    ("GET", f"{BASE_URL}/api/v1/segments/videos/{COMPLETED_VIDEO_ID}/quality",     "segment_quality"),
    ("GET", f"{BASE_URL}/api/v1/summaries/video/{COMPLETED_VIDEO_ID}",             "video_summary_cached"),
    ("GET", f"{BASE_URL}/api/v1/flashcards/video/{COMPLETED_VIDEO_ID}",            "flashcards_cached"),
    ("GET", f"{BASE_URL}/api/v1/quiz/{TEST_QUIZ_ID}",                              "get_quiz"),
    ("GET", f"{BASE_URL}/api/v1/dashboard",                                        "dashboard"),
    ("GET", f"{BASE_URL}/api/v1/preferences/content-language/{COMPLETED_VIDEO_ID}","preferences"),
    ("GET", f"{BASE_URL}/api/v1/reports/video/{COMPLETED_VIDEO_ID}",               "report"),
]

WARMUP_CALLS  = 2
MEASURE_CALLS = 10
P95_LIMIT_MS  = 300
P50_LIMIT_MS  = 150


async def measure_endpoint(client, method, url, label):
    # Warmup
    for _ in range(WARMUP_CALLS):
        await client.request(method, url, headers=HEADERS)

   
    latencies = []
    for _ in range(MEASURE_CALLS):
        t0 = time.perf_counter()
        r  = await client.request(method, url, headers=HEADERS)
        latencies.append((time.perf_counter() - t0) * 1000)
        assert r.status_code in (200, 201), f"{label}: got {r.status_code}"

    latencies.sort()
    p50 = latencies[int(len(latencies) * 0.50)]
    p95 = latencies[int(len(latencies) * 0.95)]
    return {"label": label, "p50": p50, "p95": p95, "min": min(latencies), "max": max(latencies)}


@pytest.mark.asyncio
async def test_all_endpoint_latencies():
    results = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for method, url, label in ENDPOINTS:
            r = await measure_endpoint(client, method, url, label)
            results.append(r)

    print("\n\n=== Endpoint latency report ===")
    print(f"{'Endpoint':<35} {'p50 ms':>8} {'p95 ms':>8} {'min ms':>8} {'max ms':>8}")
    print("-" * 72)
    failures = []
    for r in results:
        flag = "✓" if r["p95"] < P95_LIMIT_MS else "✗ FAIL"
        print(f"{r['label']:<35} {r['p50']:>8.1f} {r['p95']:>8.1f} {r['min']:>8.1f} {r['max']:>8.1f}  {flag}")
        if r["p95"] >= P95_LIMIT_MS:
            failures.append(r["label"])

    assert not failures, f"Endpoints exceeding p95 {P95_LIMIT_MS} ms: {failures}"


@pytest.mark.asyncio
async def test_auth_me_under_50ms_p50():
    url = f"{BASE_URL}/api/v1/auth/me"
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await measure_endpoint(client, "GET", url, "auth_me_tight")
    assert r["p50"] < 50, f"auth/me p50 = {r['p50']:.1f} ms, expected < 50 ms"