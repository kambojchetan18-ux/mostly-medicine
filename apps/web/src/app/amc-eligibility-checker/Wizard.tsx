"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Step = {
  id: string;
  question: string;
  help?: string;
  options: { id: string; label: string; detail?: string }[];
};

const STEPS: Step[] = [
  {
    id: "wdoms",
    question: "Is your medical school listed in the World Directory of Medical Schools (WDOMS) with an AMC sponsor note?",
    help: "Check at search.wdoms.org. AMC requires graduates from listed schools.",
    options: [
      { id: "yes", label: "Yes, it's listed" },
      { id: "no", label: "Not listed" },
      { id: "unsure", label: "I haven't checked yet" },
    ],
  },
  {
    id: "degree",
    question: "Have you completed your primary medical qualification (e.g. MBBS, MD)?",
    options: [
      { id: "yes", label: "Yes, fully completed" },
      { id: "internship", label: "Degree done, completing internship" },
      { id: "no", label: "Not yet completed" },
    ],
  },
  {
    id: "epic",
    question: "Have you started or completed EPIC verification (ECFMG)?",
    help: "EPIC is mandatory before AMC will assess your qualifications.",
    options: [
      { id: "verified", label: "Verified" },
      { id: "submitted", label: "Submitted, in progress" },
      { id: "no", label: "Not started" },
    ],
  },
  {
    id: "english",
    question: "What's your English-language status for AHPRA / AMC purposes?",
    help: "AHPRA accepts IELTS Academic 7.0+ each band, OET grade B in each sub-test, or qualifying exemption.",
    options: [
      { id: "exempt", label: "Exempt (training in English-speaking country)" },
      { id: "passed", label: "Passed IELTS 7+ or OET B" },
      { id: "scheduled", label: "Test scheduled / preparing" },
      { id: "none", label: "Haven't tested yet" },
    ],
  },
  {
    id: "cat1",
    question: "Have you sat AMC MCQ?",
    options: [
      { id: "passed", label: "Passed" },
      { id: "failed", label: "Sat, didn't pass" },
      { id: "booked", label: "Booked, not yet sat" },
      { id: "no", label: "Not yet" },
    ],
  },
  {
    id: "cat2",
    question: "Have you sat AMC Handbook AI RolePlay (Clinical / MCAT)?",
    options: [
      { id: "passed", label: "Passed" },
      { id: "failed", label: "Sat, didn't pass" },
      { id: "booked", label: "Booked, not yet sat" },
      { id: "no", label: "Not yet" },
    ],
  },
];

type Answers = Record<string, string>;
type Verdict = {
  status: "eligible" | "almost" | "blocked" | "info";
  title: string;
  summary: string;
  next: string[];
};

