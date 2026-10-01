import { useState, type FormEvent } from "react";
import { Loader2, ArrowRight, Sparkles, RotateCcw, CheckCircle2, XCircle, AlertCircle, Wand2 } from "lucide-react";
import { SECTIONS, ALL_FIELDS, validateField, type FieldDef, type FieldKey } from "./formConfig";

type Values = Record<FieldKey, string>;
const empty = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, ""])) as Values;

const API_URL = import.meta.env["VITE_API_URL"] || "http://127.0.0.1:8000";

interface PredictionResponse {
  prediction: number;
  result: string;
  probability: number;
  approval_probability?: number;
}

// Pre-fill helper sample data from real dataset
const SAMPLE_APPROVED: Values = {
  Applicant_ID: "APP-9012",
  Age: "35",
  Gender: "Male",
  Marital_Status: "Married",
  Dependents: "1",
  Education_Level: "Graduate",
  Applicant_Income: "15000",
  Coapplicant_Income: "4500",
  Savings: "35000",
  Loan_Amount: "18000",
  DTI_Ratio: "0.22",
  Credit_Score: "760",
  Existing_Loans: "1",
  Employment_Status: "Salaried",
  Employer_Category: "Government",
  Collateral_Value: "40000",
  Loan_Term: "36",
  Loan_Purpose: "Home",
  Property_Area: "Urban",
};

function Field({ f, value, error, onChange }: { f: FieldDef; value: string; error?: string | null | undefined; onChange: (v: string) => void }) {
  const id = `f-${f.key}`;
  const base = `h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 ${error ? "border-destructive" : "border-input"}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{f.label}</label>
      {f.type === "select" ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${base} ${value ? "" : "text-muted-foreground"}`} aria-invalid={!!error}>
          <option value="">Select {f.label.toLowerCase()}</option>
          {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type={f.type} inputMode={f.type === "number" ? "decimal" : undefined} step={f.step ?? (f.type === "number" ? "any" : undefined)} min={f.min} max={f.max}
          placeholder={f.placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} aria-invalid={!!error} />
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ResultCard({ result, onReset }: { result: PredictionResponse; onReset: () => void }) {
  const isApproved = result.result === "Approved" || result.prediction === 1;
  const probaDisplay = typeof result.probability === "number" ? result.probability.toFixed(2) : "100.00";

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center shadow-soft sm:p-10">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${isApproved ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"}`}>
        {isApproved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        Decision Tree Prediction
      </span>
      
      <div className={`mx-auto mt-6 grid h-20 w-20 place-items-center rounded-2xl ${isApproved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
        {isApproved ? <Sparkles className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
      </div>

      <h3 className="mt-5 font-display text-3xl font-semibold">
        {isApproved ? "Loan Application Approved" : "Loan Application Rejected"}
      </h3>
      
      <p className="mt-2 text-muted-foreground text-sm">
        {isApproved
          ? "Congratulations! Your credit application meets the eligibility criteria."
          : "Based on the assessment model, the loan request does not currently meet approval requirements."}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 text-left">
        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
          <p className={`mt-1 text-xl font-semibold ${isApproved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {result.result}
          </p>
        </div>

        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Confidence</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {probaDisplay}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/50 bg-background/50 p-3 text-xs text-muted-foreground">
        Prediction served live from CreditWise FastAPI Decision Tree Classifier.
      </div>

      <button onClick={onReset} className="mt-8 inline-flex items-center gap-2 rounded-full border bg-card px-7 py-3.5 font-semibold shadow-sm transition hover:bg-muted">
        <RotateCcw className="h-4 w-4" /> Assess Another Application
      </button>
    </div>
  );
}

export function LoanForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string | null>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const set = (f: FieldDef, v: string) => {
    setValues((s) => ({ ...s, [f.key]: v }));
    if (errors[f.key]) setErrors((e) => ({ ...e, [f.key]: validateField(f, v) }));
    if (apiError) setApiError(null);
  };

  const handleFillSample = () => {
    setValues(SAMPLE_APPROVED);
    setErrors({});
    setApiError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const next: typeof errors = {};
    ALL_FIELDS.forEach((f) => { next[f.key] = validateField(f, values[f.key]); });
    setErrors(next);
    
    const first = ALL_FIELDS.find((f) => next[f.key]);
    if (first) {
      document.getElementById(`f-${first.key}`)?.focus();
      return;
    }

    setStatus("loading");

    try {
      const payload = {
        Applicant_ID: values.Applicant_ID || "APP-001",
        Age: parseFloat(values.Age),
        Gender: values.Gender,
        Marital_Status: values.Marital_Status,
        Dependents: parseFloat(values.Dependents),
        Education_Level: values.Education_Level,
        Applicant_Income: parseFloat(values.Applicant_Income),
        Coapplicant_Income: parseFloat(values.Coapplicant_Income),
        Savings: parseFloat(values.Savings),
        Loan_Amount: parseFloat(values.Loan_Amount),
        DTI_Ratio: parseFloat(values.DTI_Ratio),
        Credit_Score: parseFloat(values.Credit_Score),
        Existing_Loans: parseFloat(values.Existing_Loans),
        Employment_Status: values.Employment_Status,
        Employer_Category: values.Employer_Category,
        Collateral_Value: parseFloat(values.Collateral_Value),
        Loan_Term: parseFloat(values.Loan_Term),
        Loan_Purpose: values.Loan_Purpose,
        Property_Area: values.Property_Area,
      };

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMessage = `API Error (${res.status})`;
        try {
          const errData = await res.json();
          if (errData.detail) {
            errMessage = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
          }
        } catch {
          // fallback
        }
        throw new Error(errMessage);
      }

      const data: PredictionResponse = await res.json();
      setPredictionResult(data);
      setStatus("done");
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    } catch (err: any) {
      setStatus("idle");
      setApiError(err.message || "Failed to connect to the backend prediction service. Please verify that FastAPI is running.");
    }
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setStatus("idle");
    setApiError(null);
    setPredictionResult(null);
  };

  if (status === "done" && predictionResult) {
    return <ResultCard result={predictionResult} onReset={reset} />;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Fill in all fields or load sample data for instant testing.</p>
        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          <Wand2 className="h-3.5 w-3.5" /> Fill Sample Application
        </button>
      </div>

      {apiError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Communication Error</p>
            <p className="mt-1 text-xs opacity-90">{apiError}</p>
          </div>
        </div>
      )}

      {SECTIONS.map((s, i) => (
        <fieldset key={s.title} className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <legend className="sr-only">{s.title}</legend>
          <div className="mb-6 flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent font-display text-sm font-semibold text-accent-foreground">0{i + 1}</span>
            <div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {s.fields.map((f) => <Field key={f.key} f={f} value={values[f.key]} error={errors[f.key]} onChange={(v) => set(f, v)} />)}
          </div>
        </fieldset>
      ))}

      <button type="submit" disabled={status === "loading"} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-70">
        {status === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing application with Decision Tree ML...</> : <>Check Loan Eligibility <ArrowRight className="h-5 w-5" /></>}
      </button>
    </form>
  );
}
