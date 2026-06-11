import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, scans, routine, products, chat

# Auto-create tables on startup (no alembic needed for initial SQLite/PostgreSQL runs)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for user auth, AI skin analysis, and diagnostics storage.",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS configuration to allow local React app development connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads static directory
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(STATIC_DIR, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include Routers under standard /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(scans.router, prefix="/api")
app.include_router(routine.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "docs_url": "/docs" if settings.DEBUG else None
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
