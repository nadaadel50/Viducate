import chromadb

chroma_client = chromadb.PersistentClient(path="./chroma_db")

collection = chroma_client.get_or_create_collection(name="video_48")

results = collection.get(include=["embeddings", "documents", "metadatas"])

print(f"Total stored: {len(results['ids'])}")
print("\n--- First 2 items ---")
for i in range(min(2, len(results['ids']))):
    print(f"\nID: {results['ids'][i]}")
    print(f"Metadata: {results['metadatas'][i]}")
    print(f"Document: {results['documents'][i][:100]}...")
    print(f"Embedding (first 5 numbers): {results['embeddings'][i][:5]}")