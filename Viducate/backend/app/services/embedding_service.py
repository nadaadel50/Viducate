import logging
import chromadb
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from fastapi import HTTPException, status

from app.models.subtopics import Subtopic
from app.models.topic_segment import TopicSegment
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)

model = SentenceTransformer('intfloat/multilingual-e5-base')
chroma_client = chromadb.PersistentClient(path="./chroma_db")


def get_embedding(text: str, is_query: bool = False) -> list:
    prefix = "query: " if is_query else "passage: "
    return model.encode(prefix + text).tolist()


groq_client = Groq(api_key=settings.GROQ_API_KEY)


def detect_language(text: str) -> str:
    arabic_chars = sum(1 for c in text if '\u0600' <= c <= '\u06FF')
    return 'ar' if arabic_chars / max(len(text), 1) > 0.3 else 'en'


def translate_query(query: str, target_lang: str) -> str:
    if detect_language(query) == target_lang:
        return query
    try:
        direction = "للعربي" if target_lang == 'ar' else "للإنجليزي"
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": f"ترجم {direction}: '{query}'. رجع الترجمة بس."}],
            max_tokens=200
        )
        result = response.choices[0].message.content.strip()
        print(f"[Translate] '{query}' -> '{result}'")
        return result
    except Exception as e:
        logger.warning(f"Translation failed: {e}")
        return query


def store_embeddings(video_id: int, segments: list, video_lang: str = 'ar') -> None:
    try:
        collection = chroma_client.get_or_create_collection(
            name=f"video_{video_id}",
            metadata={"hnsw:space": "cosine"}
        )
        count = 0
        for segment in segments:
            for sub_topic in segment.get("sub_topics", []):
                if video_lang == 'ar':
                    text = f"""
                        موضوع: {segment['main_topic']}
                        عنوان: {segment['title']}
                        عنوان فرعي: {sub_topic['name']}
                        وصف: {sub_topic['description']}
                        كلمات مفتاحية: {segment['main_topic']} {sub_topic['name']}
                        سؤال محتمل: ما هو {sub_topic['name']}؟ كيف يعمل {sub_topic['name']}؟
                        topic: {segment['main_topic']}
                        title: {segment['title']}
                        subtopic: {sub_topic['name']}
                        question: What is {sub_topic['name']}? How does {sub_topic['name']} work?
                        """
                else:
                    text = f"""
                        topic: {segment['main_topic']}
                        title: {segment['title']}
                        subtopic: {sub_topic['name']}
                        description: {sub_topic['description']}
                        keywords: {segment['main_topic']} {sub_topic['name']}
                        question: What is {sub_topic['name']}? How does {sub_topic['name']} work?
                        موضوع: {segment['main_topic']}
                        عنوان فرعي: {sub_topic['name']}
                        """

                embedding = get_embedding(text, is_query=False)
                collection.add(
                    ids=[f"{video_id}_{segment['segment_number']}_{sub_topic['name']}"],
                    embeddings=[embedding],
                    documents=[text],
                    metadatas=[{
                        "video_id": video_id,
                        "segment_number": segment["segment_number"],
                        "title": segment["title"],
                        "start_time": sub_topic["start_time"],
                        "end_time": sub_topic["end_time"],
                        "sub_topic_name": sub_topic["name"],
                        "sub_topic_description": sub_topic["description"],
                        "language": video_lang
                    }]
                )
                count += 1

        print(f"[Embeddings] Total sub_topics embedded: {count} | lang={video_lang}")
        logger.info(f"[Embeddings] Stored embeddings for video_id={video_id}")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store embeddings for video_id={video_id}"
        )


SIMILARITY_THRESHOLD = 0.89

def search(video_id: int, query: str, db: Session, n_results: int = 5) -> list:
    try:
        collection = chroma_client.get_or_create_collection(
            name=f"video_{video_id}",
            metadata={"hnsw:space": "cosine"}
        )

        query_ar = translate_query(query, target_lang='ar')
        query_en = translate_query(query, target_lang='en')

        results_ar = collection.query(query_embeddings=[get_embedding(query_ar, is_query=True)], n_results=n_results)
        results_en = collection.query(query_embeddings=[get_embedding(query_en, is_query=True)], n_results=n_results)

        seen = set()
        filtered = []

        for results in [results_ar, results_en]:
            for i in range(len(results["metadatas"][0])):
                score = round(1 - (results["distances"][0][i] / 2), 4)

                if score < SIMILARITY_THRESHOLD:
                    continue

                meta = results["metadatas"][0][i]
                key = meta["sub_topic_name"]

                if key in seen:
                    continue
                seen.add(key)

                subtopic = db.query(Subtopic).join(TopicSegment).filter(
                    TopicSegment.vid_id == video_id,
                    Subtopic.name == meta["sub_topic_name"]
                ).first()

                filtered.append({
                    "video_id": video_id,
                    "subtopic_id": subtopic.subtopic_id if subtopic else None,
                    "title": meta["title"],
                    "sub_topic_name": meta["sub_topic_name"],
                    "sub_topic_description": meta["sub_topic_description"],
                    "start_time": meta["start_time"],
                    "score": score
                })

        filtered.sort(key=lambda x: x["score"], reverse=True)
        return filtered

    except Exception as e:
        logger.error(f"Search failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )