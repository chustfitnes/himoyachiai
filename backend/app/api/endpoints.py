"""FastAPI Endpoint Router for HimoyaAI."""

import os
import json
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from backend.app.schemas.assessment import AssessmentRequest, AssessmentResponse
from backend.app.services.hybrid_classifier import classify_assessment
from backend.app.services.playbook_service import get_playbook

router = APIRouter()

CENTERS_FILE = os.path.join(os.path.dirname(__file__), "../../../data/centers.json")

def load_centers_data():
    if os.path.exists(CENTERS_FILE):
        try:
            with open(CENTERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

@router.post("/assess", response_model=AssessmentResponse)
async def assess_risk(payload: AssessmentRequest):
    """Zero-Log Risk Assessment API.

    Accepts text up to 4000 characters. Evaluates deterministic red flags and
    calibrated classifier. All processing is in-memory; no text is logged.
    """
    result = classify_assessment(payload.text)
    risk_level = result["risk_level"]
    confidence_pct = result["confidence_pct"]
    low_confidence = result["low_confidence"]
    signals = result["signals"]

    # Localized playbook
    lang = payload.lang or "uz-lat"
    playbook_data = get_playbook(risk_level, lang)

    return AssessmentResponse(
        risk_level=risk_level,
        confidence_pct=confidence_pct,
        low_confidence=low_confidence,
        signals=signals,
        playbook=playbook_data.get("content", {}),
        disclaimer=playbook_data.get("disclaimer", "HimoyaAI — yo‘naltiruvchi vosita."),
        model_version="v1.0-hybrid"
    )

@router.get("/centers")
async def list_centers(region: Optional[str] = Query(None), district: Optional[str] = Query(None)):
    """Directory of «Inson» social service centers and verified 24/7 emergency hotlines."""
    data = load_centers_data()
    regions = data.get("regions", [])
    hotlines = data.get("national_hotlines", [])

    if region:
        regions = [r for r in regions if r.get("region_id") == region or region.lower() in r.get("region_name_uz", "").lower()]

    if district:
        filtered_regions = []
        for r in regions:
            matching_centers = [c for c in r.get("centers", []) if district.lower() in c.get("district", "").lower()]
            if matching_centers:
                filtered_regions.append({**r, "centers": matching_centers})
        regions = filtered_regions

    return {
        "national_hotlines": hotlines,
        "regions": regions
    }

@router.get("/health")
async def health_check():
    """Liveness probe. Never returns sensitive state."""
    return {
        "status": "healthy",
        "service": "HimoyaAI",
        "version": "1.0.0",
        "privacy": "Zero-Log RAM-Only"
    }
