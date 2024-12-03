from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from db import models
from db.database import SessionLocal
from auth import verify_token
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from auth import verify_token


router = APIRouter()

embedding_model = None
faiss_index = faiss.IndexFlatL2(384)  # Vector search index
entry_metadata = []  # To store metadata for each entry
MODEL_PATH = "sentence-transformers/all-MiniLM-L6-v2"  # Model directory path
# To store metadata for each entry




def check_model_downloaded():
    """
    Check if the SentenceTransformer model has been downloaded.
    """
    global embedding_model
    if not embedding_model:
        try:
            embedding_model = SentenceTransformer(MODEL_PATH)
        except Exception as e:
            print(e)
            return False
    return True

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def embed_and_index(auth_token: str, db: Session = Depends(get_db)):
    """
    Embed all user's entries and index them for vector search.
    """
    # Verify the token and get user email
    user_email = verify_token(auth_token)

    # Fetch user's journals and entries
    db_journals = db.query(models.Journal).filter(models.Journal.user.has(email=user_email)).all()
    if not db_journals:
        raise HTTPException(status_code=404, detail="No journals found for the user")

    # Iterate over journals and entries to embed and index
    for journal in db_journals:
        entries = db.query(models.Entry).filter(models.Entry.journal_id == journal.journal_id).all()
        for entry in entries:
            # Generate embedding for the entry text
            embedding = embedding_model.encode(entry.entry_text).astype(np.float32)

            # Add the embedding to FAISS index
            faiss_index.add(np.array([embedding]))

            # Store metadata for this entry
            entry_metadata.append({
                "journal_id": journal.journal_id,
                "journal_title": journal.journal_title,
                "entry_id": entry.entry_id,
                "page_number": entry.page_number,
                "entry_text": entry.entry_text
            })

    return {"status": "success", "message": "User's entries have been embedded and indexed"}


@router.post("/vector_search")
def vector_search(auth_token: str, query: str, db: Session = Depends(get_db)):
    """
    Perform a vector search for the query text across all user's entries.
    """
    # Verify the token and get user email

    if not check_model_downloaded():
        return {"status": "failed", "message": "Model weights not downloaded. Please download them to proceed."}

    embed_and_index(auth_token, db)  # Embed and index if not already done

    # Check if data has been indexed
    if not entry_metadata:
        raise HTTPException(status_code=400, detail="No data indexed for vector search. Please index first.")

    # Generate embedding for the query
    query_embedding = embedding_model.encode(query).astype(np.float32)

    # Perform FAISS search
    k = 5  # Top 5 results
    distances, indices = faiss_index.search(np.array([query_embedding]), k)

    # Collect matching metadata
    results = []
    for idx, distance in zip(indices[0], distances[0]):
        if idx < len(entry_metadata):  # Ensure index is valid
            metadata = entry_metadata[idx]
            results.append({
                "journal_id": int(metadata["journal_id"]),  # Convert to Python int
                "journal_title": metadata["journal_title"],
                "entry_id": int(metadata["entry_id"]),  # Convert to Python int
                "page_number": int(metadata["page_number"]),  # Convert to Python int
                "entry_text_snippet": metadata["entry_text"][:100],  # Provide a text snippet
                "relevance_score": float(round(1 / (1 + distance), 2))  # Convert to Python float
            })

    if not results:
        return {"status": "success", "message": "No relevant entries found"}

    return {"status": "success", "query": query, "matches": results}

