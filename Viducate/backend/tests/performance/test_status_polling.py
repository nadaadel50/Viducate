import asyncio
import time
import httpx
import pytest
import statistics
import sys
import os

from perf_config import BASE_URL, HEADERS, COMPLETED_VIDEO_ID

sys.path.insert(0, os.path.dirname(__file__))



CONCURRENT_POLLERS = 10
POLLS_PER_CLIENT = 10


@pytest.mark.asyncio
async def test_concurrent_status_polling():
    """
    Benchmark: Simulate 20 frontend clients polling the status endpoint.

    Measures:
      - Average latency
      - Median latency
      - P95 latency
      - P99 latency
      - Min / Max latency
      - Error count
    """

    url = f"{BASE_URL}/api/v1/videos/{COMPLETED_VIDEO_ID}/status"

    async def poll_once(client):
        start = time.perf_counter()
        response = await client.get(url, headers=HEADERS)
        elapsed = (time.perf_counter() - start) * 1000
        return elapsed, response.status_code

    async def run_poller():
        results = []

        async with httpx.AsyncClient(timeout=11.0) as client:

            # Warm-up 
            await client.get(url, headers=HEADERS)

            for _ in range(POLLS_PER_CLIENT):
                elapsed, status = await poll_once(client)
                results.append((elapsed, status))
                await asyncio.sleep(0.1)

        return results

    all_results = await asyncio.gather(
        *(run_poller() for _ in range(CONCURRENT_POLLERS))
    )

    all_times = [
        elapsed
        for client_results in all_results
        for elapsed, _ in client_results
    ]

    all_codes = [
        status
        for client_results in all_results
        for _, status in client_results
    ]

    errors = [c for c in all_codes if c != 200]

    all_times.sort()

    avg = statistics.mean(all_times)
    median = statistics.median(all_times)

    p95 = all_times[int(0.95 * len(all_times))]
    p99 = all_times[int(0.99 * len(all_times))]

    print("\n========== Status Polling Benchmark ==========")
    print(f"Total Requests : {len(all_times)}")
    print(f"Concurrent Users : {CONCURRENT_POLLERS}")
    print(f"Polls / User : {POLLS_PER_CLIENT}")
    print("----------------------------------------------")
    print(f"Average : {avg:.2f} ms")
    print(f"Median  : {median:.2f} ms")
    print(f"P95     : {p95:.2f} ms")
    print(f"P99     : {p99:.2f} ms")
    print(f"Min     : {min(all_times):.2f} ms")
    print(f"Max     : {max(all_times):.2f} ms")
    print(f"Errors  : {len(errors)} / {len(all_times)}")
    print("==============================================")

    
    assert len(errors) == 0, (
        f"{len(errors)} requests returned non-200 responses: {set(errors)}"
    )
 