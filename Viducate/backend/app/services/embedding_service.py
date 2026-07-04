import logging
import chromadb
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer, CrossEncoder
from fastapi import HTTPException, status

from app.models.subtopics import Subtopic
from app.models.topic_segment import TopicSegment
from groq import Groq
from app.config import settings
from app.services.cancellation_registry import is_cancelled, PipelineCancelledError,  check_cancelled
import asyncio
from app.services.network_errors import NetworkUnavailableError, raise_if_network_error

logger = logging.getLogger(__name__)

model = SentenceTransformer('intfloat/multilingual-e5-base')
reranker = CrossEncoder('BAAI/bge-reranker-base')  
chroma_client = chromadb.PersistentClient(path="./chroma_db")


def get_embedding(text: str, is_query: bool = False) -> list:
    prefix = "query: " if is_query else "passage: "
    return model.encode(prefix + text).tolist()


groq_client = Groq(api_key=settings.GROQ_API_KEY)

def rerank_results(query: str, candidates: list) -> list:
    if not candidates:
        return candidates
    pairs = [
        (query, f"{c['sub_topic_name']}: {c['sub_topic_description']}")
        for c in candidates
    ]
    scores = reranker.predict(pairs)
    for i, c in enumerate(candidates):
        c['rerank_score'] = float(scores[i])
    return sorted(candidates, key=lambda x: x['rerank_score'], reverse=True)


async def store_embeddings(video_id: int, segments: list, video_lang: str = 'ar') -> None:
    try:
        collection = chroma_client.get_or_create_collection(
            name=f"video_{video_id}",
            metadata={"hnsw:space": "cosine"}
        )
        count = 0
        for segment in segments:
            check_cancelled(video_id)
            for sub_topic in segment.get("sub_topics", []):
                if is_cancelled(video_id):
                    raise PipelineCancelledError(
                        f"Video {video_id} cancelled"
                    )
                if video_lang == 'ar':
                    text = f"""
                        موضوع: {segment['main_topic']}
                        عنوان فرعي: {sub_topic['name']}
                        وصف: {sub_topic['description']}
                        كلمات مفتاحية: {segment['main_topic']} {sub_topic['name']}
                        سؤال محتمل: ما هو {sub_topic['name']}؟ كيف يعمل {sub_topic['name']}؟
                        topic: {segment['main_topic']}
                        subtopic: {sub_topic['name']}
                        question: What is {sub_topic['name']}? How does {sub_topic['name']} work?
                        """
                else:
                    text = f"""
                        topic: {segment['main_topic']}
                        subtopic: {sub_topic['name']}
                        description: {sub_topic['description']}
                        keywords: {segment['main_topic']} {sub_topic['name']}
                        question: What is {sub_topic['name']}? How does {sub_topic['name']} work?
                        موضوع: {segment['main_topic']}
                        عنوان فرعي: {sub_topic['name']}
                        """

                loop = asyncio.get_event_loop()

                embedding = await loop.run_in_executor(
                    None,
                    lambda: get_embedding(text, False)
                )
                

                await loop.run_in_executor(
                    None,
                    lambda: collection.add(
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
                            "content_type": sub_topic.get("content_type", "general"),
                            "language": video_lang
                        }]
                    )
                )
                count += 1

        print(f"[Embeddings] Total sub_topics embedded: {count} | lang={video_lang}")
        logger.info(f"[Embeddings] Stored embeddings for video_id={video_id}")
    except PipelineCancelledError:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store embeddings for video_id={video_id}"
        )


def time_to_seconds(time_str: str) -> int:
    parts = time_str.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + int(s)
    elif len(parts) == 2:
        m, s = parts
        return int(m) * 60 + int(s)
    return 0


SIMILARITY_THRESHOLD = 0.70


def search(video_id: int, query: str, db: Session, n_results: int = 3, threshold: float = SIMILARITY_THRESHOLD) -> list:  
    try:
        collection = chroma_client.get_or_create_collection(
            name=f"video_{video_id}",
            metadata={"hnsw:space": "cosine"}
        )

        results = collection.query(
            query_embeddings=[get_embedding(query, is_query=True)],
            n_results=20,
        )

        seen = set()
        filtered = []

        for i in range(len(results["metadatas"][0])):
            raw_distance = results["distances"][0][i]
            score = round(1 - raw_distance, 4)
            print(f"[DEBUG] dist={raw_distance:.4f} | score={score:.4f} | {results['metadatas'][0][i]['sub_topic_name']}")

            if score < threshold:  
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
                "start_time": time_to_seconds(meta["start_time"]),
                "score": score
            })


        reranked = rerank_results(query, filtered)
        reranked = [r for r in reranked if r['rerank_score'] > 0.01]
        return reranked[:n_results]

    except Exception as e:
        raise_if_network_error(e, context="embedding search")
        logger.error(f"Search failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )