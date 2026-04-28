"use client";

import Link from "next/link";
import { useState } from "react";

type CheckItem = { id: string; text: string; note?: string };
type Section = {
  id: string;
  emoji: string;
  title: string;
  tag: string;
  tagColor: string;
  gradient: string;
  border: string;
  items: CheckItem[];
};

const sections: Section[] = [
  {
    id: "eligibility",
    emoji: "📋",
    title: "Eligibility & Application",
    tag: "STEP 1",
    tagColor: "text-violet-300 bg-violet-900/40 border-violet-700/40",
    gradient: "from-violet-950/80 via-indigo-950/60 to-slate-900/80",
    border: "border-violet-800/30",
    items: [
      { id: "e1", text: "Confirm your primary medical degree is AMC-accepted", note: "Check the AMC Recognised Overseas Qualifications list" },
      { id: "e2", text: "Create an AMC Online Services account at amc.org.au" },
      { id: "e3", text: "Submit Medical Qualification Assessment (MQA) application" },
      { id: "e4", text: "Upload certified copy of your primary medical degree" },
      { id: "e5", text: "Upload certified academic transcripts (all years)" },
      { id: "e6", text: "Provide certified English translations if degree is not in English" },
      { id: "e7", text: "Obtain a Certificate of Good Standing from your home medical board" },
      { id: "e8", text: "Submit proof of identity (passport or equivalent)" },
      { id: "e9", text: "Pay MQA application fee (check current AMC fee schedule)" },
      { id: "e10", text: "Receive AMC confirmation of eligibility before booking exams" },
    ],
  },
  {
    id: "cat1",
    emoji: "🧠",
    title: "AMC MCQ — Exam",
    tag: "STEP 2",
    tagColor: "text-indigo-300 bg-indigo-900/40 border-indigo-700/40",
    gradient: "from-indigo-950/80 via-violet-950/60 to-slate-900/80",
    border: "border-indigo-800/30",
    items: [
      { id: "c1a", text: "Read the AMC MCQ Examination Handbook (latest edition)", note: "Available free on amc.org.au" },
      { id: "c1b", text: "Download and study the AMC Content Outline (blueprint)", note: "Tells you exactly what topics are tested and their weighting" },
      { id: "c1c", text: "Complete at least 3,000 practice MCQs across all systems", note: "Use Mostly Medicine AMC MCQ for spaced repetition" },
      { id: "c1d", text: "Cover all major systems: Cardiology, Respiratory, Gastro, Neurology, Endocrinology, O&G, Paediatrics, Psychiatry, Surgery, MSK, Dermatology" },
      { id: "c1e", text: "Study eTG (Therapeutic Guidelines) for Australian treatment protocols" },
      { id: "c1f", text: "Learn Australian drug names, doses, and first-line choices" },
      { id: "c1g", text: "Focus on population health, screening, and preventive care (RACGP Red Book)" },
      { id: "c1h", text: "Review ethics — AMC Good Medical Practice framework" },
      { id: "c1i", text: "Practice timed mock exams (150 questions in 3.5 hours)" },
      { id: "c1j", text: "Book AMC MCQ exam at a Pearson VUE test centre in Australia" },
      { id: "c1k", text: "Confirm test centre location and bring valid photo ID on exam day" },
      { id: "c1l", text: "Receive AMC MCQ result (pass/fail) — allows progression to AMC Handbook AI RolePlay" },
    ],
  },
  {
    id: "cat2",
    emoji: "🩺",
    title: "AMC Handbook AI RolePlay — Clinical Exam",
    tag: "STEP 3",
    tagColor: "text-pink-300 bg-pink-900/40 border-pink-700/40",
    gradient: "from-pink-950/80 via-rose-950/60 to-slate-900/80",
    border: "border-pink-800/30",
    items: [
      { id: "c2a", text: "Read the AMC Handbook AI RolePlay Clinical Examination Handbook thoroughly" },
      { id: "c2b", text: "Understand the OSCE format: 16 stations × 8 minutes each", note: "Each station has a 2-min reading time outside the door" },
      { id: "c2c", text: "Learn the 7 clinical domains: History, Physical Exam, Diagnosis, Investigations, Management, Communication, Procedural" },
      { id: "c2d", text: "Study all 151 official MCAT cases across clinical categories", note: "Available in Mostly Medicine AMC Handbook AI RolePlay" },
      { id: "c2e", text: "Practise structured clinical consultations out loud — don't just read" },
      { id: "c2f", text: "Master the Calgary-Cambridge communication model for patient-centred consultations" },
      { id: "c2g", text: "Practise breaking bad news using SPIKES / ABCDE framework" },
      { id: "c2h", text: "Review mandatory reporting obligations (DFV, child abuse, notifiable diseases)" },
      { id: "c2i", text: "Practise consent, capacity assessment, and advance care planning scenarios" },
      { id: "c2j", text: "Learn key procedural steps: suturing, IV cannulation, airway management, CPR" },
      { id: "c2k", text: "Do mock OSCE sessions with a partner — simulate exam conditions" },
      { id: "c2l", text: "Receive AI feedback after each Mostly Medicine roleplay session" },
      { id: "c2m", text: "Book AMC Handbook AI RolePlay exam at AMC Clinical Examination Centre (Melbourne or Adelaide)" },
    ],
  },
  {
    id: "registration",
    emoji: "🏥",
    title: "After AMC — Registration & Jobs",
    tag: "STEP 4",
    tagColor: "text-emerald-300 bg-emerald-900/40 border-emerald-700/40",
    gradient: "from-emerald-950/80 to-slate-900/80",
    border: "border-emerald-800/30",
    items: [
      { id: "r1", text: "Receive AMC Certificate (issued after passing both AMC MCQ and AMC Handbook AI RolePlay)" },
      { id: "r2", text: "Apply for General Registration with AHPRA (ahpra.gov.au)" },
      { id: "r3", text: "Submit AHPRA application: AMC Certificate, identity documents, English proficiency (if required), criminal history check" },
      { id: "r4", text: "Obtain Professional Indemnity Insurance before starting work" },
      { id: "r5", text: "Apply for RMO (Resident Medical Officer) positions via state hospital recruitment pools", note: "Applications usually open Mar–May for Feb start" },
      { id: "r6", text: "Prepare your medical CV in Australian format (1–2 pages, referees listed)" },
      { id: "r7", text: "Apply to ACT, NSW, VIC, QLD, SA, WA, TAS, NT recruitment portals" },
      { id: "r8", text: "Check Mostly Medicine Jobs board for current IMG-friendly RMO roles" },
      { id: "r9", text: "Consider GP pathway (RACGP or ACRRM training) if general practice is your goal" },
      { id: "r10", text: "Organise arrival logistics: Medicare enrolment, TFN, bank account, AHPRA registration card" },
    ],
  },
  {
    id: "english",
    emoji: "🗣️",
    title: "English Language Requirements",
    tag: "REQUIREMENT",
    tagColor: "text-amber-300 bg-amber-900/40 border-amber-700/40",
    gradient: "from-amber-950/70 to-slate-900/80",
    border: "border-amber-800/30",
    items: [
      { id: "en1", text: "Confirm whether you meet the English exemption criteria (primary degree taught in English, 5+ years practice in English-speaking country)", note: "See AHPRA English Language Skills Registration Standard" },
      { id: "en2", text: "If required: sit OET (Occupational English Test) — minimum B in all 4 components", note: "OET is strongly preferred by AMC/AHPRA over IELTS" },
      { id: "en3", text: "Alternative: IELTS Academic — minimum 7.0 in each band (7.5 overall)", note: "Scores must be no more than 3 years old at time of application" },
      { id: "en4", text: "Book OET via occupationalenglishtest.com — Medicine paper is specific to clinical scenarios" },
      { id: "en5", text: "Allow 6–12 weeks to receive OET results" },
      { id: "en6", text: "Submit English evidence with AHPRA registration application" },
    ],
  },
  {
    id: "timeline",
    emoji: "📅",
    title: "Typical Timeline & Tips",
    tag: "PLANNING",
    tagColor: "text-cyan-300 bg-cyan-900/40 border-cyan-700/40",
    gradient: "from-cyan-950/70 to-slate-900/80",
    border: "border-cyan-800/30",
    items: [
      { id: "t1", text: "MQA assessment: allow 3–6 months from submission to outcome" },
      { id: "t2", text: "AMC MCQ preparation: most candidates study 4–9 months" },
      { id: "t3", text: "AMC MCQ → AMC Handbook AI RolePlay gap: minimum 6 weeks; most candidates allow 3–6 months" },
      { id: "t4", text: "AMC Handbook AI RolePlay preparation: most candidates dedicate 3–6 months of focused OSCE practice" },
      { id: "t5", text: "AHPRA registration: 4–8 weeks after submitting complete application" },
      { id: "t6", text: "RMO start date: February (main intake) — apply the preceding year" },
      { id: "t7", text: "Budget for exam fees: MQA + AMC MCQ + AMC Handbook AI RolePlay combined is approximately AUD $3,000–$4,000" },
      { id: "t8", text: "Join IMG support groups (Facebook, Reddit r/medicine_australia) for peer support" },
      { id: "t9", text: "Find a study partner for AMC Handbook AI RolePlay practice — consistency is key" },
    ],
  },
];

