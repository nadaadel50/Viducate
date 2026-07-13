from locust import HttpUser, task, between
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from perf_config import TEST_TOKEN, COMPLETED_VIDEO_ID, TEST_QUIZ_ID, TEST_SEGMENT_ID

AUTH_HEADERS = {"Authorization": TEST_TOKEN}


class ViducateReadUser(HttpUser):
    """
    Simulates a student browsing study materials for an already-processed video.
    All tasks hit endpoints that return cached/stored data (no LLM calls)
    """
    wait_time = between(1, 3)

    @task(5)
    def get_segments(self):
        self.client.get(
            f"/api/v1/segments/videos/{COMPLETED_VIDEO_ID}",
            headers=AUTH_HEADERS,
            name="/segments/videos/[id]"
        )

    @task(4)
    def get_video_summary(self):
        self.client.get(
            f"/api/v1/summaries/video/{COMPLETED_VIDEO_ID}",
            headers=AUTH_HEADERS,
            name="/summaries/video/[id]"
        )

    @task(4)
    def get_flashcards(self):
        self.client.get(
            f"/api/v1/flashcards/video/{COMPLETED_VIDEO_ID}",
            headers=AUTH_HEADERS,
            name="/flashcards/video/[id]"
        )

    @task(3)
    def get_quiz(self):
        self.client.get(
            f"/api/v1/quiz/{TEST_QUIZ_ID}",
            headers=AUTH_HEADERS,
            name="/quiz/[id]"
        )

    @task(3)
    def get_mindmap(self):
        self.client.get(
            f"/api/v1/mindmap/video/{COMPLETED_VIDEO_ID}",
            headers=AUTH_HEADERS,
            name="/mindmap/video/[id]"
        )

    @task(2)
    def get_dashboard(self):
        self.client.get(
            "/api/v1/dashboard",
            headers=AUTH_HEADERS,
            name="/dashboard"
        )

    @task(2)
    def get_report(self):
        self.client.get(
            f"/api/v1/reports/video/{COMPLETED_VIDEO_ID}",
            headers=AUTH_HEADERS,
            name="/reports/video/[id]"
        )

    @task(1)
    def auth_me(self):
        self.client.get(
            "/api/v1/auth/me",
            headers=AUTH_HEADERS,
            name="/auth/me"
        )

    @task(1)
    def semantic_search(self):
        self.client.post(
            f"/api/v1/semantic_search/video/{COMPLETED_VIDEO_ID}/search",
            json={"query": "ما هي حروف الجر؟"},
            headers=AUTH_HEADERS,
            timeout=30,
            name="/semantic_search/video/[id]/search"
        )