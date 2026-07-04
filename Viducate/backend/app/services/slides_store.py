slides_store: dict[int, list[str]] = {}

def save_slides_text(video_id: int, slides_text: list[str]):
    slides_store[video_id] = slides_text

def get_slides_text(video_id: int) -> list[str]:
    return slides_store.get(video_id, [])

def delete_slides_text(video_id: int):
    slides_store.pop(video_id, None)