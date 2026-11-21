"""Tests for NLP Normalization module."""

import pytest
from backend.app.nlp.normalize import normalize_text, transliterate_uzbek_cyrillic

def test_apostrophe_unification():
    variations = [
        "ko‘ngil", "koʻngil", "ko'ngil", "ko`ngil", "koʼngil"
    ]
    normalized_results = [normalize_text(v) for v in variations]
    assert all(r == "ko'ngil" for r in normalized_results)

def test_repeated_characters_collapse():
    assert normalize_text("yoooordaaam") == "yordam"
    assert normalize_text("ayyyyyol") == "ayol"
    assert normalize_text("qoooo'rqyapman") == "qo'rqyapman"

def test_cyrillic_transliteration():
    cyrillic = "Эрим мени ўлдираман деб қўрқитди"
    latin = normalize_text(cyrillic)
    assert "erim meni o'ldiraman deb qo'rqitdi" in latin

def test_normalization_idempotency():
    samples = [
        "Ko‘nglim xira, nima qilishni bilmayapman... 😢",
        "Қайнонам ҳар куни ҳақорат қилади!",
        "yooordam beriiinglar илтимос!!!",
        "Pichoq bilan qo'rqityapti   ko'chaga haydadi"
    ]
    for s in samples:
        first = normalize_text(s)
        second = normalize_text(first)
        assert first == second, f"Idempotency failed for: {s}"