function computeVerdict(a: Answers): Verdict {
  // Hard blockers first
  if (a.wdoms === "no") {
    return {
      status: "blocked",
      title: "Not currently eligible",
      summary:
        "Your medical school must be listed in the World Directory of Medical Schools with an AMC-acceptable note. Without this, AMC cannot assess your qualifications.",
      next: [
        "Search for your school at search.wdoms.org",
        "If listed but the AMC sponsor note is missing, contact AMC directly",
        "Consider an alternative pathway (e.g. specialist or competent-authority pathways) if applicable",
      ],
    };
  }
  if (a.degree === "no") {
    return {
      status: "blocked",
      title: "Finish your degree first",
      summary:
        "AMC requires a completed primary medical qualification (MBBS / MD or equivalent) before you can apply.",
      next: [
        "Complete your medical degree",
        "Ideally complete a year of supervised internship in your home country",
        "Then begin EPIC verification",
      ],
    };
  }

  // Already qualified for AHPRA general registration?
  if (a.cat1 === "passed" && a.cat2 === "passed" && (a.english === "passed" || a.english === "exempt") && a.epic === "verified") {
    return {
      status: "eligible",
      title: "You're ready to apply for AHPRA general registration",
      summary:
        "You have passed both AMC exams, met English requirements, and completed EPIC. The standard pathway is complete — apply for AHPRA general registration next.",
      next: [
        "Submit AHPRA application with AMC certificate, identity, English evidence, criminal-history check",
        "Arrange professional indemnity insurance",
        "Apply for RMO positions in state recruitment pools (Feb intakes)",
      ],
    };
  }

  // Ready for AMC Handbook AI RolePlay
  if (a.cat1 === "passed" && (a.epic === "verified" || a.epic === "submitted") && (a.english === "passed" || a.english === "exempt")) {
    return {
      status: "almost",
      title: "Great — focus on AMC Handbook AI RolePlay (Clinical / MCAT)",
      summary:
        "You've cleared AMC MCQ, met English, and EPIC is sorted. The remaining barrier is the multi-station clinical exam.",
      next: [
        "Begin daily clinical roleplay practice across history, exam, counselling and procedural stations",
        "Drill Calgary–Cambridge consultations and SPIKES bad-news scenarios",
        "Run timed mock OSCE circuits before booking your AMC Handbook AI RolePlay sitting",
      ],
    };
  }

  // Ready to sit AMC MCQ
  if ((a.epic === "verified" || a.epic === "submitted") && (a.english === "passed" || a.english === "exempt") && a.cat1 !== "passed") {
    return {
      status: "almost",
      title: "Focus on AMC MCQ next",
      summary:
        "Your prerequisites are in good shape. AMC MCQ is your immediate goal.",
      next: [
        "Aim for 3,000+ practice MCQs across all systems",
        "Use spaced repetition for high-yield facts (drug doses, screening intervals)",
        "Sit at least 3 timed full mock exams before your real sitting",
      ],
    };
  }

  // Need EPIC
  if (a.epic === "no") {
    return {
      status: "almost",
      title: "Start EPIC verification first",
      summary:
        "EPIC (ECFMG) primary-source verification is mandatory before AMC can assess your qualifications. It typically takes 3–6 months.",
      next: [
        "Open an EPIC account at ecfmg.org",
        "Request verification of your medical degree from your school",
        "In parallel, start English prep so the timelines run alongside each other",
      ],
    };
  }

  // Need English
  if (a.english === "none" || a.english === "scheduled") {
    return {
      status: "almost",
      title: "Sort out English testing",
      summary:
        "English-language proficiency is a hard requirement for AHPRA. Without an accepted score (or exemption) you cannot complete registration even if you pass both AMC exams.",
      next: [
        "Choose IELTS Academic (7.0 each band) or OET (grade B each sub-test)",
        "Most IMGs find OET easier — clinical context",
        "Book within 1–2 months and allow a buffer for repeat sittings",
      ],
    };
  }

  // AMC MCQ failed previously
  if (a.cat1 === "failed") {
    return {
      status: "almost",
      title: "Re-strategise for AMC MCQ",
      summary:
        "An AMC MCQ fail is common and does not block re-sitting. Pin down weak areas and convert volume practice into targeted practice.",
      next: [
        "Run analytics on your last attempt — which systems dropped marks?",
        "Cover those topics with focused MCQs + concise theory revision",
        "Re-book AMC MCQ only after consistently scoring 70%+ on full mocks",
      ],
    };
  }

  // AMC Handbook AI RolePlay failed previously
  if (a.cat2 === "failed") {
    return {
      status: "almost",
      title: "Re-strategise for AMC Handbook AI RolePlay",
      summary:
        "Failing AMC Handbook AI RolePlay usually points to communication, time management or applied reasoning gaps — not knowledge gaps.",
      next: [
        "Get examiner-grade feedback on each station type",
        "Drill the Calgary–Cambridge framework until automatic",
        "Run multiple timed mock circuits before re-sitting",
      ],
    };
  }

  // Default
  return {
    status: "info",
    title: "You're on the AMC pathway",
    summary:
      "Based on your answers, you're in active preparation. Use the checklist below to make sure no step is missed.",
    next: [
      "Verify EPIC status and your school's WDOMS sponsor note",
      "Confirm English score is current (within 2 years for AHPRA)",
      "Book AMC MCQ once mock scores are consistent",
    ],
  };
}

