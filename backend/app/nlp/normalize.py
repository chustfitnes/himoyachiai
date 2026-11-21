"""NLP Normalization module for HimoyaAI.

Handles Uzbek Latin, Cyrillic, Russian loanwords, apostrophe unification,
repeated character collapsing, and whitespace cleaning with idempotency.
"""

import unicodedata
import re

# Standardize all Uzbek apostrophe variants to standard single quote '
APOSTROPHE_PATTERN = re.compile(r"[\u02BB\u02BC\u02BD\u02BE\u2018\u2019\u201A\u201B\u0060\u00B4ʻʼ`]")

# Uzbek Cyrillic to Latin mapping
CYRILLIC_TO_LATIN_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
    'ъ': "'", 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ў': "o'", 'қ': 'q', 'ғ': "g'", 'ҳ': 'h'
}

# Regex to collapse 3+ repeated characters down to 1 or 2 (e.g. ayyyyyol -> ayol)
REPEATED_CHARS_PATTERN = re.compile(r"(.)\1{2,}")

def transliterate_uzbek_cyrillic(text: str) -> str:
    """Convert Uzbek Cyrillic text to Latin while preserving emojis and special markers."""
    result = []
    text_lower = text.lower()
    i = 0
    n = len(text_lower)
    while i < n:
        char = text_lower[i]
        if char in CYRILLIC_TO_LATIN_MAP:
            result.append(CYRILLIC_TO_LATIN_MAP[char])
        else:
            result.append(char)
        i += 1
    return "".join(result)

def normalize_text(text: str) -> str:
    """Idempotent normalization pipeline for Uzbek & Russian inputs.

    Guarantees: normalize_text(normalize_text(x)) == normalize_text(x)
    """
    if not text:
        return ""

    # 1. Unicode NFKC
    clean = unicodedata.normalize("NFKC", text)

    # 2. Lowercase
    clean = clean.lower()

    # 3. Unify apostrophes to standard '
    clean = APOSTROPHE_PATTERN.sub("'", clean)

    # 4. Transliterate Uzbek Cyrillic characters to Latin
    clean = transliterate_uzbek_cyrillic(clean)

    # 5. Collapse repeated characters (3 or more -> 1, e.g. yoooordaaam -> yordam)
    clean = REPEATED_CHARS_PATTERN.sub(r"\1", clean)

    # 6. Normalize multiple spaces and linebreaks to single space
    clean = re.sub(r"\s+", " ", clean).strip()

    return clean
