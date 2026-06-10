import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { features } from "@/config/features";

interface PermRow {
  module: string;
  enabled: boolean;
  daily_limit: number | null;
}

const MODULE_LABEL: Record<string, string> = {
  mcq: "AMC MCQs",
  roleplay: "AMC Handbook AI RolePlays",
  acrp_solo: "AMC Clinical AI RolePlays",
};

const ALWAYS_FREE: { label: string; href?: string }[] = [
  { label: "Ask AI — 3 free questions, no signup", href: "/ask-ai" },
  { label: "AMC Fee Calculator", href: "/amc-fee-calculator" },
  { label: "AMC Eligibility Checker", href: "/amc-eligibility-checker" },
  { label: "Reference Library (Murtagh · RACGP · AMC Handbook)" },
  { label: "Australian Jobs Tracker (RMO · GP)" },
];

export default async function FreeAccessCard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("module_permissions")
    .select("module, enabled, daily_limit")
    .eq("plan", "free")
    .in("module", ["mcq", "roleplay", "acrp_solo"])
    .order("module");

  const perks: { label: string; daily: string }[] = [];
  for (const row of (data ?? []) as PermRow[]) {
    if (!row.enabled) continue;
    const label = MODULE_LABEL[row.module];
    if (!label) continue;
    const daily = row.daily_limit != null ? `${row.daily_limit}/day` : "Unlimited";
    perks.push({ label, daily });
  }

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pb-16">
      <div className="rounded-3xl border border-saffron-800/30 bg-gradient-to-br from-saffron-950/40 via-cream-50/40 to-saffron-950/30 backdrop-blur-sm p-8 sm:p-10">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-saffron-700 uppercase tracking-[0.25em] mb-3">
              No credit card needed
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-950 mb-3">
              Try Mostly Medicine{" "}
              <span className="bg-gradient-to-r from-saffron-300 to-saffron-300 bg-clip-text text-transparent">
                free, every day
              </span>
            </h2>
            <p className="text-sm text-ink-950/65 leading-relaxed mb-5">
              {features.betaMode
                ? "Mostly Medicine is in free beta. Every signed-in user gets full access — MCQs, AMC Handbook RolePlay, Clinical RolePlay, and the reference library. Help us improve."
                : "Test-drive the platform that's helped IMGs across Australia prep for AMC. Daily caps reset at midnight UTC — upgrade only if you want unlimited access and spaced-repetition for your weak areas."}
            </p>

            <ul className="space-y-2 text-sm">
              {perks.map((p) => (
                <li key={p.label} className="flex items-baseline gap-2.5">
                  <span className="text-saffron-700 shrink-0">✓</span>
                  <span className="text-ink-950/90 font-medium">{p.daily}</span>
                  <span className="text-ink-950/65">{p.label}</span>
                </li>
              ))}
              {ALWAYS_FREE.map((item) => (
                <li key={item.label} className="flex items-baseline gap-2.5">
                  <span className="text-saffron-700 shrink-0">✓</span>
                  <span className="text-ink-950/90 font-medium">Free forever</span>
                  {item.href ? (
                    <Link href={item.href} className="text-ink-950/80 hover:text-saffron-700 underline-offset-2 hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-ink-950/65">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-saffron-500 hover:bg-saffron-400 text-ink-950 font-bold text-sm px-5 py-2.5 shadow-lg shadow-saffron-500/20 transition"
              >
                Sign up free — no credit card →
              </Link>
              <Link
                href="/try-amc-clinical-roleplay"
                className="inline-flex items-center justify-center rounded-xl border border-ink-950/15 bg-cream-100/60 hover:bg-cream-50 text-ink-950/90 font-semibold text-sm px-5 py-2.5 transition"
              >
                Try a roleplay (no signup)
              </Link>
            </div>
          </div>

          {features.paidTiersEnabled ? (
            <div className="md:col-span-2 rounded-2xl border border-ink-950/10 bg-cream-100/60 p-6">
              <p className="text-[10px] font-bold text-ink-950/55 uppercase tracking-widest mb-3">
                When you're ready
              </p>
              <p className="text-xl font-bold text-ink-950 mb-1">Pro · A$29/mo</p>
              <p className="text-xs text-ink-950/65 leading-relaxed">
                Unlimited MCQs, unlimited Solo RolePlay, unlimited Handbook RolePlay,
                spaced repetition, weak-area targeting, priority support.
              </p>
              <p className="text-[11px] text-ink-950/55 mt-3">
                Upgrade or cancel any time from your dashboard.
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-saffron-700/50 bg-saffron-100 hover:bg-saffron-900/50 text-saffron-800 font-semibold text-sm px-4 py-2 transition"
              >
                See plans →
              </Link>
            </div>
          ) : (
            <div className="md:col-span-2 rounded-2xl border border-saffron-700/50 bg-gradient-to-br from-saffron-950/50 to-cream-50/60 p-6">
              <p className="text-[10px] font-bold text-saffron-700 uppercase tracking-widest mb-3">
                Beta access
              </p>
              <p className="text-xl font-bold text-ink-950 mb-1">Free during beta</p>
              <p className="text-xs text-ink-950/65 leading-relaxed">
                All features unlocked — MCQs, AMC Handbook AI RolePlay, Clinical
                RolePlay, examiner-style feedback, the full reference library.
              </p>
              <p className="text-[11px] text-ink-950/55 mt-3">
                Help us improve — feedback shapes what ships next.
              </p>
              <Link
                href="/auth/signup"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-saffron-700/50 bg-saffron-100 hover:bg-saffron-900/50 text-saffron-800 font-semibold text-sm px-4 py-2 transition"
              >
                Get started →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
