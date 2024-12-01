from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from db import models, schemas
from auth import verify_token
from db.database import SessionLocal
from datetime import datetime, timedelta, timezone

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/user_details")
def get_user_details(auth_token: str, db: Session = Depends(get_db)):
    # Verify the token and extract the email
    user_email = verify_token(auth_token)

    # Fetch user details from the database
    db_user = db.query(models.User).filter(models.User.email == user_email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Return user details
    return {
        "status": "success",
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email
    }
