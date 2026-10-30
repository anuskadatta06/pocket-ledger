from fastapi import FastAPI
from app.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="A modern RESTful API for personal expense and budget management.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
