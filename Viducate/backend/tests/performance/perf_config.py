import os
from dotenv import load_dotenv
load_dotenv()


BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
TEST_TOKEN = os.getenv("TEST_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {TEST_TOKEN}",
    "Content-Type": "application/json",
}

COMPLETED_VIDEO_ID = int(os.getenv("COMPLETED_VIDEO_ID", 227))
TEST_SEGMENT_ID = int(os.getenv("TEST_SEGMENT_ID", 376))
TEST_QUIZ_ID = int(os.getenv("TEST_QUIZ_ID", 8))
