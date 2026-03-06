"""
risk_engine.py
--------------
Loads the trained ensemble ML model and exposes a `predict_risk()` function
that applies the exact same feature engineering used in ml/train.py, then
returns a risk_score (0-100) and a risk_level string.
"""

from pathlib import Path
import numpy as np
import pandas as pd
import joblib

# ---------------------------------------------------
# Model path (relative to this file → app/ → backend/ → models/)
# ---------------------------------------------------

_MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
_MODEL_PATH = _MODELS_DIR / "risk_model.joblib"

# Lazy-loaded model package
_model_package = None


def _load_model():
    global _model_package
    if _model_package is None:
        if not _MODEL_PATH.exists():
            raise FileNotFoundError(
                f"ML model not found at {_MODEL_PATH}. "
                "Please run 'python ml/train.py' first to train and save the model."
            )
        _model_package = joblib.load(_MODEL_PATH)
    return _model_package


# ---------------------------------------------------
# Feature Engineering (mirrors ml/train.py exactly)
# ---------------------------------------------------

def _build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Prevent division by zero
    df["Declared_Weight"] = df["Declared_Weight"].replace(0, 1)

    # Weight features
    df["weight_difference"] = df["Measured_Weight"] - df["Declared_Weight"]
    df["weight_ratio"] = df["Measured_Weight"] / df["Declared_Weight"]
    df["weight_deviation_percent"] = (
        abs(df["weight_difference"]) / df["Declared_Weight"]
    )

    # Value features
    df["value_weight_ratio"] = df["Declared_Value"] / df["Declared_Weight"]
    df["log_value_weight_ratio"] = np.log1p(df["value_weight_ratio"])

    # Time features - handle both datetime strings and already parsed datetimes
    if "Declaration_Date (YYYY-MM-DD)" in df.columns:
        date_col = "Declaration_Date (YYYY-MM-DD)"
    else:
        date_col = "Declaration_Date"

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    df["shipment_dayofweek"] = df[date_col].dt.dayofweek

    df["shipment_hour"] = pd.to_datetime(
        df["Declaration_Time"], format="%H:%M:%S", errors="coerce"
    ).dt.hour

    # Dwell time
    df["dwell_time_hours"] = df["Dwell_Time_Hours"]

    # Clean up
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)

    return df


FEATURE_COLUMNS = [
    "weight_ratio",
    "weight_deviation_percent",
    "value_weight_ratio",
    "log_value_weight_ratio",
    "shipment_hour",
    "shipment_dayofweek",
    "dwell_time_hours",
]


def _score_to_level(score_0_100: float) -> str:
    """Convert a 0-100 risk score to a human-readable risk level."""
    if score_0_100 >= 70:
        return "Critical"
    elif score_0_100 >= 40:
        return "High"
    elif score_0_100 >= 20:
        return "Medium"
    else:
        return "Low"


# ---------------------------------------------------
# Public API
# ---------------------------------------------------

def predict_risk(row: dict) -> dict:
    """
    Run ML inference on a single container record.

    Parameters
    ----------
    row : dict
        Must contain at minimum:
          Declaration_Date, Declaration_Time,
          Declared_Value, Declared_Weight, Measured_Weight, Dwell_Time_Hours

    Returns
    -------
    dict with keys 'Risk_Score' (float, 0-100) and 'Risk_Level' (str)
    """
    pkg = _load_model()
    rf = pkg["rf"]
    gb = pkg["gb"]
    lr = pkg["lr"]

    # Normalise key names: the CSV uses "Declaration_Date (YYYY-MM-DD)"
    # but the API model uses "Declaration_Date"
    if "Declaration_Date" in row and "Declaration_Date (YYYY-MM-DD)" not in row:
        row = dict(row)
        row["Declaration_Date (YYYY-MM-DD)"] = row["Declaration_Date"]

    df = pd.DataFrame([row])
    df = _build_features(df)
    X = df[FEATURE_COLUMNS].fillna(0)

    rf_p = rf.predict_proba(X)[:, 1]
    gb_p = gb.predict_proba(X)[:, 1]
    lr_p = lr.predict_proba(X)[:, 1]

    ensemble_prob = 0.5 * rf_p + 0.3 * gb_p + 0.2 * lr_p
    risk_score = float(ensemble_prob[0]) * 100  # 0-100

    return {
        "Risk_Score": round(risk_score, 2),
        "Risk_Level": _score_to_level(risk_score),
    }


def predict_risk_batch(rows: list[dict]) -> list[dict]:
    """
    Run ML inference on a list of container records efficiently (batch mode).

    Returns a list of dicts, each with 'Risk_Score' and 'Risk_Level'.
    """
    if not rows:
        return []

    pkg = _load_model()
    rf = pkg["rf"]
    gb = pkg["gb"]
    lr = pkg["lr"]

    # Normalise date column name
    normalised = []
    for r in rows:
        r2 = dict(r)
        if "Declaration_Date" in r2 and "Declaration_Date (YYYY-MM-DD)" not in r2:
            r2["Declaration_Date (YYYY-MM-DD)"] = r2["Declaration_Date"]
        normalised.append(r2)

    df = pd.DataFrame(normalised)
    df = _build_features(df)
    X = df[FEATURE_COLUMNS].fillna(0)

    rf_p = rf.predict_proba(X)[:, 1]
    gb_p = gb.predict_proba(X)[:, 1]
    lr_p = lr.predict_proba(X)[:, 1]

    ensemble_probs = 0.5 * rf_p + 0.3 * gb_p + 0.2 * lr_p
    scores = (ensemble_probs * 100).round(2)

    return [
        {"Risk_Score": float(s), "Risk_Level": _score_to_level(float(s))}
        for s in scores
    ]
