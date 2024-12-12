"""
This module contains the main FastAPI application and routing setup, including user endpoints for registration and login.

Functions:
    get_db: Dependency to get the DB session
    health_check: Basic health check endpoint
    signup: User registration endpoint
    login: User login endpoint
    protected_route: Protect routes with token authentication

Attributes:
    app: FastAPI object for the main application.
"""

import sys

sys.path.append("../")
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import models, schemas
from backend.utils import hash_password, verify_password
from backend.auth import create_access_token, verify_token
from backend.db.database import SessionLocal
from backend.routers import (
    update_apis,
    search,
    read,
    create_apis,
    delete_apis,
    get_user,
    read_apis,
    rag_search,
    ai_prof,
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

app.include_router(rag_search.router, prefix="/rag_search", tags=["RAG Search"])

app.include_router(ai_prof.router, prefix="/ai_prof", tags=["AI Prof Powell"])


# Dependency to get the DB session
def get_db():
    """
    Retrieves the DB session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Basic health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """
    Sends a GET request to check if the server is running

    Returns:
        dict: A dictionary with the status "ok"
    """
    return {"status": "ok"}


# User registration endpoint
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Sends a POST request to register a new user, and saves the user details to the database. 
    The password is hashed before saving.

    Args:
        user (schemas.UserCreate): The user registration details
        db (Session, optional): The database session. Defaults to Depends(get_db).
    
    Returns:
        models.User: The registered user details
    """
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
    """
    Sends a POST request to login a user, and returns an access token if the user exists and the password is correct.

    Args:
        user (schemas.LoginRequest): The user login details
        db (Session, optional): The database session. Defaults to Depends(get_db).
    
    Returns:
        dict: The access token and token type
    """
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
    """
    A protected route that requires a valid access token to access.
    
    Args:
        user_email (str, optional): The user email decoded from the access token. Defaults to Depends(verify_token).
    
    Returns:
        dict: A message confirming access to the protected route, and the user email
    """
    return {"message": "You have access to this protected route", "user": user_email}
