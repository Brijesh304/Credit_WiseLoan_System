import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "Loan Application", href: "#apply" },
  { label: "How It Works", href: "#how" },
  { label: "About", href: "#about" },
];

export function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">CreditWise</span>
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#apply" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 md:inline-flex">
          Check Eligibility
        </a>
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 font-medium">
              {n.label}
            </a>
          ))}
          <a href="#apply" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground">
            Check Eligibility
          </a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <p className="font-display text-xl font-semibold">CreditWise</p>
          <p className="mt-1 text-sm opacity-70">Smart Loan Approval System</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm opacity-80 hover:opacity-100">{n.label}</a>
          ))}
        </nav>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs opacity-60">
        © 2026 CreditWise. All rights reserved.
      </div>
    </footer>
  );
}
