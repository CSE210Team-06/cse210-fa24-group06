"""
Test router for FastAPI. Only serves as a syntax example and not for running.

Functions:
    read_item: Retrieve an item by its ID.

Attributes:
    router: FastAPI router for the example.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/items/{item_id}", tags=["Items"])
def read_item(item_id: int, q: str = None):
    """
    Retrieve an item by its ID.

    Args:
        item_id (int): ID of the item.
        q (str): Query string.
    
    Returns:
        dict: Item ID and query string
    """
    return {"item_id": item_id, "query": q}
