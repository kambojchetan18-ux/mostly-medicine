import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StreakHeatmap from "@/components/StreakHeatmap";

const modules = [
  {
    href:     "/dashboard/cat1",
    emoji:    "🧠",
    tag:      "AMC PART 1",
    tagColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    title:    "AMC MCQ",
    subtitle: "Multiple Choice Questions",
    desc:     "3 000+ MCQs with spaced repetition, weak-area targeting, and AI-powered explanations.",
    gradient: "from-indigo-50 to-violet-50",
    border:   "border-indigo-100 hover:border-indigo-300",
    accent:   "bg-indigo-500",
    span:     "md:col-span-2",
    badge:    "AMC Part 1",
  },
  {
    href:     "/dashboard/cat2",
    emoji:    "🩺",
    tag:      "AMC PART 2",
    tagColor: "text-pink-600 bg-pink-50 border-pink-200",
    title:    "AMC Handbook AI RolePlay",
    subtitle: "AI Patient Role-Play",
    desc:     "Simulate OSCE consultations with an AI patient. Handbook-aligned scenarios. Examiner feedback.",
    gradient: "from-pink-50 to-rose-50",
    border:   "border-pink-100 hover:border-pink-300",
    accent:   "bg-pink-500",
    span:     "",
    badge:    "OSCE Prep",
  },
  {
    href:     "/dashboard/ai-roleplay",
    emoji:    "🎙️",
    tag:      "BEYOND HANDBOOK",
    tagColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    title:    "AMC Clinical AI RolePlay",
    subtitle: "Unlimited Cases · AI Examiner",
    desc:     "Practise hundreds of synthesised AMC scenarios beyond the handbook. Voice consults with AI patients and instant examiner feedback.",
    gradient: "from-fuchsia-50 to-purple-50",
    border:   "border-fuchsia-100 hover:border-fuchsia-300",
    accent:   "bg-fuchsia-500",
    span:     "",
    badge:    "Voice Practice",
  },
  {
    href:     "/dashboard/ai-roleplay/live",
    emoji:    "🎥",
    tag:      "LIVE · 2-PLAYER",
    tagColor: "text-rose-600 bg-rose-50 border-rose-200",
    title:    "AMC Peer RolePlay",
    subtitle: "Real Candidate · Real Feedback",
    desc:     "Pair up with another candidate over live video and roleplay AMC scenarios. Examiner-grade feedback on the conversation afterwards.",
    gradient: "from-rose-50 to-pink-50",
    border:   "border-rose-100 hover:border-rose-300",
    accent:   "bg-rose-500",
    span:     "",
    badge:    "Live Video",
  },
  {
    href:     "/dashboard/reference",
    emoji:    "📖",
    tag:      "REFERENCE",
    tagColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    title:    "Reference Library",
    subtitle: "Murtagh · Red Book · AMC Handbook",
    desc:     "Clinical summaries, preventive care guidelines, and AMC exam blueprints.",
    gradient: "from-emerald-50 to-teal-50",
    border:   "border-emerald-100 hover:border-emerald-300",
    accent:   "bg-emerald-500",
    span:     "",
    badge:    "Resources",
  },
  {
    href:     "/dashboard/library",
    emoji:    "📚",
    tag:      "LIBRARY",
    tagColor: "text-amber-600 bg-amber-50 border-amber-200",
    title:    "Study Library",
    subtitle: "Notes · Documents · AI Search",
    desc:     "Upload and search your study materials with AI-powered retrieval.",
    gradient: "from-amber-50 to-orange-50",
    border:   "border-amber-100 hover:border-amber-300",
    accent:   "bg-amber-500",
    span:     "",
    badge:    "Notes",
  },
  {
    href:     "/amc-fee-calculator?source=dashboard",
    emoji:    "💰",
    tag:      "COST PLANNER",
    tagColor: "text-cyan-700 bg-cyan-50 border-cyan-200",
    title:    "Plan your AMC costs",
    subtitle: "Live calculator · AUD/USD/INR",
    desc:     "Live calculator: see your AUD/USD/INR total in 30 seconds.",
    gradient: "from-cyan-50 to-sky-50",
    border:   "border-cyan-100 hover:border-cyan-300",
    accent:   "bg-cyan-500",
    span:     "",
    badge:    "Cost",
  },
  {
    href:     "/dashboard/jobs",
    emoji:    "💼",
    tag:      "CAREERS",
    tagColor: "text-lime-700 bg-lime-50 border-lime-200",
    title:    "Australian Jobs",
    subtitle: "RMO Pools · GP Pathway · Tracker",
    desc:     "Find RMO positions, explore the GP pathway, and track your applications.",
    gradient: "from-lime-50 to-green-50",
    border:   "border-lime-100 hover:border-lime-300",
    accent:   "bg-lime-500",
    span:     "md:col-span-2",
    badge:    "🇦🇺 Jobs",
  },
];

const quickStats = [
  { emoji: "🎯", value: "151",   label: "MCAT Scenarios",   color: "text-brand-600" },
  { emoji: "📝", value: "3k+",   label: "Practice MCQs",    color: "text-pink-600"   },
  { emoji: "📖", value: "5",     label: "Reference Guides", color: "text-emerald-600"},
  { emoji: "🇦🇺", value: "100+", label: "Job Listings",     color: "text-amber-600"  },
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
          <h2 className="font-display text-3xl font-bold text-gray-900">Welcome back, {firstName} 👋</h2>
        </div>
        <p className="text-slate-500 text-sm">Choose a module to continue your AMC preparation.</p>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-card flex items-center gap-3">
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <div>
              <p className={`font-display font-bold text-xl leading-none ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Streak heatmap — daily MCQ activity, dopamine-loop retention */}
      <div className="mb-8">
        <StreakHeatmap />
      </div>

      {/* Module bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`
              group relative overflow-hidden rounded-3xl p-6 border bg-gradient-to-br ${m.gradient} ${m.border}
              shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${m.span}
            `}
          >
            {/* Accent bar top */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${m.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
                {m.emoji}
              </span>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full border tracking-widest uppercase ${m.tagColor}`}>
                {m.tag}
              </span>
            </div>

            <h3 className="font-display font-bold text-gray-900 text-lg mb-0.5">{m.title}</h3>
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">{m.subtitle}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors duration-200">
              Open module
              <span className="group-hover:translate-x-1 transition-transform duration-150">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom tip card — wraps onto two rows on phones so the CTA button
          drops below the copy instead of squeezing it. */}
      <div className="mt-8 rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="text-3xl shrink-0">💡</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 text-sm">Pro tip — start with AMC Handbook AI RolePlay</p>
          <p className="text-xs text-slate-500 mt-0.5">
            The AMC MCAT is an 8-minute OSCE. Practising with AI patients builds speed and confidence faster than MCQs alone.
          </p>
        </div>
        <Link
          href="/dashboard/cat2"
          className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center"
        >
          Try a roleplay →
        </Link>
      </div>
    </div>
  );
}
