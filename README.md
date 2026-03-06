# SmartContainer — AI-Powered Container Risk Assessment

A full-stack application that uses machine learning to predict container clearance risk based on weight discrepancies, dwell time, and shipping patterns.

## Project Structure

```
Skill_Deprived/
├── data/                          # Datasets
│   ├── Historical Data.csv        # Training data (54,000 rows)
│   └── Real-Time Data (1).csv     # Test data (8,481 rows)
├── ml/                            # ML training & validation
│   ├── train.py                   # Model training pipeline
│   ├── validate.py                # Overfitting check script
│   └── test_realtime.py           # Real-time data test
├── backend/                       # FastAPI backend
│   ├── app/                       # Application package
│   │   ├── __init__.py
│   │   ├── main.py                # API endpoints
│   │   ├── database.py            # Supabase connection
│   │   └── risk_engine.py         # ML inference engine
│   ├── models/                    # Trained model files
│   │   └── risk_model.joblib
│   ├── .env                       # Environment variables
│   ├── requirements.txt           # Python dependencies
│   ├── schema.sql                 # Database schema
│   └── start.ps1                  # Startup script
└── smartcontainer-frontend/       # React frontend (Vite)
```

## Quick Start

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the ML model (first time only)
```bash
python ml/train.py
```

### 3. Start the backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
Or use the startup script:
```powershell
.\backend\start.ps1
```

### 4. Start the frontend
```bash
cd smartcontainer-frontend
npm install
npm run dev
```

## Model Performance

| Metric | Score |
|--------|-------|
| ROC-AUC | 0.9998 |
| Accuracy | 99.95% |
| Critical Recall | 95% |
| Real-time Test AUC | 1.0000 |

## API Docs

Once the backend is running, visit **http://localhost:8000/docs** for the interactive Swagger UI.
