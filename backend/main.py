from re import search

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from routers import read_apis
from db import models, schemas
from utils import hash_password, verify_password
from auth import create_access_token, verify_token
from db.database import SessionLocal
from routers import (
    update_apis,
    search,
    read,
    create_apis,
    delete_apis,
    get_user,
    read_apis,
    # rag_search,
)

app = FastAPI(
    title="FastAPI Boilerplate",
    description="A simple FastAPI boilerplate with routing setup",
    version="1.0.0",
)

app.include_router(update_apis.router, prefix="/update", tags=["Update"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(read.router, prefix="/read", tags=["Read"])
app.include_router(read_apis.router, prefix="/read2", tags=["Read2"])

app.include_router(create_apis.router, prefix="/create", tags=["Create"])

app.include_router(delete_apis.router, prefix="/delete", tags=["Delete"])


app.include_router(get_user.router, prefix="/get_user", tags=["User"])

# app.include_router(rag_search.router, prefix="/rag_search", tags=["RAG Search"])


# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Basic health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


# User registration endpoint
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = (
        db.query(models.User).filter(models.User.email == user.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before saving
    hashed_password = hash_password(user.password)
    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# User login endpoint
@app.post("/login")
def login(user: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    # If user doesn't exist or password is incorrect
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create an access token and return it
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# Protect routes with token authentication
@app.get("/protected")
def protected_route(user_email: str = Depends(verify_token)):
    return {"message": "You have access to this protected route", "user": user_email}
