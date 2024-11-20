from fastapi import FastAPI
from routers import example
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User, SessionLocal
from utils import hash_password, verify_password
from auth import create_access_token, verify_token

app = FastAPI(
    title="FastAPI Boilerplate",
    description="A simple FastAPI boilerplate with routing setup",
    version="1.0.0",
)

# Register routers
app.include_router(example.router)

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



@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    hashed_pwd = hash_password(password)
    user = User(username=username, hashed_password=hashed_pwd)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/secure-endpoint")
def secure_endpoint(token: str = Depends(verify_token)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"message": "You are authenticated!"}

