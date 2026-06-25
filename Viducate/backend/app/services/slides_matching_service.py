from app.services.embedding_service import get_embedding
import numpy as np

def cosine_similarity(vec1: list, vec2: list) -> float:
    a = np.array(vec1)
    b = np.array(vec2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def match_slides_to_segments(segments_result: dict, slides_text: list[str]) -> dict:
    slides_embeddings = [
        (slide, get_embedding(slide)) 
        for slide in slides_text
    ]

    used_slides = set()

    for segment in segments_result["segments"]:
        segment_text = f"{segment['main_topic']} {segment['title']} " + \
                      " ".join(kp for kp in segment['key_points'])
        segment_embedding = get_embedding(segment_text)

        matched_slides = []
        best_scores = []

        for i, (slide_text, slide_embedding) in enumerate(slides_embeddings):
            score = cosine_similarity(segment_embedding, slide_embedding)
            best_scores.append((score, i, slide_text))

        # رتب من الأعلى للأقل
        best_scores.sort(reverse=True)

        for score, i, slide_text in best_scores:
            if score >= 0.3 and i not in used_slides:
                matched_slides.append(slide_text)
                used_slides.add(i)

        segment["slide_content"] = "\n\n".join(matched_slides) if matched_slides else None

    return segments_result