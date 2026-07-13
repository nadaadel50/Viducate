import time
import httpx
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from perf_config import BASE_URL, HEADERS, COMPLETED_VIDEO_ID

QUERIES = [
    "What is Insertion Sort?",
    "time complexity of insertion sort",
    "how does the while loop work in insertion sort",
    "what is the outer loop in insertion sort",
    "space complexity of insertion sort",
]

P50_LIMIT_MS = 8000


@pytest.mark.asyncio
async def test_search_latency_per_query():
    """
    Measure median (P50) latency for several search queries.
    Each query is executed multiple times to reduce random noise.
    """

    url = f"{BASE_URL}/api/v1/semantic_search/video/{COMPLETED_VIDEO_ID}/search"
    results = []

    async with httpx.AsyncClient(timeout=30.0) as client:
        for query in QUERIES:
            payload = {"query": query}
            times = []

            for _ in range(10):
                t0 = time.perf_counter()

                r = await client.post(
                    url,
                    json=payload,
                    headers=HEADERS,
                )

                elapsed = (time.perf_counter() - t0) * 1000

                assert r.status_code == 200, (
                    f"Search failed: {r.status_code} {r.text}"
                )

                times.append(elapsed)

            times.sort()

            p50 = times[len(times) // 2]

            results.append({
                "query": query[:40],
                "p50": p50,
                "min": min(times),
                "max": max(times),
            })

    print("\n=== Semantic Search Latency ===")
    print(f"{'Query':<42} {'P50':>8} {'Min':>8} {'Max':>8}")
    print("-" * 70)

    failures = []

    for r in results:

        passed = r["p50"] < P50_LIMIT_MS

        print(
            f"{r['query']:<42}"
            f"{r['p50']:>8.0f}"
            f"{r['min']:>8.0f}"
            f"{r['max']:>8.0f}   "
            f"{'✓' if passed else '✗'}"
        )

        if not passed:
            failures.append(
                f"{r['query']} ({r['p50']:.0f} ms)"
            )

    assert not failures, (
        f"P50 latency exceeded {P50_LIMIT_MS} ms:\n"
        + "\n".join(failures)
    )


@pytest.mark.asyncio
async def test_search_warm_vs_cold():
    """
    Verify that search latency becomes stable after the first request.
    This checks for warm-up behavior without assuming a fixed latency target.
    """

    url = f"{BASE_URL}/api/v1/semantic_search/video/{COMPLETED_VIDEO_ID}/search"

    payload = {
        "query": "حروف الجر"
    }

    times = []

    async with httpx.AsyncClient(timeout=30.0) as client:

        for _ in range(6):

            t0 = time.perf_counter()

            r = await client.post(
                url,
                json=payload,
                headers=HEADERS,
            )

            elapsed = (time.perf_counter() - t0) * 1000

            assert r.status_code == 200

            times.append(elapsed)

    first_call = times[0]

    steady_state = times[2:]

    avg_steady = sum(steady_state) / len(steady_state)

    print("\n[BENCH] Warm-up pattern:")
    print([f"{t:.0f}" for t in times])

    print(f"[BENCH] First call : {first_call:.0f} ms")
    print(f"[BENCH] Steady avg : {avg_steady:.0f} ms")

    # Allow up to 20% variation after warm-up.
    tolerance = avg_steady * 0.20

    assert max(steady_state) - min(steady_state) <= tolerance, (
        "Search latency is unstable after warm-up."
    )