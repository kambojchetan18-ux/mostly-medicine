"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Milestone = {
  id: string;
  label: string;
  detail: string;
  daysBefore: number; // days before the FIRST anchor (CAT 1 unless reversed)
  emoji: string;
  color: string;
  anchor: "cat1" | "cat2";
};

const MILESTONES: Milestone[] = [
  // Anchored to CAT 1 date (Part 1 phase)
  {
    id: "english",
    anchor: "cat1",
    daysBefore: 365,
    label: "Start English prep",
    detail: "Begin IELTS or OET preparation. Aim for OET grade B in all 4 components or IELTS 7.0 in each band.",
    emoji: "🗣️",
    color: "from-amber-900/40 to-amber-950/30 border-amber-800/40",
  },
  {
    id: "epic",
    anchor: "cat1",
    daysBefore: 300,
    label: "Submit EPIC verification",
    detail: "Open ECFMG EPIC account, request primary-source verification of your medical degree. Allow 3–6 months.",
    emoji: "📨",
    color: "from-cyan-900/40 to-cyan-950/30 border-cyan-800/40",
  },
  {
    id: "english-sit",
    anchor: "cat1",
    daysBefore: 240,
    label: "Sit English exam",
    detail: "Book and complete OET or IELTS. Results valid 3 years.",
    emoji: "📝",
    color: "from-amber-900/40 to-amber-950/30 border-amber-800/40",
  },
  {
    id: "mcq-foundation",
    anchor: "cat1",
    daysBefore: 180,
    label: "MCQ foundation phase",
    detail: "Build core knowledge. Murtagh's General Practice + RACGP Red Book + 1,500+ MCQs across all systems.",
    emoji: "📚",
    color: "from-indigo-900/40 to-indigo-950/30 border-indigo-800/40",
  },
  {
    id: "mcq-revision",
    anchor: "cat1",
    daysBefore: 90,
    label: "MCQ revision phase",
    detail: "Target weak areas. Spaced repetition for high-yield facts. 1,500+ more MCQs.",
    emoji: "🔁",
    color: "from-violet-900/40 to-violet-950/30 border-violet-800/40",
  },
  {
    id: "mcq-mocks",
    anchor: "cat1",
    daysBefore: 30,
    label: "Full mock exams",
    detail: "Sit at least 3 timed full-length 150-question mocks (3.5 hours) under exam conditions.",
    emoji: "⏱️",
    color: "from-violet-900/40 to-violet-950/30 border-violet-800/40",
  },
  {
    id: "cat1-exam",
    anchor: "cat1",
    daysBefore: 0,
    label: "AMC MCQ exam day",
    detail: "Pearson VUE centre in Australia. 150 MCQs, 3.5 hours.",
    emoji: "🎯",
    color: "from-pink-900/50 to-pink-950/30 border-pink-700/50",
  },
  // Anchored to CAT 2 date (Part 2 phase)
  {
    id: "clinical-start",
    anchor: "cat2",
    daysBefore: 150,
    label: "Begin clinical phase",
    detail: "Start MCAT roleplays — history, exam, counselling, procedural. Daily practice from this point.",
    emoji: "🩺",
    color: "from-rose-900/40 to-rose-950/30 border-rose-800/40",
  },
  {
    id: "frameworks",
    anchor: "cat2",
    daysBefore: 90,
    label: "Drill frameworks",
    detail: "Calgary-Cambridge consultations, SOCRATES pain history, SPIKES bad news. Build muscle memory.",
    emoji: "🧩",
    color: "from-fuchsia-900/40 to-fuchsia-950/30 border-fuchsia-800/40",
  },
  {
    id: "clinical-mocks",
    anchor: "cat2",
    daysBefore: 30,
    label: "Mock OSCE circuits",
    detail: "Run timed 16-station mock circuits with a partner or AI examiner. Refine timing under 8 minutes.",
    emoji: "🏥",
    color: "from-pink-900/40 to-pink-950/30 border-pink-800/40",
  },
  {
    id: "cat2-exam",
    anchor: "cat2",
    daysBefore: 0,
    label: "AMC Handbook AI RolePlay exam day",
    detail: "MCAT clinical exam in Melbourne or Adelaide.",
    emoji: "🏁",
    color: "from-emerald-900/50 to-emerald-950/30 border-emerald-700/50",
  },
];

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const subtractDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const isValidDate = (s: string) => !isNaN(new Date(s).getTime());

export default function Planner() {
  // Default: ~12 months out for CAT 1, ~18 months out for CAT 2
  const todayPlus = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
  };
  const [cat1Date, setCat1Date] = useState(todayPlus(12));
  const [cat2Date, setCat2Date] = useState(todayPlus(18));

  const items = useMemo(() => {
    if (!isValidDate(cat1Date) || !isValidDate(cat2Date)) return [];
    const c1 = new Date(cat1Date);
    const c2 = new Date(cat2Date);
    return MILESTONES.map((m) => {
      const anchor = m.anchor === "cat1" ? c1 : c2;
      return { ...m, date: subtractDays(anchor, m.daysBefore) };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [cat1Date, cat2Date]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthsToCat1 = useMemo(() => {
    if (!isValidDate(cat1Date)) return 0;
    const ms = new Date(cat1Date).getTime() - today.getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24 * 30)));
  }, [cat1Date, today]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-3xl border border-violet-800/30 bg-gradient-to-br from-violet-950/60 via-indigo-950/40 to-slate-900/80 p-6 sm:p-8 backdrop-blur-sm">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cat1-date" className="block text-sm font-semibold text-slate-200 mb-2">
              AMC MCQ target date
            </label>
            <input
              id="cat1-date"
              type="date"
              value={cat1Date}
              onChange={(e) => setCat1Date(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white font-medium focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="cat2-date" className="block text-sm font-semibold text-slate-200 mb-2">
              AMC Handbook AI RolePlay target date
            </label>
            <input
              id="cat2-date"
              type="date"
              value={cat2Date}
              onChange={(e) => setCat2Date(e.target.value)}
              min={cat1Date}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-colors"
            />
          </div>
        </div>
        {monthsToCat1 > 0 && (
          <p className="text-sm text-slate-400 mt-4">
            <span className="font-display font-bold gradient-text text-lg">{monthsToCat1}</span> months until your AMC MCQ exam.
          </p>
        )}
      </div>

      {/* Timeline */}
      <ol className="relative border-l-2 border-slate-800 ml-3 space-y-5">
        {items.map((m) => {
          const past = m.date.getTime() < today.getTime();
          return (
            <li key={m.id} className="ml-7 relative">
              <span
                className={`absolute -left-[2.45rem] top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                  past
                    ? "bg-slate-800 border-slate-700 text-slate-500"
                    : "bg-violet-600 border-violet-400 text-white"
                }`}
                aria-hidden
              >
                {past ? "✓" : ""}
              </span>
              <div
                className={`rounded-2xl border bg-gradient-to-br ${m.color} p-5 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.emoji}</span>
                    <h3 className="font-display font-bold text-white text-lg">{m.label}</h3>
                  </div>
                  <p className={`text-sm font-mono ${past ? "text-slate-500 line-through" : "text-violet-200"}`}>
                    {fmtDate(m.date)}
                  </p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{m.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