const COLORS: Record<Verdict["status"], string> = {
  eligible: "from-emerald-900/60 to-emerald-950/40 border-emerald-700/50",
  almost: "from-violet-900/60 to-pink-950/40 border-violet-700/50",
  blocked: "from-rose-900/60 to-rose-950/40 border-rose-700/50",
  info: "from-indigo-900/60 to-slate-900/40 border-indigo-800/40",
};

const BADGE: Record<Verdict["status"], string> = {
  eligible: "bg-emerald-900/60 text-emerald-200 border-emerald-700/50",
  almost: "bg-violet-900/60 text-violet-200 border-violet-700/50",
  blocked: "bg-rose-900/60 text-rose-200 border-rose-700/50",
  info: "bg-indigo-900/60 text-indigo-200 border-indigo-700/50",
};

export default function Wizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const step = STEPS[stepIdx];
  const verdict = useMemo(() => (done ? computeVerdict(answers) : null), [done, answers]);
  const progress = Math.round(((done ? STEPS.length : stepIdx) / STEPS.length) * 100);

  const choose = (optionId: string) => {
    const next = { ...answers, [step.id]: optionId };
    setAnswers(next);
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setDone(true);
    }
  };

  const back = () => {
    if (done) {
      setDone(false);
      return;
    }
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const restart = () => {
    setAnswers({});
    setStepIdx(0);
    setDone(false);
  };

  return (
    <div className="rounded-3xl border border-violet-800/30 bg-gradient-to-br from-violet-950/60 via-indigo-950/40 to-slate-900/80 p-6 sm:p-10 backdrop-blur-sm">
      {/* Progress */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="text-slate-500 uppercase tracking-widest font-bold">
            {done ? "Result" : `Step ${stepIdx + 1} of ${STEPS.length}`}
          </span>
          <span className="font-display font-bold gradient-text">{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #db2777)",
            }}
          />
        </div>
      </div>

      {!done && step && (
        <div>
          <h2 className="font-display font-bold text-white text-xl sm:text-2xl mb-2 leading-snug">
            {step.question}
          </h2>
          {step.help && <p className="text-sm text-slate-400 mb-5">{step.help}</p>}
          <div className="space-y-2.5">
            {step.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                className="w-full text-left px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800/80 hover:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              >
                <p className="font-semibold text-white text-base">{opt.label}</p>
                {opt.detail && <p className="text-xs text-slate-400 mt-1">{opt.detail}</p>}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={back}
              disabled={stepIdx === 0}
              className="text-sm text-slate-400 hover:text-white disabled:text-slate-700 disabled:cursor-not-allowed font-medium transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={restart}
              className="text-xs text-slate-600 hover:text-slate-400 font-medium transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {done && verdict && (
        <div>
          <div className={`rounded-2xl border bg-gradient-to-br ${COLORS[verdict.status]} p-6 sm:p-7`}>
            <div className="mb-3">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-widest uppercase ${BADGE[verdict.status]}`}
              >
                {verdict.status === "eligible" && "Eligible"}
                {verdict.status === "almost" && "Almost there"}
                {verdict.status === "blocked" && "Action needed"}
                {verdict.status === "info" && "In progress"}
              </span>
            </div>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-3">
              {verdict.title}
            </h2>
            <p className="text-slate-300 leading-relaxed">{verdict.summary}</p>
          </div>

          <div className="mt-7">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">
              Recommended next steps
            </p>
            <ul className="space-y-2.5">
              {verdict.next.map((n, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/signup"
              className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                boxShadow: "0 8px 30px rgba(124,58,237,0.35)",
              }}
            >
              Start prep free →
            </Link>
            <button
              onClick={restart}
              className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-slate-300 border border-slate-700 hover:bg-white/5 hover:border-slate-500 transition-all"
            >
              Restart wizard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
