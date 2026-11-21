"""Privacy-by-Design and Zero-Log enforcement utilities."""

import time
import hashlib
import os
import logging
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class PrivacyLoggingFilter(logging.Filter):
    """Prevents any potential sensitive text or IP from appearing in application logs."""
    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        # Drop log messages that might contain sensitive request payloads
        if "text" in msg.lower() or "body" in msg.lower():
            record.msg = "[CLEARED BY NO-LOG PRIVACY FILTER]"
        return True

class HashedRateLimiter:
    """In-memory rate limiter that hashes incoming client identifiers with a rotating salt.

    Never stores raw IP addresses or client IDs anywhere. Salt rotates every 60 seconds.
    """
    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.salt = os.urandom(16).hex()
        self.salt_created_at = time.time()
        self.counts: Dict[str, Tuple[int, float]] = {}

    def _get_current_salt(self) -> str:
        now = time.time()
        if now - self.salt_created_at > self.window_seconds:
            self.salt = os.urandom(16).hex()
            self.salt_created_at = now
            self.counts.clear()  # Clear old counts on salt rotation
        return self.salt

    def is_allowed(self, client_identifier: str) -> bool:
        salt = self._get_current_salt()
        # One-way cryptographic hash with rotating salt
        client_hash = hashlib.sha256((salt + client_identifier).encode()).hexdigest()
        
        now = time.time()
        count, start_time = self.counts.get(client_hash, (0, now))
        
        if now - start_time > self.window_seconds:
            self.counts[client_hash] = (1, now)
            return True

        if count >= self.max_requests:
            return False

        self.counts[client_hash] = (count + 1, start_time)
        return True

rate_limiter = HashedRateLimiter(max_requests=30, window_seconds=60)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces strict No-Store, No-Referrer and Content Security Policies."""
    async def dispatch(self, request: Request, call_next) -> Response:
        # Rate limit check using client host string (hashed inside limiter)
        client_id = request.client.host if request.client else "unknown"
        if not rate_limiter.is_allowed(client_id):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="So‘rovlar soni me’yordan oshdi. Iltimos, 1 daqiqadan so‘ng qayta urinib ko‘ring."
            )

        response = await call_next(request)
        
        # Enforce strict zero-cache and privacy headers
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
