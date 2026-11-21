"""Scikit-Learn ML Training Pipeline for HimoyaAI.

Architecture:
- FeatureUnion of Word N-Grams (1-2) + Character N-Grams (2-5) for typo resilience
- Logistic Regression (class_weight='balanced')
- CalibratedClassifierCV (isotonic / sigmoid) for reliable confidence estimates
- Saves model to ml/model_v1.joblib
"""

import os
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, f1_score

def load_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    texts = [item["text"] for item in data]
    labels = [item["label"] for item in data]
    return texts, labels

def build_pipeline():
    # Word n-grams (1, 2)
    word_vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=4000,
        sublinear_tf=True
    )
    # Character n-grams (2, 5) for Uzbek morphology & SMS typos
    char_vectorizer = TfidfVectorizer(
        analyzer="char",
        ngram_range=(2, 5),
        max_features=8000,
        sublinear_tf=True
    )

    features = FeatureUnion([
        ("word", word_vectorizer),
        ("char", char_vectorizer)
    ])

    base_lr = LogisticRegression(
        C=2.0,
        class_weight="balanced",
        max_iter=500,
        random_state=42
    )

    calibrated_clf = CalibratedClassifierCV(
        estimator=base_lr,
        method="sigmoid",
        cv=3
    )

    model = Pipeline([
        ("features", features),
        ("classifier", calibrated_clf)
    ])
    return model

def train():
    base_dir = os.path.dirname(__file__)
    train_path = os.path.join(base_dir, "data/train/dataset.json")
    val_path = os.path.join(base_dir, "data/val/dataset.json")

    print(f"Loading training data from {train_path}...")
    X_train, y_train = load_data(train_path)
    X_val, y_val = load_data(val_path)

    print(f"Training set: {len(X_train)} samples | Validation set: {len(X_val)} samples")
    model = build_pipeline()

    print("Fitting FeatureUnion + Calibrated Logistic Regression...")
    model.fit(X_train, y_train)

    # Evaluate on validation
    y_pred = model.predict(X_val)
    macro_f1 = f1_score(y_val, y_pred, average="macro")
    print("\n--- Validation Performance ---")
    print(classification_report(y_val, y_pred))
    print(f"Macro F1 Score: {macro_f1:.4f}")

    output_path = os.path.join(base_dir, "model_v1.joblib")
    joblib.dump(model, output_path)
    print(f"Model successfully saved to {output_path}")

if __name__ == "__main__":
    train()
