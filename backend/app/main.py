from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    description="A modern RESTful API for personal expense and budget management.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 router
app.include_router(api_router)


@app.get("/", tags=["Root"])
def read_root():
    """Return welcome message and API meta."""
    return {
        "name": settings.APP_NAME,
        "status": "online",
        "version": "0.1.0",
        "documentation": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.APP_ENV
    }
