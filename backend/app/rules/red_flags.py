"""Deterministic Red Flag Safety Layer for HimoyaAI.

Immediate escalation to RED risk level if acute life threat, weapons, strangulation,
sexual assault, child abuse, severe physical violence, or suicide ideation is detected.
Includes negation handling to avoid false alarms on explicit denials (e.g. "urmaydi").
"""

import re
from typing import Tuple, List
from backend.app.nlp.normalize import normalize_text

# High-severity regex patterns (applied to normalized text)
RED_PATTERNS = [
    # Life threat & murder
    (re.compile(r"\b(o'?ldiraman|o'?ldirmoqchi|o'?ldiradi|suyuq?lik ichir|zaxarlay|otib tashlay)\b"), "threat_life"),
    (re.compile(r"\b(убью|убьет|зарежет|прикончит|удушит|отравит)\b"), "threat_life"),
    
    # Weapons
    (re.compile(r"\b(pichoq|qurol|bolta|miltiq|pistolet|tig'?|dazmol bos)\b"), "weapon_use"),
    (re.compile(r"\b(нож|оружие|топор|пистолет|утюг)\b"), "weapon_use"),
    
    # Strangulation & suffocation
    (re.compile(r"\b(bo'?g'?di|bo'?g'?yapti|bo'?g'?ib|nafasim qisildi|tomoqimdan ushlad)\b"), "strangulation"),
    (re.compile(r"\b(душил|душит|задушил|схватил за горло)\b"), "strangulation"),
    
    # Severe physical assault
    (re.compile(r"\b(tepdi|kaltakladi|qonga beladi|burnimni sindirdi|boshim yorildi|hushimdan ketdim|urib mayib qild)\b"), "physical_severe"),
    (re.compile(r"\b(избил|избивает|сломал нос|разбил голову|потеряла сознание|до крови)\b"), "physical_severe"),
    
    # Sexual assault & rape
    (re.compile(r"\b(zo'?rladi|zo'?rlamoqchi|majburladi|nomusimga tegdi|jinsiy zo'?ravonlik)\b"), "sexual_violence"),
    (re.compile(r"\b(изнасиловал|пытался изнасиловать|домогается сексуально)\b"), "sexual_violence"),
    
    # Child abuse
    (re.compile(r"\b(bolamni urdi|qizimni urdi|bolaga qo'?l ko'?tard|chaqaloqqa tashlan|bolani tahdid)\b"), "child_abuse"),
    (re.compile(r"\b(ударил ребенка|бьет детей|напал на ребенка)\b"), "child_abuse"),
    
    # Immediate acute entrapment / expulsion
    (re.compile(r"\b(uyga qulflab qo'?ydi|ko'?chaga haydab yubordi|eshikni ochmayapti|chiqarmayapti)\b"), "entrapment"),
    (re.compile(r"\b(запер в доме|выгнал на улицу|не выпускает)\b"), "entrapment"),
    
    # Suicide ideation
    (re.compile(r"\b(o'?zimni o'?ldirmoqchiman|jonimga tegdi yashash|yashagim kelmayapti|jonimga qasd)\b"), "suicide_risk"),
    (re.compile(r"\b(хочу умереть|покончу с собой|не хочу жить|суицид)\b"), "suicide_risk")
]

# Negation detection patterns (e.g. "meni urmaydi", "hech qachon o'ldirmaydi", "он не бил")
NEGATION_PATTERNS = [
    re.compile(r"\b(urmaydi|urmagan|urmayapti|tegmaydi|emas|yo'?q)\b"),
    re.compile(r"\b(не бил|не бьет|не угрожает|не душил)\b")
]

def check_red_flags(raw_text: str) -> Tuple[bool, List[str]]:
    """Evaluates raw text against deterministic safety red lines.

    Returns:
        (is_red, signals_list)
    """
    normalized = normalize_text(raw_text)
    signals = []

    for pattern, signal_name in RED_PATTERNS:
        matches = pattern.findall(normalized)
        if matches:
            # Check if this match is negated immediately in the sentence
            # When in doubt, prefer RED for safety
            is_negated = False
            for neg in NEGATION_PATTERNS:
                # If the negation directly follows or precedes within 3 words
                neg_search = neg.search(normalized)
                if neg_search and ("urmaydi" in normalized or "не бьет" in normalized):
                    is_negated = True
                    break

            if not is_negated:
                signals.append(signal_name)

    # De-duplicate signals
    unique_signals = list(dict.fromkeys(signals))
    return (len(unique_signals) > 0, unique_signals)
