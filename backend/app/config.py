import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Explicitly load .env file
load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "DermaScan AI API"
    DEBUG: bool = True
    SECRET_KEY: str = "local-development-secret-key-change-in-prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database URL: defaults to local SQLite file
    DATABASE_URL: str = "sqlite:///./dermascan.db"
    
    # Gemini API
    GEMINI_API_KEY: str = ""
    
    # Cloudinary Integration
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Setup default SQLite database URL if DATABASE_URL is not set or empty
if not settings.DATABASE_URL:
    settings.DATABASE_URL = "sqlite:///./dermascan.db"
elif settings.DATABASE_URL.startswith("postgres://"):
    # Fix Heroku/Railway postgres url protocol difference
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)
