from fastapi import FastAPI
from .routers import example

app = FastAPI(
    title="FastAPI Boilerplate",
    description="A simple FastAPI boilerplate with routing setup",
    version="1.0.0",
)

# Register routers
app.include_router(example.router)


# Basic health check
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
