"""Proof-of-Privacy & Zero-Log Invariant Tests for HimoyaAI."""

import uuid
import os
import glob
from backend.app.services.hybrid_classifier import classify_assessment

def test_sentinel_not_stored_anywhere():
    # 1. Generate unique random sentinel string
    sentinel_token = f"SENTINEL_TOKEN_{uuid.uuid4().hex}"
    test_text = f"Mening maxfiy murojaatim: {sentinel_token}. Erim juda qattiq haqorat qilmoqda."

    # 2. Run through assessment engine
    result = classify_assessment(test_text)

    # 3. Assert result output NEVER reflects user's raw text
    for signal in result.get("signals", []):
        assert sentinel_token not in signal, "User text leaked into signals!"

    # 4. Search entire project directory to prove sentinel text was not written to any file or database
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    found_in_files = []

    for root, _, files in os.walk(workspace_root):
        # Skip this test file itself, git, and virtualenvs
        if ".git" in root or "__pycache__" in root or "node_modules" in root or ".pytest_cache" in root:
            continue
        for file in files:
            if file.endswith((".log", ".txt", ".json", ".sqlite", ".db")):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        if sentinel_token in content:
                            found_in_files.append(filepath)
                except Exception:
                    pass

    assert len(found_in_files) == 0, f"Privacy violation! Sentinel found in: {found_in_files}"

def test_static_code_check_no_database_drivers():
    """Verifies that no persistent database drivers or writes exist in the backend codebase."""
    backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    banned_tokens = ["sqlite3", "psycopg2", "pymongo", "sqlalchemy", "INSERT INTO", "UPDATE ", "DELETE FROM"]
    
    violations = []
    for root, _, files in os.walk(backend_root):
        if "__pycache__" in root:
            continue
        for file in files:
            if file.endswith(".py"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    for token in banned_tokens:
                        if token in content:
                            violations.append(f"{file} contains '{token}'")

    assert len(violations) == 0, f"Database persistence banned in No-Log architecture! Found: {violations}"
