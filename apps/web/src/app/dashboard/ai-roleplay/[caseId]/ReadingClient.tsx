"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const READING_SECONDS = 120; // 2 minutes

interface Stem {
  presentingComplaint: string;
  setting: string;
  candidateTask: string;
  visiblePatientContext: string;
}

interface Props {
  caseId: string;
  difficulty: string;
  stationStem: Stem;
  patientName: string;
  candidateTask: string;
  setting: string;
}

export default function ReadingClient({
  caseId,
  difficulty,
  stationStem,
  patientName,
  candidateTask,
  setting,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(READING_SECONDS);
  const [autoStart, setAutoStart] = useState(true);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (autoStart) {
        // Auto-redirect to roleplay phase when timer ends
        window.location.href = `/dashboard/ai-roleplay/${caseId}/play`;
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, autoStart, caseId]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");
  const pct = (secondsLeft / READING_SECONDS) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ai-roleplay" className="text-xs text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
          {difficulty}
        </span>
      </div>

      {/* Timer */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Reading time</p>
            <p className="mt-0.5 text-3xl font-bold tabular-nums text-brand-900">
              {mm}:{ss}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAutoStart(false);
              window.location.href = `/dashboard/ai-roleplay/${caseId}/play`;
            }}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
          >
            Start Roleplay →
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full bg-brand-600 transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Reading card — single scenario paragraph + task pill, AMC-style */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scenario</p>
        <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-900">
          {stationStem.visiblePatientContext ||
            `${patientName} presents to ${setting || "your clinic"} for assessment.`}
        </p>

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Your task</p>
          <p className="mt-1 text-sm font-medium text-amber-900">
            {stationStem.candidateTask || candidateTask || "Take a focused history and discuss your impression."}
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        When the timer ends you will move to the 8-minute roleplay automatically. You can also start early.
      </p>
    </div>
  );
}
