"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// Approximate exchange rates as of April 2026 (manually verifiable)
const RATES = {
  AUD: 1,
  USD: 0.66, // 1 AUD ≈ 0.66 USD
  INR: 55.5, // 1 AUD ≈ 55.5 INR
};

// Source: amc.org.au, ecfmg.org, ielts.org, occupationalenglishtest.com,
// ahpra.gov.au — figures for the 2026 cycle, in AUD where possible.
const FEES = {
  cat1: 2690, // AMC CAT 1 MCQ exam, AUD
  cat2: 3490, // AMC CAT 2 Clinical / MCAT, AUD
  epicUSD: 130, // EPIC verification base, USD
  ielts: 410, // IELTS Academic AU sitting
  oet: 587, // OET Medicine paper, AUD
  ahpra: 760, // AHPRA general registration application
};

type Currency = "AUD" | "USD" | "INR";
type EnglishTest = "ielts" | "oet" | "none";

const fmt = (amount: number, currency: Currency) => {
  const symbol = currency === "AUD" ? "A$" : currency === "USD" ? "US$" : "₹";
  const value = amount * RATES[currency];
  return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export default function Calculator() {
  const [cat1Attempts, setCat1Attempts] = useState(1);
  const [cat2Attempts, setCat2Attempts] = useState(1);
  const [englishTest, setEnglishTest] = useState<EnglishTest>("ielts");
  const [includeEpic, setIncludeEpic] = useState(true);
  const [includeAhpra, setIncludeAhpra] = useState(true);
  const [currency, setCurrency] = useState<Currency>("AUD");

  const breakdown = useMemo(() => {
    const items: { label: string; amountAud: number; detail?: string }[] = [];
    items.push({
      label: `AMC MCQ × ${cat1Attempts}`,
      amountAud: FEES.cat1 * cat1Attempts,
      detail: "Computer-based MCQ exam",
    });
    items.push({
      label: `AMC Handbook AI RolePlay (Clinical / MCAT) × ${cat2Attempts}`,
      amountAud: FEES.cat2 * cat2Attempts,
      detail: "Multi-station clinical exam",
    });
    if (englishTest === "ielts") {
      items.push({ label: "IELTS Academic", amountAud: FEES.ielts });
    } else if (englishTest === "oet") {
      items.push({ label: "OET (Medicine paper)", amountAud: FEES.oet });
    }
    if (includeEpic) {
      // Convert USD 130 -> AUD using inverse rate
      const epicAud = FEES.epicUSD / RATES.USD;
      items.push({
        label: "EPIC verification (ECFMG)",
        amountAud: epicAud,
        detail: "≈ USD 130 base fee",
      });
    }
    if (includeAhpra) {
      items.push({
        label: "AHPRA general registration",
        amountAud: FEES.ahpra,
      });
    }
    return items;
  }, [cat1Attempts, cat2Attempts, englishTest, includeEpic, includeAhpra]);

  const totalAud = breakdown.reduce((sum, item) => sum + item.amountAud, 0);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Inputs */}
      <div className="lg:col-span-3 rounded-3xl border border-violet-800/30 bg-gradient-to-br from-violet-950/60 via-indigo-950/40 to-slate-900/80 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            AMC MCQ attempts
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCat1Attempts(n)}
                className={`flex-1 py-3 rounded-xl font-display font-bold transition-all ${
                  cat1Attempts === n
                    ? "bg-violet-600 text-white shadow-glow-violet"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                }`}
                aria-pressed={cat1Attempts === n}
              >
                {n}×
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Most pass first or second sitting.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            AMC Handbook AI RolePlay attempts
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCat2Attempts(n)}
                className={`flex-1 py-3 rounded-xl font-display font-bold transition-all ${
                  cat2Attempts === n
                    ? "bg-pink-600 text-white"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                }`}
                aria-pressed={cat2Attempts === n}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            English test
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "ielts", label: "IELTS" },
                { id: "oet", label: "OET" },
                { id: "none", label: "Exempt" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEnglishTest(opt.id)}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  englishTest === opt.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                }`}
                aria-pressed={englishTest === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <p className="font-semibold text-white text-sm">Include EPIC verification</p>
            <p className="text-xs text-slate-500">ECFMG credential check (USD 130).</p>
          </div>
          <button
            type="button"
            onClick={() => setIncludeEpic((v) => !v)}
            role="switch"
            aria-checked={includeEpic}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              includeEpic ? "bg-violet-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                includeEpic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <p className="font-semibold text-white text-sm">Include AHPRA registration</p>
            <p className="text-xs text-slate-500">Final step for medical practice.</p>
          </div>
          <button
            type="button"
            onClick={() => setIncludeAhpra((v) => !v)}
            role="switch"
            aria-checked={includeAhpra}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              includeAhpra ? "bg-violet-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                includeAhpra ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Display currency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["AUD", "USD", "INR"] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`py-3 rounded-xl font-display font-bold transition-all ${
                  currency === c
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                }`}
                aria-pressed={currency === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 rounded-3xl border border-pink-800/30 bg-gradient-to-br from-pink-950/60 via-rose-950/40 to-slate-900/80 p-6 sm:p-8 backdrop-blur-sm">
        <p className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.25em] mb-3">
          Total estimate
        </p>
        <p
          className="font-display font-bold gradient-text"
          style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)", lineHeight: 1.1 }}
        >
          {fmt(totalAud, currency)}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {currency !== "AUD" && (
            <>
              ≈ {fmt(totalAud, "AUD")} ·{" "}
            </>
          )}
          End-to-end AMC pathway
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="text-slate-200 font-medium">{item.label}</p>
                {item.detail && (
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                )}
              </div>
              <p className="text-slate-300 font-mono shrink-0">
                {fmt(item.amountAud, currency)}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/auth/signup"
          className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-white transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            boxShadow: "0 8px 30px rgba(124,58,237,0.35)",
          }}
        >
          Start prep free →
        </Link>
        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
          Estimates only. Confirm current fees on amc.org.au, ecfmg.org, ahpra.gov.au, ielts.org and occupationalenglishtest.com. Exchange rates approximate (April 2026).
        </p>
      </div>
    </div>
  );
}
