import Link from "next/link";

interface Props {
  module: "acrp_solo" | "acrp_live" | "roleplay";
  currentPlan: string;
}

const COPY = {
  acrp_solo: {
    title: "AI Clinical RolePlay — Solo",
    bullets: [
      "Unlimited AI-generated AMC-style cases",
      "Voice-driven 8-minute consultations with TTS responses",
      "Structured examiner feedback against the AMC rubric",
    ],
    minPlan: "Pro",
  },
  acrp_live: {
    title: "AI Clinical RolePlay — Live (2-player)",
    bullets: [
      "Practice with a real partner over video + audio",
      "One plays doctor, one plays patient — both get briefings",
      "AI examiner scores the doctor and rates patient portrayal",
    ],
    minPlan: "Enterprise",
  },
  roleplay: {
    title: "AMC Handbook RolePlay — CAT 2",
    bullets: [
      "Practice with handbook-aligned AMC scenarios",
      "Voice-enabled 8-minute consultations with the AI patient",
      "Examiner-style feedback after every session",
    ],
    minPlan: "Pro",
  },
} as const;

export default function UpgradeGate({ module, currentPlan }: Props) {
  const c = COPY[module];
  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 p-8 text-center shadow-sm">
        <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
          Premium module
        </span>
        <h1 className="mt-4 text-xl font-bold text-gray-900">{c.title}</h1>
        <p className="mt-1 text-xs text-gray-500">
          You are on the <span className="font-semibold uppercase">{currentPlan}</span> plan.
          This module needs <span className="font-semibold">{c.minPlan}</span>.
        </p>
        <ul className="mt-5 space-y-2 text-left text-sm text-gray-700">
          {c.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-violet-500">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard/billing"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
        >
          View plans
        </Link>
        <p className="mt-3 text-xs text-gray-400">
          <Link href="/dashboard" className="underline hover:text-gray-600">
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
