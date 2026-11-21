"""Playbook retrieval service for localized action guides."""

import json
import os
from typing import Dict, Any

PLAYBOOK_DIR = os.path.join(os.path.dirname(__file__), "../../../content/playbooks")

def get_playbook(level: str, lang: str = "uz-lat") -> Dict[str, Any]:
    """Loads localized playbook for the given risk level (green, yellow, red)."""
    normalized_lang = "uz_lat"
    if lang in ["uz-cyr", "uz_cyr"]:
        normalized_lang = "uz_cyr"
    elif lang in ["ru", "rus"]:
        normalized_lang = "ru"

    file_path = os.path.join(PLAYBOOK_DIR, f"{normalized_lang}.json")
    
    # Fallback to uz_lat if file missing
    if not os.path.exists(file_path):
        file_path = os.path.join(PLAYBOOK_DIR, "uz_lat.json")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            playbook_level = data.get("levels", {}).get(level, {})
            return {
                "disclaimer": data.get("disclaimer", ""),
                "content": playbook_level
            }
    except Exception:
        return {
            "disclaimer": "HimoyaAI — yo‘naltiruvchi vosita. Favqulodda xavfda 102 yoki 1146 ga qo‘ng‘iroq qiling.",
            "content": {"level": level}
        }
