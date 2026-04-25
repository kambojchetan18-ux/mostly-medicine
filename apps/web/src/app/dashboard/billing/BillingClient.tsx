"use client";

import { useState } from "react";

export interface CurrentSubscription {
  plan: "free" | "pro" | "enterprise";
  isAdmin: boolean;
  hasCustomerId: boolean;
  status: string | null;
  periodEnd: string | null;
}

interface Prices {
  proMonthly: string | null;
  proYearly: string | null;
  enterpriseMonthly: string | null;
  enterpriseYearly: string | null;
}

interface Props {
  subscription: CurrentSubscription;
  prices: Prices;
  flash: "success" | "canceled" | null;
}

const FEATURES = {
  free: [
    "AMC CAT 1 MCQs (limited daily)",
    "Spaced repetition recalls (limited)",
    "Reference library (read-only)",
  ],
  pro: [
    "Everything in Free",
    "Unlimited AMC CAT 1 MCQs",
    "AMC Handbook RolePlay (CAT 2)",
    "AI Clinical RolePlay — Solo voice mode",
    "Examiner-style feedback after every session",
  ],
  enterprise: [
    "Everything in Pro",
    "AI Clinical RolePlay — Live (2-player video)",
    "Practice with a partner over video + audio",
    "Higher daily limits",
    "Priority support",
  ],
};

export default function BillingClient({ subscription, prices, flash }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cadence, setCadence] = useState<"monthly" | "yearly">("monthly");

  const proPrice = cadence === "monthly" ? prices.proMonthly : prices.proYearly;
  const entPrice = cadence === "monthly" ? prices.enterpriseMonthly : prices.enterpriseYearly;

  async function checkout(priceId: string | null, label: string) {
    if (!priceId) {
      setError(`${label} price not configured. Add the env var in Vercel.`);
      return;
    }
    setError(null);
    setLoading(priceId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Checkout failed");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(null);
    }
  }

  async function openPortal() {
    setError(null);
    setLoading("portal");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Portal failed");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Portal failed");
      setLoading(null);
    }
  }

  const planBadge = (p: "free" | "pro" | "enterprise") => {
    if (p === "free") return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">FREE</span>;
    if (p === "pro") return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">⭐ PRO</span>;
    return <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">🏢 ENTERPRISE</span>;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your current plan: {planBadge(subscription.plan)}{" "}
          {subscription.isAdmin && <span className="ml-2 text-xs text-gray-500">(admin — bypasses gating)</span>}
        </p>
        {subscription.status && (
          <p className="mt-1 text-xs text-gray-500">
            Subscription status: <span className="font-medium">{subscription.status}</span>
            {subscription.periodEnd && (
              <> · renews {new Date(subscription.periodEnd).toLocaleDateString()}</>
            )}
          </p>
        )}
      </header>

      {flash === "success" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          🎉 Subscription activated! It may take a few seconds to reflect.
        </div>
      )}
      {flash === "canceled" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Checkout canceled. No payment was taken.
        </div>
      )}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">⚠️ {error}</div>}

      {/* Manage existing subscription */}
      {subscription.hasCustomerId && subscription.plan !== "free" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage your subscription</p>
              <p className="text-xs text-gray-500">Update payment method, switch plans, or cancel.</p>
            </div>
            <button
              type="button"
              onClick={openPortal}
              disabled={loading === "portal"}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {loading === "portal" ? "Opening…" : "Open Billing Portal"}
            </button>
          </div>
        </div>
      )}

      {/* Cadence toggle */}
      <div className="flex justify-center gap-2">
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCadence(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition ${
              cadence === c
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {c}{c === "yearly" && " · save ~17%"}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Free */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">$0</p>
          <p className="text-xs text-gray-500">Get started — MCQ practice</p>
          <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
            {FEATURES.free.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-gray-400">•</span><span>{f}</span></li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-500"
          >
            {subscription.plan === "free" ? "Current plan" : "Downgrade via portal"}
          </button>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-md">
          <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white">MOST POPULAR</span>
          <h2 className="text-lg font-bold text-gray-900">⭐ Pro</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            ${cadence === "monthly" ? "19" : "190"}
            <span className="text-sm font-normal text-gray-500">/{cadence === "monthly" ? "mo" : "yr"}</span>
          </p>
          <p className="text-xs text-gray-500">Clinical practice unlocked</p>
          <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
            {FEATURES.pro.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-amber-500">✓</span><span>{f}</span></li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => checkout(proPrice, "Pro")}
            disabled={!proPrice || (loading !== null && loading === proPrice) || subscription.plan === "pro"}
            className="mt-6 w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-600 disabled:opacity-60"
          >
            {subscription.plan === "pro"
              ? "Current plan"
              : !proPrice
                ? "Coming soon"
                : loading === proPrice
                  ? "Loading…"
                  : "Upgrade to Pro"}
          </button>
        </div>

        {/* Enterprise */}
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">🏢 Enterprise</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            ${cadence === "monthly" ? "49" : "490"}
            <span className="text-sm font-normal text-gray-500">/{cadence === "monthly" ? "mo" : "yr"}</span>
          </p>
          <p className="text-xs text-gray-500">Live partner practice</p>
          <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
            {FEATURES.enterprise.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-violet-500">✓</span><span>{f}</span></li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => checkout(entPrice, "Enterprise")}
            disabled={!entPrice || (loading !== null && loading === entPrice) || subscription.plan === "enterprise"}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-violet-700 disabled:opacity-60"
          >
            {subscription.plan === "enterprise"
              ? "Current plan"
              : !entPrice
                ? "Coming soon"
                : loading === entPrice
                  ? "Loading…"
                  : "Upgrade to Enterprise"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        Payments processed by Stripe. Cancel anytime via the billing portal.
      </p>
    </div>
  );
}
