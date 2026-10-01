// Options matching exact categories in the CreditWise Decision Tree ML model
export const OPTIONS = {
  gender: ["Male", "Female"],
  maritalStatus: ["Single", "Married"],
  educationLevel: ["Graduate", "Not Graduate"],
  employmentStatus: ["Salaried", "Self-employed", "Contract", "Unemployed"],
  employerCategory: ["Private", "Government", "MNC", "Business", "Unemployed"],
  loanPurpose: ["Personal", "Car", "Business", "Home", "Education"],
  propertyArea: ["Urban", "Semiurban", "Rural"],
};

export type FieldKey =
  | "Applicant_ID" | "Age" | "Gender" | "Marital_Status" | "Dependents" | "Education_Level"
  | "Applicant_Income" | "Coapplicant_Income" | "Savings" | "Loan_Amount" | "DTI_Ratio"
  | "Credit_Score" | "Existing_Loans" | "Employment_Status" | "Employer_Category"
  | "Collateral_Value" | "Loan_Term" | "Loan_Purpose" | "Property_Area";

export type FieldDef = {
  key: FieldKey;
  label: string;
  type: "text" | "number" | "select";
  placeholder?: string;
  options?: string[];
  step?: string;
  min?: number;
  max?: number;
  integer?: boolean;
  error: string;
};

export const SECTIONS: { title: string; description: string; fields: FieldDef[] }[] = [
  {
    title: "Personal Information",
    description: "Basic details about the applicant.",
    fields: [
      { key: "Applicant_ID", label: "Applicant ID", type: "text", placeholder: "e.g. APP10234", error: "Please enter an applicant ID." },
      { key: "Age", label: "Age", type: "number", placeholder: "e.g. 35", min: 18, max: 100, integer: true, error: "Please enter your age (18–100)." },
      { key: "Gender", label: "Gender", type: "select", options: OPTIONS.gender, error: "Please select your gender." },
      { key: "Marital_Status", label: "Marital Status", type: "select", options: OPTIONS.maritalStatus, error: "Please select your marital status." },
      { key: "Dependents", label: "Dependents", type: "number", placeholder: "e.g. 2", min: 0, max: 20, integer: true, error: "Please enter the number of dependents." },
      { key: "Education_Level", label: "Education Level", type: "select", options: OPTIONS.educationLevel, error: "Please select your education level." },
    ],
  },
  {
    title: "Financial Information",
    description: "Income, savings and credit profile.",
    fields: [
      { key: "Applicant_Income", label: "Applicant Income ($)", type: "number", placeholder: "Monthly income, e.g. 12000", min: 0, error: "Please enter a valid income." },
      { key: "Coapplicant_Income", label: "Coapplicant Income ($)", type: "number", placeholder: "Enter 0 if none", min: 0, error: "Please enter a valid coapplicant income." },
      { key: "Savings", label: "Savings ($)", type: "number", placeholder: "e.g. 25000", min: 0, error: "Please enter valid savings." },
      { key: "Loan_Amount", label: "Loan Amount ($)", type: "number", placeholder: "e.g. 20000", min: 0, error: "Please enter a valid loan amount." },
      { key: "DTI_Ratio", label: "DTI Ratio (0.00 – 1.00)", type: "number", placeholder: "e.g. 0.25", step: "0.01", min: 0, max: 1, error: "Please enter a valid DTI ratio (0.0 to 1.0)." },
      { key: "Credit_Score", label: "Credit Score", type: "number", placeholder: "e.g. 720", min: 300, max: 900, integer: true, error: "Please enter a credit score (300–900)." },
      { key: "Existing_Loans", label: "Existing Loans", type: "number", placeholder: "e.g. 1", min: 0, integer: true, error: "Please enter the number of existing loans." },
    ],
  },
  {
    title: "Employment Information",
    description: "Current work situation.",
    fields: [
      { key: "Employment_Status", label: "Employment Status", type: "select", options: OPTIONS.employmentStatus, error: "Please select your employment status." },
      { key: "Employer_Category", label: "Employer Category", type: "select", options: OPTIONS.employerCategory, error: "Please select your employer category." },
    ],
  },
  {
    title: "Loan Information",
    description: "Details of the loan you're requesting.",
    fields: [
      { key: "Collateral_Value", label: "Collateral Value ($)", type: "number", placeholder: "e.g. 35000", min: 0, error: "Please enter a valid collateral value." },
      { key: "Loan_Term", label: "Loan Term (months)", type: "number", placeholder: "e.g. 36", min: 1, integer: true, error: "Please enter a valid loan term." },
      { key: "Loan_Purpose", label: "Loan Purpose", type: "select", options: OPTIONS.loanPurpose, error: "Please select a loan purpose." },
      { key: "Property_Area", label: "Property Area", type: "select", options: OPTIONS.propertyArea, error: "Please select a property area." },
    ],
  },
];

export const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);

export function validateField(f: FieldDef, raw: string): string | null {
  const v = raw.trim();
  if (!v) return f.error;
  if (f.type !== "number") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return f.error;
  if (f.integer && !Number.isInteger(n)) return f.error;
  if (f.min !== undefined && n < f.min) return f.error;
  if (f.max !== undefined && n > f.max) return f.error;
  return null;
}
