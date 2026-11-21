"""Tests for Deterministic Red Flag safety rules."""

import pytest
from backend.app.rules.red_flags import check_red_flags

def test_life_threat_triggers_red():
    is_red, signals = check_red_flags("Erim o'ldiraman deb pichoq o'qtaldi")
    assert is_red is True
    assert "threat_life" in signals or "weapon_use" in signals

def test_strangulation_triggers_red():
    is_red, signals = check_red_flags("Bo'g'ib qo'ydi, nafasim qisildi")
    assert is_red is True
    assert "strangulation" in signals

def test_child_abuse_triggers_red():
    is_red, signals = check_red_flags("Kichkina qizimni urdi va yig'latdi")
    assert is_red is True
    assert "child_abuse" in signals

def test_suicide_ideation_triggers_red():
    is_red, signals = check_red_flags("Yashagim kelmayapti, jonimga qasd qilmoqchiman")
    assert is_red is True
    assert "suicide_risk" in signals

def test_negation_not_false_alarm():
    # If the user says he does NOT hit me
    is_red, signals = check_red_flags("Erim meni urmaydi, lekin biroz tortishib qoldik")
    assert is_red is False
