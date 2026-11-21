"""Core Configuration & Privacy Policy Settings for HimoyaAI."""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HimoyaAI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Model
    MODEL_PATH: str = os.getenv("MODEL_PATH", "ml/model_v1.joblib")
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 30
    RATE_LIMIT_SALT_TTL_SECONDS: int = 60
    
    # Privacy
    NO_LOG_MODE: bool = True
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
