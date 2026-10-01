import { createFileRoute } from "@tanstack/react-router";
import { Zap, BarChart3, MousePointerClick, Lock, ClipboardList, Brain, BadgeCheck, ArrowRight, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Navbar, Footer } from "@/components/creditwise/Layout";
import { LoanForm } from "@/components/creditwise/LoanForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CreditWise — Smart Loan Approval System" },
      { name: "description", content: "Assess your loan eligibility with CreditWise, a smart, data-driven loan approval system." },
      { property: "og:title", content: "CreditWise — Smart Loan Approval System" },
      { property: "og:description", content: "Assess your loan eligibility through intelligent, data-driven analysis." },
    ],
  }),
  component: Home,
});

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">{icon}</div>
      <h3 className="mt-5 font-display font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function HeroGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Application overview</p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">Awaiting model</span>
        </div>
        <div className="mt-6 flex h-32 items-end gap-2">
          {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-primary/20" style={{ height: `${h}%` }}>
              <div className="h-full rounded-t-lg bg-primary" style={{ opacity: 0.3 + i * 0.1 }} />
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {["Income", "Credit", "Collateral"].map((l) => (
            <div key={l} className="rounded-xl bg-muted py-3 text-xs font-medium text-muted-foreground">{l}</div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success"><TrendingUp className="h-5 w-5" /></span>
        <div><p className="text-xs text-muted-foreground">Analysis</p><p className="text-sm font-semibold">Data-driven</p></div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <section id="home" className="bg-hero scroll-mt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-flex rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">Smart Loan Approval System</span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Smart Loan Decisions,<br /><span className="text-primary">Made Simple.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                CreditWise helps applicants assess their loan eligibility through intelligent, data-driven analysis.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#apply" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90">
                  Check Eligibility <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how" className="inline-flex h-12 items-center justify-center rounded-full border bg-card px-7 font-semibold transition hover:bg-muted">How It Works</a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
                {[[Zap, "Fast Assessment"], [BarChart3, "Data-Driven"], [Lock, "Simple & Secure"]].map(([I, t]: any) => (
                  <span key={t} className="flex items-center gap-2"><I className="h-4 w-4 text-primary" />{t}</span>
                ))}
              </div>
            </div>
            <HeroGraphic />
          </div>
        </section>

        <section id="apply" className="scroll-mt-16 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHead eyebrow="Loan Application" title="Loan Eligibility Assessment" sub="Enter your information to assess your loan eligibility." />
            <LoanForm />
          </div>
        </section>

        <section id="how" className="scroll-mt-16 bg-card py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="How It Works" title="Three simple steps" />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [ClipboardList, "Enter Your Information", "Provide personal, financial, employment and loan details."],
                [Brain, "Smart Analysis", "The trained machine learning model will analyze the application."],
                [BadgeCheck, "Get Your Result", "Receive the loan approval prediction."],
              ].map(([I, t, d]: any, i) => (
                <div key={t} className="relative rounded-3xl border bg-background p-8">
                  <span className="font-display text-5xl font-semibold text-primary/15">0{i + 1}</span>
                  <div className="mt-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><I className="h-6 w-6" /></div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="Features" title="Why CreditWise" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard icon={<Zap />} title="Fast Assessment" text="Quick and simple loan application process." />
              <FeatureCard icon={<BarChart3 />} title="Data-Driven Analysis" text="Loan decisions will be supported by trained machine learning models." />
              <FeatureCard icon={<MousePointerClick />} title="Simple Experience" text="Easy-to-understand application process." />
              <FeatureCard icon={<Lock />} title="Secure Interface" text="Designed with a clean and privacy-conscious user experience." />
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-16 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-3xl bg-navy p-8 text-navy-foreground sm:p-14">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-70">About</p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">About CreditWise</h2>
              <p className="mt-5 max-w-3xl text-lg opacity-85">
                CreditWise is designed to simplify the loan eligibility assessment process by combining a user-friendly interface with machine learning technology.
              </p>
              <p className="mt-4 max-w-3xl opacity-70">
                The machine learning model is developed separately and will be integrated into this interface to deliver real approval predictions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
