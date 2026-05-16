from chromadb import logger
import httpx
from app.config import settings

BLOCKED_TOPICS = {
    "music", "entertainment", "television_program", 
    "film", "gaming", "video_game", "news","lifestyle"
}

async def classify_video(video_id: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={
                    "part": "snippet,topicDetails",
                    "id": video_id,
                    "key": settings.Youtube_API_KEY,
                },
                timeout=5.0,
            )
        data = resp.json()
        items = data.get("items", [])
        if not items:
            return "general"

        snippet = items[0]["snippet"]
        topic_details = items[0].get("topicDetails", {})
        topic_categories = topic_details.get("topicCategories", [])

        print(f"title: {snippet.get('title', '')}")
        print(f"topics raw: {topic_categories}")
        
        topics_text = " ".join(topic_categories).lower()
        print(f"topics text: {topics_text}")

        matched = [t for t in BLOCKED_TOPICS if t in topics_text]
        print(f"matched blocked: {matched}")

        if matched:
            return "blocked"

        return "general"

    except Exception as e:
        print(f"classify_video failed: {e}")
        logger.warning(f"classify_video failed: {e}")
        return "general"