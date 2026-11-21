"""Model Evaluation and CI Gate for HimoyaAI.

Evaluates trained model on unseen test_holdout split.
Enforces Model Gate: RED class recall must be >= 0.95!
"""

import os
import sys
import json
import joblib
from sklearn.metrics import classification_report, confusion_matrix, recall_score, f1_score

def evaluate():
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, "model_v1.joblib")
    holdout_path = os.path.join(base_dir, "data/test_holdout/dataset.json")

    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}. Run train.py first.")
        sys.exit(1)

    print(f"Loading holdout dataset from {holdout_path}...")
    with open(holdout_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    X_test = [item["text"] for item in data]
    y_test = [item["label"] for item in data]

    print(f"Loaded {len(X_test)} unseen test samples.")
    model = joblib.load(model_path)

    y_pred = model.predict(X_test)

    print("\n==============================================")
    print("      HIMOYA AI — HOLDOUT EVALUATION          ")
    print("==============================================")
    report = classification_report(y_test, y_pred, digits=4)
    print(report)

    cm = confusion_matrix(y_test, y_pred, labels=["green", "yellow", "red"])
    print("Confusion Matrix (Green, Yellow, Red):")
    print(cm)

    # Check Red class recall
    red_recall = recall_score(y_test, y_pred, labels=["red"], average="micro")
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    print(f"\nRED CLASS RECALL: {red_recall:.4f} (Required Threshold >= 0.95)")
    print(f"MACRO F1 SCORE:   {macro_f1:.4f}")

    if red_recall < 0.95:
        print("\n[FAILED] CI MODEL GATE: Red recall is below 0.95 threshold!")
        sys.exit(1)
    else:
        print("\n[PASSED] CI MODEL GATE: Safety standards fully verified.")

if __name__ == "__main__":
    evaluate()
