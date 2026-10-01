import os
from typing import Optional
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="CreditWise Loan Approval API",
    description="FastAPI backend powered by Decision Tree Classifier for loan approval predictions.",
    version="1.0.0"
)

# Configure CORS to allow communication from React frontend dev servers
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to saved Decision Tree model pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "creditwise_decision_tree.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"Successfully loaded model from {MODEL_PATH}")
        except Exception as e:
            print(f"Failed to load model: {e}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")

class LoanApplication(BaseModel):
    Applicant_ID: Optional[str] = Field(default=None, description="Applicant Identifier")
    Age: float = Field(..., description="Applicant age")
    Gender: str = Field(..., description="Gender (Male, Female)")
    Marital_Status: str = Field(..., description="Marital Status (Single, Married)")
    Dependents: float = Field(..., description="Number of dependents")
    Education_Level: str = Field(..., description="Education Level (Graduate, Not Graduate)")
    Applicant_Income: float = Field(..., description="Applicant monthly income")
    Coapplicant_Income: float = Field(..., description="Coapplicant monthly income")
    Savings: float = Field(..., description="Total savings")
    Loan_Amount: float = Field(..., description="Requested loan amount")
    DTI_Ratio: float = Field(..., description="Debt-to-Income ratio (0.0 to 1.0)")
    Credit_Score: float = Field(..., description="Credit Score (300 to 850+)")
    Existing_Loans: float = Field(..., description="Number of existing loans")
    Employment_Status: str = Field(..., description="Employment status")
    Employer_Category: str = Field(..., description="Employer category")
    Collateral_Value: float = Field(..., description="Collateral value")
    Loan_Term: float = Field(..., description="Loan term in months")
    Loan_Purpose: str = Field(..., description="Purpose of loan")
    Property_Area: str = Field(..., description="Property area type")

@app.get("/")
def read_root():
    return {"message": "CreditWise API is running"}

@app.post("/predict")
def predict_loan(application: LoanApplication):
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            raise HTTPException(status_code=500, detail="ML model is not loaded or missing.")
    
    try:
        data_dict = application.model_dump()
        input_df = pd.DataFrame([data_dict])
        
        # Predict class and probabilities
        pred_array = model.predict(input_df)
        pred_class = int(pred_array[0])
        
        result_label = "Approved" if pred_class == 1 else "Rejected"
        
        probability_val = 0.0
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(input_df)[0]
            # Use probability of predicted class
            probability_val = round(float(proba[pred_class]) * 100, 2)
            approval_prob = round(float(proba[1]) * 100, 2)
        else:
            approval_prob = 100.0 if pred_class == 1 else 0.0
            probability_val = 100.0

        return {
            "prediction": pred_class,
            "result": result_label,
            "probability": probability_val,
            "approval_probability": approval_prob
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
