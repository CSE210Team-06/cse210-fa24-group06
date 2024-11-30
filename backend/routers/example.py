from fastapi import APIRouter

router = APIRouter()

@router.get("/items/{item_id}", tags=["Items"])
def read_item(item_id: int, q: str = None):
    """
    Retrieve an item by its ID.
    """
    return {"item_id": item_id, "query": q}
