import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StreakHeatmap from "@/components/StreakHeatmap";

const modules = [
  {
    href:  "/dashboard/ai-roleplay/live",
    emoji: "🎥",
    tag:   "Live · 2-player",
    title: "Peer RolePlay (Live)",
    desc:  "Pair up with another candidate over live video and roleplay AMC scenarios. Examiner-grade feedback on the conversation afterwards.",
  },
  {
    href:  "/dashboard/reference",
    emoji: "📖",
    tag:   "Reference",
    title: "Reference Library",
    desc:  "Clinical summaries, preventive care guidelines, and AMC exam blueprints — Murtagh, Red Book, AMC Handbook.",
  },
  {
    href:  "/dashboard/library",
    emoji: "📚",
    tag:   "Library",
    title: "Study Library",
    desc:  "Upload and search your study materials with AI-powered retrieval.",
  },
  {
    href:  "/amc-fee-calculator?source=dashboard",
    emoji: "💰",
    tag:   "Cost planner",
    title: "Cost Calculator",
    desc:  "Live calculator: see your AUD/USD/INR total in 30 seconds.",
  },
  {
    href:  "/dashboard/jobs",
    emoji: "💼",
    tag:   "Careers",
    title: "Australian Jobs",
    desc:  "Find RMO positions, explore the GP pathway, and track your applications.",
  },
];

const quickStats = [
  { emoji: "🎯", value: "151",   label: "MCAT Scenarios"   },
  { emoji: "📝", value: "3k+",   label: "Practice MCQs"    },
  { emoji: "📖", value: "5",     label: "Reference Guides" },
  { emoji: "🇦🇺", value: "100+", label: "Job Listings"     },
];

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let firstName = "Doctor";
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Doctor";
    firstName = fullName.split(" ")[0];
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display text-3xl font-bold text-ink-950">Welcome back, {firstName} 👋</h2>
        </div>
        <p className="text-ink-900/60 text-sm">Choose a module to continue your AMC preparation.</p>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickStats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-ink-950/10 bg-white px-4 py-3 flex items-center gap-3">
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <div>
              <p className="font-display font-bold text-xl leading-none text-ink-950">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-ink-900/60 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Streak heatmap — daily MCQ activity, dopamine-loop retention */}
      <div className="mb-8">
        <StreakHeatmap />
      </div>

      {/* Featured heroes — Clinical RolePlay + MCQ Practice, the two core products */}
      <div className="mb-4 sm:mb-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-6 sm:p-8 shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700 mb-2">
            Core practice · voice OSCE
          </p>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 mb-2">
            Clinical RolePlay
          </h3>
          <p className="text-sm text-ink-900/75">
            Talk to an AI patient in a timed station, then get examiner feedback scored against the 13-domain AMC rubric.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/cat2"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400"
            >
              Start a station →
            </Link>
            <Link
              href="/dashboard/cat2"
              className="inline-flex items-center rounded-full border border-ink-950/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink-900/80 hover:border-saffron-400 hover:text-ink-950 transition"
            >
              Handbook · 151 cases
            </Link>
            <Link
              href="/dashboard/ai-roleplay"
              className="inline-flex items-center rounded-full border border-ink-950/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink-900/80 hover:border-saffron-400 hover:text-ink-950 transition"
            >
              Beyond Handbook · unlimited
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-6 sm:p-8 shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700 mb-2">
            Core practice · 4,300+ MCQs
          </p>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 mb-2">
            MCQ Practice
          </h3>
          <p className="text-sm text-ink-900/75">
            Answer AMC-style MCQs across 15 specialties. Get one wrong and SmartFeedback dissects it — the exact trap, the AU guideline it tested, and a pearl you&apos;ll remember on exam day.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/cat1"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400"
            >
              Start practising →
            </Link>
            <span className="rounded-full border border-saffron-300/60 bg-white px-3 py-1 text-xs text-ink-900/75">
              SmartFeedback
            </span>
            <span className="rounded-full border border-saffron-300/60 bg-white px-3 py-1 text-xs text-ink-900/75">
              Spaced repetition
            </span>
            <span className="rounded-full border border-saffron-300/60 bg-white px-3 py-1 text-xs text-ink-900/75">
              15 specialties
            </span>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-3xl border border-ink-950/10 bg-white p-6 transition hover:border-ink-950/20 hover:shadow-[0_24px_48px_-24px_rgba(8,8,11,0.15)]"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl inline-block">{m.emoji}</span>
              <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                {m.tag}
              </span>
            </div>

            <h3 className="font-display font-bold text-ink-950 text-lg mb-1">{m.title}</h3>
            <p className="text-sm text-ink-900/70 leading-relaxed">{m.desc}</p>

            <div className="mt-4 text-sm font-semibold text-saffron-700">
              Open module →
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom tip card — wraps onto two rows on phones so the CTA button
          drops below the copy instead of squeezing it. */}
      <div className="mt-8 rounded-2xl border border-saffron-200 bg-saffron-50 p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="text-3xl shrink-0">💡</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-900/80 text-sm">Pro tip — start with a Handbook station</p>
          <p className="text-sm text-ink-900/80 mt-0.5">
            Start with a Handbook station — 151 cases map 1:1 to the AMC Handbook 2026.
          </p>
        </div>
        <Link
          href="/dashboard/cat2"
          className="shrink-0 inline-flex items-center rounded-full bg-saffron-500 px-5 py-3 text-sm font-bold text-ink-950 transition hover:bg-saffron-400 whitespace-nowrap min-h-[44px]"
        >
          Try a roleplay →
        </Link>
      </div>
    </div>
  );
}
