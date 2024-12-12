from fastapi import APIRouter
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from transformers import pipeline
import google.generativeai as genai
import torch

BASEDIR = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(BASEDIR, "..", ".env"))

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

router = APIRouter()


client = QdrantClient(
    url=os.getenv("QDRANT_CLUSTER_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

collection_name = "lectures210"


async def search_lectures(query, top_k=5):
    try:
        print("before embedding")
        query_embedding = await get_embeddings([query])
        print("after embedding")

        search_result = client.search(
            collection_name=collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True,
            query_filter={},
        )

        print(f"Found {len(search_result)} results")
        return search_result
    except Exception as error:
        print(f"Error: {error}")
        return []


async def get_embeddings(texts):
    embedder = pipeline(
        "feature-extraction",
        model="sentence-transformers/all-MiniLM-L6-v2",
    )
    text_array = texts if isinstance(texts, list) else list(texts.values())
    print(text_array)

    embedding = embedder(text_array, truncation=True)
    embedding_tensor = torch.tensor(embedding)
    squeezed_embedding = embedding_tensor.squeeze(0).squeeze(0)
    final_embedding = squeezed_embedding.mean(dim=0)
    return final_embedding.tolist()


def gemini(prompt):
    response = model.generate_content(prompt)
    return response.text


@router.get("/get_prof_response")
async def get_prof_response(user_message: str):
    """
    Get message back from AI Prof Powell
    """

    print("before results")

    results = await search_lectures(user_message)

    print("after results")

    lecture_content = ""
    headings, urls = [], []
    for index, result in enumerate(results):
        lecture_content += (
            f"Extract {index + 1}:\n"
            f"{result.payload.get('text', '')}\n"
            "-----------------------------------------------\n\n"
        )

        if result.payload["heading"] not in headings:
            headings.append(result.payload["heading"])

        if result.payload["url"] not in urls:
            urls.append(result.payload["url"])

    # print(lecture_content)

    prompt = f"""
You are an AI version of Professor Thomas Powell, who is a CS professor at UC San Diego and takes a Software Engineering class.
You are given relevant text content extracted from the professor's lecture notes, along with a user query.
Answer the user query based on the context.
If the answer to the question doesn't seem to be in the information given, return "Sorry, I don't know the answer to this. You should ask Prof. Powell!".
It's okay to endorse any of the context. Talk as if you are affiliated with the context.
Return the answer with properly formatted markdown syntax. Don't be too verbose.

User query:
{user_message}

Relevant Lecture Content:
{lecture_content}
"""  # noqa E501

    gemini_response = gemini(prompt)
    if gemini_response:
        print(gemini_response)

    return {
        "status": "success",
        "message": gemini_response,
        "urls": urls,
        "headings": headings,
    }
