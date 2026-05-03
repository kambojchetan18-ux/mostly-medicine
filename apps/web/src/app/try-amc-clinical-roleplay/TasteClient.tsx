"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// Hard cap matches the server. Keep the two in sync.
const MAX_USER_TURNS = 5;

// Pre-baked sample case shown in the page chrome (patient identity, task pill).
// The full clinical detail lives server-side in /api/try-roleplay/route.ts so
// curious users can't cheat by reading the source. Anything user-visible here
// is intentionally surface-level.
const SAMPLE = {
  patientName: "Mr Anil Sharma",
  patientAgeGender: "45-year-old man",
  setting: "GP clinic, walk-in appointment",
  candidateTask:
    "Take a focused history from this patient presenting with chest pain, then explain your differential and immediate plan.",
  openingStatement:
    "Doctor, I've been having this chest pain for the last two hours and I'm a bit worried.",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function tmpId() {
  return `m-${Math.random().toString(36).slice(2, 10)}`;
}

interface ResultCard {
  style: string;
  differentialsExplored: number;
}

export default function TasteClient() {
  // Seed with the patient's hard-coded opening line so the visitor sees the
  // case immediately — no API call needed for turn 0.
  const [messages, setMessages] = useState<Message[]>([
    { id: "seed", role: "assistant", content: SAMPLE.openingStatement },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultCard | null>(null);
  const [classifying, setClassifying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userTurns = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages]
  );
  const turnsRemaining = Math.max(0, MAX_USER_TURNS - userTurns);
  const sessionDone = userTurns >= MAX_USER_TURNS;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Once the user finishes turn 5 AND the patient's reply is in, run the
  // single classification call to populate the result card. Run-once guard
  // via the `result` state — we never re-classify even if the dep changes.
  const classifyAndFinish = useCallback(
    async (history: Message[]) => {
      if (result) return;
      setClassifying(true);
      try {
        const res = await fetch("/api/try-roleplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classify: true,
            history: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok) throw new Error("classify failed");
        const json = (await res.json()) as ResultCard;
        setResult(json);
      } catch {
        // Soft fail — show the CTA card with a sane default rather than
        // strand the user. The server-side classify call also has its own
        // try/catch fallback.
        setResult({ style: "promising", differentialsExplored: 3 });
      } finally {
        setClassifying(false);
      }
    },
    [result]
  );

  const send = useCallback(async () => {
    const content = draft.trim();
    if (!content || sending || sessionDone) return;
    setError(null);

    const localUser: Message = { id: tmpId(), role: "user", content };
    const placeholderId = tmpId();
    const updatedHistory: Message[] = [
      ...messages,
      localUser,
      { id: placeholderId, role: "assistant", content: "" },
    ];
    setMessages(updatedHistory);
    setDraft("");
    setSending(true);

    try {
      const apiHistory = [...messages, localUser].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/try-roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(j.message || j.error || "AI error");
      }
      const json = (await res.json()) as { reply: string };
      const reply = json.reply ?? "";

      const finalMessages: Message[] = updatedHistory.map((m) =>
        m.id === placeholderId ? { ...m, content: reply } : m
      );
      setMessages(finalMessages);

      // If this was the 5th user turn, kick off the classify call as soon as
      // the patient's reply is in. We don't block the patient response on it.
      const userCount = finalMessages.filter((m) => m.role === "user").length;
      if (userCount >= MAX_USER_TURNS) {
        void classifyAndFinish(finalMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the AI patient. Try again.");
      // Drop just the empty assistant placeholder on failure so the user can retry.
      setMessages((m) => m.filter((x) => x.id !== placeholderId));
    } finally {
      setSending(false);
    }
  }, [draft, sending, sessionDone, messages, classifyAndFinish]);

  return (
    <div className="flex flex-col gap-4">
      {/* Patient header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Patient
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {SAMPLE.patientName} <span className="font-normal text-slate-600">· {SAMPLE.patientAgeGender}</span>
          </p>
        </div>
        <span className="hidden text-slate-300 sm:inline">·</span>
        <div className="hidden sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Setting
          </p>
          <p className="text-xs text-slate-700">{SAMPLE.setting}</p>
        </div>
        <span
          className={`ml-auto rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
            sessionDone
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
          }`}
        >
          {sessionDone ? "Session complete" : `Turn ${userTurns + 1} of ${MAX_USER_TURNS}`}
        </span>
      </div>

      {/* Task pill */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-amber-800">
          Your task:{" "}
        </span>
        <span className="text-amber-900">{SAMPLE.candidateTask}</span>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="min-h-[40vh] max-h-[55vh] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-fuchsia-600 text-white"
                  : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
              }`}
            >
              {m.content || (
                <span className="inline-flex gap-1 py-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {/* Composer — hidden after session complete */}
      {!sessionDone && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex gap-2"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={2}
            disabled={sending}
            placeholder={
              userTurns === 0
                ? "Greet the patient and start your history…"
                : "Your next question…"
            }
            className="flex-1 min-w-0 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-base shadow-sm focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 disabled:bg-slate-50 sm:text-sm"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="self-end rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "…" : "Send"}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-500">
        {sessionDone
          ? "Session complete — see your read below"
          : `${turnsRemaining} ${turnsRemaining === 1 ? "turn" : "turns"} left in your free taste`}
      </p>

      {/* Result + CTA card */}
      {sessionDone && (
        <div className="mt-2 rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-white to-amber-50 p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-700">
            Your consultation read
          </p>

          {classifying ? (
            <p className="mt-3 text-sm text-slate-600">
              Reading your consultation…
            </p>
          ) : result ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Differentials explored
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {result.differentialsExplored} <span className="text-base font-normal text-slate-500">of 5</span>
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Pain character · risk factors · family history · prior symptoms ·
                  examination
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Communication style
                </p>
                <p className="mt-1 text-2xl font-bold capitalize text-slate-900">
                  {result.style}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Inferred from how you opened, probed, and closed each turn.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-fuchsia-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              You just experienced 1 of 152 AMC Clinical scenarios.
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Sign up free to save this score, get the full examiner feedback, and
              unlock the rest of the library — paediatrics, psychiatry, obstetrics,
              emergency, and 12 more specialties.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-fuchsia-700"
              >
                Sign up free → unlock 151 more scenarios
              </Link>
              <Link
                href="/amc-clinical-stations-guide"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Read about our methodology
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
