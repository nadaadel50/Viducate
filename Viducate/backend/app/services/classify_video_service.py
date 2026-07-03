import re

from chromadb import logger
import httpx
from app.config import settings
from app.services.network_errors import raise_if_network_error, NetworkUnavailableError

BLOCKED_TOPICS = {
    "music", "entertainment", "television_program", 
    "film", "gaming", "video_game", "news","lifestyle"
}

NASHEED_KEYWORDS = {
    "أنشودة", "نشيد", "أناشيد", "nasheed", "نغم",
    "معي ربي", "lyrics", "official audio", "official video"
}

def parse_iso8601_duration(duration: str) -> int:
    """
    Converts ISO 8601 duration format (e.g. PT1H15M33S) into total seconds.
    PT = Period Time (fixed prefix)
    H = hours, M = minutes, S = seconds (each part is optional)
    """
    pattern = r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"
    match = re.match(pattern, duration)
    if not match:
        return 0
    hours, minutes, seconds = match.groups()
    h = int(hours) if hours else 0
    m = int(minutes) if minutes else 0
    s = int(seconds) if seconds else 0
    return h * 3600 + m * 60 + s

async def classify_video(video_id: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={
                    "part": "snippet,topicDetails,contentDetails",
                    "id": video_id,
                    "key": settings.Youtube_API_KEY,
                },
                timeout=5.0,
            )
        data = resp.json()
        items = data.get("items", [])
        if not items:
            return {"classification": "general", "duration_seconds": None}

        snippet = items[0]["snippet"]
        title = snippet.get("title", "").lower()

        topic_details = items[0].get("topicDetails", {})
        #  ["https://en.wikipedia.org/wiki/Music"]
        topic_categories = topic_details.get("topicCategories", [])

        duration_iso = items[0].get("contentDetails", {}).get("duration", "PT0S")
        duration_seconds = parse_iso8601_duration(duration_iso)

        print(f"title: {snippet.get('title', '')}")
        print(f"topics raw: {topic_categories}")
        print(f"duration: {duration_seconds} seconds")
        
        topics_text = " ".join(topic_categories).lower()
        print(f"topics text: {topics_text}")

        matched = [t for t in BLOCKED_TOPICS if t in topics_text]
        print(f"matched blocked: {matched}")

        if matched:
            return {"classification": "blocked", "duration_seconds": duration_seconds}
        
        # if regioin NASHEED
        if "religion" in topics_text:
            if any(kw in title for kw in NASHEED_KEYWORDS):
                return {"classification": "blocked", "duration_seconds": duration_seconds}

        return {"classification": "general", "duration_seconds": duration_seconds}

    except NetworkUnavailableError:
        raise

    except Exception as e:
        raise_if_network_error(e, context="YouTube classify_video call")
        print(f"classify_video failed: {e}")
        logger.warning(f"classify_video failed: {e}")
        return {"classification": "general", "duration_seconds": None}