"""HimoyaAI FastAPI Main Application Entrypoint."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMouter = None
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.privacy import SecurityHeadersMiddleware, PrivacyLoggingFilter
from backend.app.api.endpoints import router as api_router

# Attach privacy logging filter to root logger
root_logger = logging.getLogger()
root_logger.addFilter(PrivacyLoggingFilter())

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HimoyaAI — 100% Anonymous Risk Assessment & Routing API for Uzbekistan",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Security & Privacy Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "HimoyaAI API is running. Zero-Log RAM-Only active.",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    # Enforce --no-access-log as mandated by Master Prompt
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True, access_log=False)
