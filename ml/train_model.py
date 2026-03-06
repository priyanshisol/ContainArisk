"""
ML Training Pipeline — train_model.py
--------------------------------------
Trains and evaluates a RandomForestClassifier on the historical shipment
dataset with proper 5-fold stratified cross-validation.

Usage (from project root):
    python ml/train_model.py

Outputs:
    ml/models/anomaly_detection_model.pkl   — trained RandomForest model
    ml/models/feature_stats.pkl             — feature engineering statistics
"""

import sys
import numpy as np
import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

# Ensure project root is on the path so we can import feature_engineering
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PROJECT_ROOT / "ml"))

from feature_engineering import (
    engineer_features,
    get_feature_and_target,
    save_stats,
)


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

DATA_PATH = _PROJECT_ROOT / "data" / "hackooo" / "Historical Data (1).csv"
MODEL_DIR = _PROJECT_ROOT / "ml" / "models"
MODEL_PATH = MODEL_DIR / "anomaly_detection_model.pkl"
STATS_PATH = MODEL_DIR / "feature_stats.pkl"


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def main():
    print("=" * 70)
    print("  SHIPMENT ANOMALY DETECTION — TRAINING PIPELINE")
    print("=" * 70)

    # ----- 1. Load Data -----
    print("\n[1/9] Loading historical dataset ...")
    df_raw = pd.read_csv(DATA_PATH)
    print(f"  Rows : {len(df_raw):,}")
    print(f"  Cols : {df_raw.shape[1]}")
    print(f"  Clearance distribution:\n{df_raw['Clearance_Status'].value_counts().to_string()}")

    # ----- 2. Feature Engineering -----
    print("\n[2/9] Engineering features (fit mode) ...")
    df_feat, stats = engineer_features(df_raw, fit_mode=True)
    print(f"  Feature columns : {df_feat.shape[1]}")
    print(f"  Rows            : {df_feat.shape[0]:,}")

    # ----- 3. Separate Features & Target -----
    print("\n[3/9] Separating features and target ...")
    X, y = get_feature_and_target(df_feat)
    print(f"  Features shape : {X.shape}")
    print(f"  Target balance : {y.value_counts().to_dict()}")
    print(f"  Anomaly rate   : {y.mean():.4f}")

    # ----- 4. Train / Test Split (80/20) -----
    print("\n[4/9] Splitting data (80/20, stratified) ...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        stratify=y,
        random_state=42,
    )
    print(f"  Train : {X_train.shape[0]:,} samples")
    print(f"  Test  : {X_test.shape[0]:,} samples")

    # ----- 5. Build Model (regularised RF) -----
    print("\n[5/9] Building RandomForest with regularisation ...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    print("  Parameters:")
    for k, v in model.get_params().items():
        if k in [
            "n_estimators", "max_depth", "min_samples_split",
            "min_samples_leaf", "max_features", "class_weight",
        ]:
            print(f"    {k:25s} = {v}")

    # ----- 6. 5-Fold Stratified Cross Validation -----
    print("\n[6/9] 5-fold Stratified Cross Validation ...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    cv_accuracy  = cross_val_score(model, X_train, y_train, cv=skf, scoring="accuracy",  n_jobs=-1)
    cv_precision = cross_val_score(model, X_train, y_train, cv=skf, scoring="precision", n_jobs=-1)
    cv_recall    = cross_val_score(model, X_train, y_train, cv=skf, scoring="recall",    n_jobs=-1)
    cv_f1        = cross_val_score(model, X_train, y_train, cv=skf, scoring="f1",        n_jobs=-1)

    print(f"\n  {'Metric':<15} {'Mean':>8} {'Std':>8}")
    print(f"  {'-'*33}")
    print(f"  {'Accuracy':<15} {cv_accuracy.mean():>8.4f} {cv_accuracy.std():>8.4f}")
    print(f"  {'Precision':<15} {cv_precision.mean():>8.4f} {cv_precision.std():>8.4f}")
    print(f"  {'Recall':<15} {cv_recall.mean():>8.4f} {cv_recall.std():>8.4f}")
    print(f"  {'F1 Score':<15} {cv_f1.mean():>8.4f} {cv_f1.std():>8.4f}")

    print(f"\n  Per-fold Accuracy : {np.round(cv_accuracy, 4)}")
    print(f"  Per-fold F1       : {np.round(cv_f1, 4)}")

    # ----- 7. Train on Full Training Set -----
    print("\n[7/9] Training model on full training set ...")
    model.fit(X_train, y_train)
    print("  Training complete.")

    # ----- 8. Evaluate on Held-Out Test Set -----
    print("\n[8/9] Evaluating on held-out test set ...")
    y_pred = model.predict(X_test)

    acc  = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec  = recall_score(y_test, y_pred, zero_division=0)
    f1   = f1_score(y_test, y_pred, zero_division=0)

    print(f"\n  Test Accuracy  : {acc:.4f}")
    print(f"  Test Precision : {prec:.4f}")
    print(f"  Test Recall    : {rec:.4f}")
    print(f"  Test F1 Score  : {f1:.4f}")

    print(f"\n  Mean CV Accuracy : {cv_accuracy.mean():.4f}")
    print(f"  Std  CV Accuracy : {cv_accuracy.std():.4f}")

    print("\n  Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"    {'':>10} Pred 0   Pred 1")
    print(f"    {'Actual 0':>10} {cm[0][0]:>6}   {cm[0][1]:>6}")
    print(f"    {'Actual 1':>10} {cm[1][0]:>6}   {cm[1][1]:>6}")

    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Normal", "Anomaly"], digits=4))

    # ----- 9. Feature Importance -----
    print("[9/9] Feature Importances (Top 20):")
    importances = pd.Series(model.feature_importances_, index=X_train.columns)
    importances = importances.sort_values(ascending=False)
    for i, (feat, imp) in enumerate(importances.head(20).items()):
        print(f"  {i+1:>3}. {feat:40s} {imp:.4f}")

    # ----- 10. Save Model & Stats -----
    print(f"\n{'='*70}")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, MODEL_PATH)
    print(f"  Model saved → {MODEL_PATH}")

    save_stats(stats, STATS_PATH)

    print(f"\n{'='*70}")
    print("  TRAINING COMPLETE")
    print(f"{'='*70}")


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    main()
