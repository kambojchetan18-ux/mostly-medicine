"use client";

// Left-side quiz navigator: score circle + answered count + clickable grid of
// question numbers with per-question status (correct / wrong / unanswered /
// current). Used by the AMC MCQ quiz screen so users can jump back and forth
// without losing their place.

interface AnswerSnapshot {
  id: string;
  correct: boolean;
  topic: string;
  selected: string;
}

interface QuizNavigatorProps {
  total: number;            // total questions in the visible session pool
  current: number;          // 0-based index of the currently displayed question
  answers: AnswerSnapshot[]; // attempts so far, indexed by question position
  resumedAlreadyDone: number; // attempts from the same session before resume
  onJump: (idx: number) => void;
}

function ScoreRing({ pct, answered }: { pct: number; answered: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const colour =
    pct >= 75 ? "stroke-emerald-500" : pct >= 55 ? "stroke-amber-500" : pct >= 0 ? "stroke-rose-500" : "stroke-gray-300";
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
        <circle cx="36" cy="36" r={r} className="fill-none stroke-gray-200" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          className={`fill-none ${colour} transition-all duration-500`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-gray-900 tabular-nums">{answered ? `${pct}%` : "—"}</span>
      </div>
    </div>
  );
}

function statusFor(idx: number, current: number, answer?: AnswerSnapshot): {
  bg: string;
  ring: string;
  icon: string | null;
  text: string;
} {
  if (idx === current) {
    return { bg: "bg-brand-600", ring: "ring-2 ring-brand-300 ring-offset-1", icon: null, text: "text-white" };
  }
  if (!answer) {
    return { bg: "bg-white border border-gray-200", ring: "", icon: null, text: "text-gray-700" };
  }
  if (answer.correct) {
    return { bg: "bg-emerald-100 border border-emerald-300", ring: "", icon: "✓", text: "text-emerald-700" };
  }
  return { bg: "bg-rose-100 border border-rose-300", ring: "", icon: "✗", text: "text-rose-700" };
}

export default function QuizNavigator({
  total,
  current,
  answers,
  resumedAlreadyDone,
  onJump,
}: QuizNavigatorProps) {
  const answered = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const absoluteCurrent = current + 1 + resumedAlreadyDone;
  const absoluteTotal = total + resumedAlreadyDone;

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-auto">
      <div className="flex items-center gap-3 mb-4">
        <ScoreRing pct={pct} answered={answered} />
        <div className="leading-tight">
          <p className="text-xl font-bold text-gray-900 tabular-nums">{answered}</p>
          <p className="text-[11px] uppercase font-semibold tracking-wider text-gray-500">
            Questions
            <br />
            answered
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 px-3 py-2 mb-3 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          On Question
        </p>
        <p className="text-2xl font-bold text-brand-700 tabular-nums">
          {absoluteCurrent}
          <span className="text-sm font-normal text-gray-400"> / {absoluteTotal}</span>
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: total }).map((_, idx) => {
          const a = answers[idx];
          const s = statusFor(idx, current, a);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onJump(idx)}
              className={`relative aspect-square rounded-lg text-xs font-semibold transition ${s.bg} ${s.ring} ${s.text} hover:brightness-95`}
              aria-label={
                a
                  ? `Question ${idx + 1 + resumedAlreadyDone} — ${a.correct ? "correct" : "wrong"}`
                  : `Question ${idx + 1 + resumedAlreadyDone} — not answered`
              }
            >
              {idx + 1 + resumedAlreadyDone}
              {s.icon && (
                <span
                  className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    s.icon === "✓" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}
                >
                  {s.icon}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          ✓ <span className="text-emerald-600 font-semibold">{correct}</span>
        </span>
        <span>
          ✗ <span className="text-rose-600 font-semibold">{answered - correct}</span>
        </span>
        <span>
          ○ <span className="text-gray-700 font-semibold">{total - answered}</span>
        </span>
      </div>
    </aside>
  );
}
