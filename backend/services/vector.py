# services/vector.py
import os
from chromadb import PersistentClient

CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma")

client = PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection(name="impify_docs")

def add_chunks(doc_id: str, chunks: list[str], embeddings: list[list[float]]):
    ids = [f"{doc_id}-{i}" for i in range(len(chunks))]
    metas = [{"doc_id": doc_id, "ord": i} for i in range(len(chunks))]
    collection.add(ids=ids, documents=chunks, metadatas=metas, embeddings=embeddings)

def has_any(doc_id: str) -> bool:
    res = collection.get(where={"doc_id": doc_id}, limit=1)
    return len(res.get("ids", [])) > 0

def query(text: str, k: int = 6) -> list[str]:
    q = collection.query(query_texts=[text], n_results=k)
    return q.get("documents", [[]])[0]

def search(query_text: str, k: int = 6) -> list[str]:
    q = collection.query(query_texts=[query_text], n_results=k)
    return q.get("documents", [[]])[0]