export default function AMCChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((totalChecked / totalItems) * 100);

  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">

      {/* Ambient blobs */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-violet-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] bg-indigo-800/10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <Link href="/" className="font-display font-bold text-[1.15rem] tracking-tight">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow-violet hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-14 pb-16 text-center">
        <div className="inline-flex items-center gap-2.5 bg-violet-900/30 border border-violet-700/40 rounded-full px-5 py-2 text-xs text-violet-300 font-semibold mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse shrink-0" />
          Complete IMG Guide · AMC 2026 Handbook Aligned · Free to use
        </div>

        <h1 className="font-display font-bold text-white mb-5" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
          AMC Exam{" "}
          <span className="gradient-text">Checklist</span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
          Every step an International Medical Graduate needs to pass the AMC and gain Australian medical registration — from application to first day as an RMO.
        </p>

        {/* Progress bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-slate-400 font-medium">Your progress</span>
            <span className="font-display font-bold gradient-text">{totalChecked} / {totalItems} complete</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #7c3aed, #db2777)",
              }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-2">{pct}% of your AMC journey ticked off</p>
        </div>
      </section>

      {/* Sections */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-28 space-y-6">
        {sections.map((section) => {
          const sectionChecked = section.items.filter((i) => checked[i.id]).length;
          const sectionPct = Math.round((sectionChecked / section.items.length) * 100);

          return (
            <div
              key={section.id}
              className={`rounded-3xl border backdrop-blur-sm overflow-hidden bg-gradient-to-br ${section.gradient} ${section.border}`}
            >
              {/* Section header */}
              <div className="px-7 pt-7 pb-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{section.emoji}</span>
                    <div>
                      <div className="mb-1.5">
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border tracking-widest uppercase ${section.tagColor}`}>
                          {section.tag}
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-white text-xl">{section.title}</h2>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-lg gradient-text">{sectionChecked}/{section.items.length}</p>
                    <div className="w-20 h-1.5 bg-slate-800/60 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${sectionPct}%`,
                          background: "linear-gradient(90deg, #7c3aed, #db2777)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <ul className="px-7 pb-7 space-y-2">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-3.5 text-left group py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      {/* Checkbox */}
                      <span
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                          checked[item.id]
                            ? "border-violet-500 bg-violet-600"
                            : "border-slate-600 bg-slate-800/50 group-hover:border-slate-400"
                        }`}
                      >
                        {checked[item.id] && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug transition-colors ${checked[item.id] ? "line-through text-slate-600" : "text-slate-200"}`}>
                          {item.text}
                        </p>
                        {item.note && (
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.note}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-24 text-center">
        <div
          className="rounded-3xl p-10 sm:p-14 border border-violet-800/25 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(219,39,119,0.10) 60%, rgba(15,15,30,0.7) 100%)" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #7c3aed 0%, transparent 70%)" }} />

          <p className="text-5xl mb-5">🎓</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to start preparing?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base leading-relaxed">
            Use Mostly Medicine to practice 3,000+ MCQs, run AI clinical roleplays, and get examiner-grade feedback — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-display font-bold text-lg text-white hover:opacity-90 transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
              }}
            >
              Start free ✨
            </Link>
            <Link
              href="/dashboard/cat1"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-lg text-slate-300 border border-slate-700 hover:bg-white/5 hover:border-slate-500 transition-all backdrop-blur-sm"
            >
              Practice AMC MCQ questions →
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-5">No credit card · Instant access · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/80 py-8 text-center">
        <p className="font-display font-bold text-sm mb-1">
          <span className="gradient-text">Mostly Medicine</span>
          <span className="text-slate-700"> · AMC Exam Preparation</span>
        </p>
        <p className="text-xs text-slate-700 mt-1">
          Built for IMGs · Powered by Claude AI · Aligned with AMC Handbook 2026
        </p>
      </footer>
    </main>
  );
}
