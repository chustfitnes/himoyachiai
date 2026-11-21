"""Hybrid Risk Classification Engine for HimoyaAI.

Combines deterministic safety red flags with calibrated ML probability outputs
and conservative escalation logic.
"""

import os
from typing import Dict, Any, Tuple
from backend.app.nlp.normalize import normalize_text
from backend.app.rules.red_flags import check_red_flags

# Optional scikit-learn model loader
_MODEL = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../../ml/model_v1.joblib")

def get_model():
    global _MODEL
    if _MODEL is None and os.path.exists(MODEL_PATH):
        try:
            import joblib
            _MODEL = joblib.load(MODEL_PATH)
        except Exception:
            _MODEL = None
    return _MODEL

# Medium risk keyword patterns (psychological/economic control, harassment, threats)
YELLOW_KEYWORDS = [
    "tahdid", "qo'rqit", "pul bermayapti", "pulimni oldi", "ishlashga qo'ymayapti",
    "kamsityapti", "haqorat qilyapti", "telefonimni tekshir", "tashqariga chiqarmay",
    "dugonalarim bilan gaplash", "ajrashmoqchiman", "tazyiq", "shantaj", "rasmimni tarqat",
    "угрожает", "оскорбляет", "не дает деньги", "забирает зарплату", "запрещает выходить",
    "проверяет телефон", "следит за мной", "шантажирует", "манипулирует"
]

def fallback_ml_predict(normalized_text: str) -> Tuple[str, float, Dict[str, float]]:
    """Deterministic fallback scoring when scikit-learn model artifact is not loaded."""
    words = normalized_text.split()
    yellow_hits = sum(1 for kw in YELLOW_KEYWORDS if kw in normalized_text)
    
    if yellow_hits >= 1:
        prob_yellow = min(0.65 + yellow_hits * 0.08, 0.90)
        prob_green = (1.0 - prob_yellow) * 0.7
        prob_red = 1.0 - prob_yellow - prob_green
        return "yellow", prob_yellow, {"green": prob_green, "yellow": prob_yellow, "red": prob_red}

    # Default to calm/green
    return "green", 0.78, {"green": 0.78, "yellow": 0.18, "red": 0.04}

def classify_assessment(text: str) -> Dict[str, Any]:
    """Master hybrid assessment pipeline.

    Order:
    1. Short/Vague text guard (< 5 chars or < 2 words).
    2. Deterministic Red Flag safety gate (immediate RED).
    3. ML / Feature Classifier (Calibrated probabilities).
    4. Conservative escalation rule (safe-by-design).
    """
    clean_text = text.strip()
    normalized = normalize_text(clean_text)
    words = normalized.split()

    # Step 1: Too short / vague text guard
    if len(clean_text) < 5 or len(words) < 2:
        return {
            "risk_level": "yellow",
            "confidence_pct": 50,
            "low_confidence": True,
            "signals": ["short_text_prompt"],
            "clarification_prompt": "Yana biroz batafsil yozib bera olasizmi? Vaziyatingizni to‘liqroq tushunishga yordam beradi."
        }

    # Step 2: Deterministic Red Flag Layer
    is_red, red_signals = check_red_flags(clean_text)
    if is_red:
        return {
            "risk_level": "red",
            "confidence_pct": 98,
            "low_confidence": False,
            "signals": red_signals,
            "rule_triggered": True
        }

    # Step 3: ML Classifier
    model = get_model()
    pred_level = "green"
    confidence = 0.75
    probs = {"green": 0.75, "yellow": 0.20, "red": 0.05}

    if model is not None:
        try:
            proba = model.predict_proba([normalized])[0]
            # classes assumed to be ['green', 'yellow', 'red']
            classes = list(model.classes_)
            probs = {cls: float(p) for cls, p in zip(classes, proba)}
            pred_level = model.predict([normalized])[0]
            confidence = probs.get(pred_level, 0.7)
        except Exception:
            pred_level, confidence, probs = fallback_ml_predict(normalized)
    else:
        pred_level, confidence, probs = fallback_ml_predict(normalized)

    # Step 4: Conservative Escalation Logic
    # If confidence < 0.60 or red probability >= 0.25 -> escalate 1 step up
    low_confidence = False
    final_level = pred_level

    red_prob = probs.get("red", 0.0)
    max_prob = max(probs.values())

    if red_prob >= 0.25 and final_level != "red":
        final_level = "red" if final_level == "yellow" else "yellow"
        low_confidence = True
    elif max_prob < 0.60:
        low_confidence = True
        if final_level == "green":
            final_level = "yellow"

    detected_signals = []
    if final_level == "yellow":
        detected_signals.append("psychological_or_economic_pressure")
    elif final_level == "red":
        detected_signals.append("elevated_safety_risk")
    else:
        detected_signals.append("emotional_distress_mild")

    return {
        "risk_level": final_level,
        "confidence_pct": int(round(confidence * 100)),
        "low_confidence": low_confidence,
        "signals": detected_signals,
        "rule_triggered": False
    }
