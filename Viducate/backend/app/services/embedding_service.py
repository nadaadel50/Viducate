import logging
import chromadb
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
chroma_client = chromadb.PersistentClient(path="./chroma_db")

def get_embedding(text: str) -> list:
    embedding = model.encode(text)
    return embedding.tolist()

def store_embeddings(video_id: int, segments: list) -> None:
    collection = chroma_client.get_or_create_collection(
        name=f"video_{video_id}"
    )
    
    count=0
    for segment in segments:
        for sub_topic in segment.get("sub_topics", []):
            text = f"{segment['main_topic']} {segment['title']} {sub_topic['name']} {sub_topic['description']}"
            if segment.get("slide_content"):
                text += f" {segment['slide_content']}"
            embedding = get_embedding(text)
            
            collection.add(
                ids=[f"{video_id}_{segment['segment_number']}_{sub_topic['name']}"],
                embeddings=[embedding],
                documents=[text],
                metadatas=[{
                    "video_id": video_id,
                    "segment_number": segment["segment_number"],
                    "start_time": segment["start_time"],
                    "end_time": segment["end_time"],
                    "main_topic": segment["main_topic"],
                    "title": segment["title"],
                    "sub_topic_name": sub_topic["name"]
                }]
            )
            count += 1
    print(f"[Embeddings] Total sub_topics embedded: {count}")
    logger.info(f"[Embeddings] Stored embeddings for video_id={video_id}")


def search(video_id: int, query: str, n_results: int = 5) -> list:
    collection = chroma_client.get_or_create_collection(
        name=f"video_{video_id}"
    )
    
    query_embedding = get_embedding(query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    return [
        {
            "segment_number": results["metadatas"][0][i]["segment_number"],
            "start_time": results["metadatas"][0][i]["start_time"],
            "end_time": results["metadatas"][0][i]["end_time"],
            "main_topic": results["metadatas"][0][i]["main_topic"],
            "title": results["metadatas"][0][i]["title"],
            "sub_topic_name": results["metadatas"][0][i]["sub_topic_name"],
            "score": results["distances"][0][i]
        }
        for i in range(len(results["metadatas"][0]))
    ]