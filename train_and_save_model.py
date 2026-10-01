import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Path to dataset
csv_path = r"d:\AI_PROJECT\CreaditWise_Loan_System_Python\loan_approval_data.csv"
model_dir = r"d:\AI_PROJECT\backend\model"
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, "creditwise_decision_tree.pkl")

# Load raw dataset
df = pd.read_csv(csv_path)

# Drop missing target rows if any
df = df.dropna(subset=["Loan_Approved"]).reset_index(drop=True)

X = df.drop(columns=["Loan_Approved"])
y = df["Loan_Approved"].map({"No": 0, "Yes": 1})

# Column lists matching the dataset
num_cols = ['Applicant_Income', 'Coapplicant_Income', 'Age', 'Dependents', 
            'Credit_Score', 'Existing_Loans', 'DTI_Ratio', 'Savings', 
            'Collateral_Value', 'Loan_Amount', 'Loan_Term']

edu_cols = ['Education_Level']

ohe_cols = ["Employment_Status", "Marital_Status", "Loan_Purpose", 
            "Property_Area", "Gender", "Employer_Category"]

# Numerical pipeline: impute mean
num_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean'))
])

# Ordinal pipeline: impute most_frequent, then encode ('Graduate' -> 0, 'Not Graduate' -> 1)
edu_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ordinal', OrdinalEncoder(categories=[['Graduate', 'Not Graduate']], handle_unknown='use_encoded_value', unknown_value=-1))
])

# Categorical OHE pipeline: impute most_frequent, then one-hot encode with drop='first'
ohe_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', num_pipeline, num_cols),
        ('edu', edu_pipeline, edu_cols),
        ('ohe', ohe_pipeline, ohe_cols)
    ],
    remainder='drop'
)

# Full Decision Tree pipeline
full_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('scaler', StandardScaler()),
    ('classifier', DecisionTreeClassifier(random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

full_model.fit(X_train, y_train)

y_pred = full_model.predict(X_test)

print("--- DECISION TREE PRODUCTION MODEL PERFORMANCE ---")
print("Accuracy: ", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:   ", recall_score(y_test, y_pred))
print("F1 score: ", f1_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# Save the trained model pipeline
joblib.dump(full_model, model_path)
print(f"\nSaved production Decision Tree model pipeline to: {model_path}")

# Verify loading
loaded_model = joblib.load(model_path)
test_sample = X_test.iloc[0:1]
sample_pred = loaded_model.predict(test_sample)[0]
sample_proba = loaded_model.predict_proba(test_sample)[0]
print("Verified Loaded Model Prediction:", sample_pred, "Probabilities:", sample_proba)
