"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What's the first-line management of acute coronary syndrome per eTG?",
  "How do I structure a SOCRATES pain history in an AMC station?",
  "What are the AHPRA English language requirements for IMGs?",
  "Explain the Calgary–Cambridge consultation model in 2 minutes.",
];

const MAX_TASTE_QUESTIONS = 3;

export default function AskAiTaste() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reachedLimit, setReachedLimit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const userTurns = messages.filter((m) => m.role === "user").length;

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || reachedLimit) return;
    if (userTurns >= MAX_TASTE_QUESTIONS) {
      setReachedLimit(true);
      return;
    }

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai-taste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (res.status === 429 && data?.error === "taste_limit_reached") {
        setReachedLimit(true);
        return;
      }
      if (!res.ok || data?.error) throw new Error(data?.error ?? "Request failed");

      setMessages([...next, { role: "assistant", content: data.reply ?? "" }]);
      if (next.filter((m) => m.role === "user").length >= MAX_TASTE_QUESTIONS) {
        setReachedLimit(true);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry — the AI service hit an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-emerald-800/40 bg-slate-950/70 backdrop-blur p-5 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.08)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Ask AI · Free taste · {MAX_TASTE_QUESTIONS - userTurns} of {MAX_TASTE_QUESTIONS} questions left</p>
      </div>

      <div ref={scrollRef} className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              Ask anything about clinical medicine or AMC exam prep. Answers are grounded in Murtagh, RACGP, AMC Handbook and eTG. No signup needed for the first {MAX_TASTE_QUESTIONS} questions.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => ask(p)}
                  disabled={loading}
                  className="text-left rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-700 px-3 py-2.5 text-xs text-slate-300 transition disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600/90 text-white"
                    : "bg-slate-800/80 text-slate-100 border border-slate-700"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 bg-slate-800/60 text-xs text-slate-400 border border-slate-700">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {reachedLimit ? (
        <div className="mt-5 rounded-2xl border border-emerald-700/40 bg-emerald-900/20 p-5">
          <p className="text-sm font-semibold text-emerald-200 mb-1">
            You&apos;ve used your {MAX_TASTE_QUESTIONS} free questions ✨
          </p>
          <p className="text-xs text-slate-300 mb-4">
            Sign up free (no credit card) and keep asking. Free plan also unlocks 20 MCQs/day, 1 AMC Clinical RolePlay/day, and 2 AMC Handbook RolePlays/day.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-2 transition"
            >
              Sign up free →
            </Link>
            <Link
              href="/dashboard/ask-ai"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-4 py-2 transition"
            >
              Already a member? Continue →
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="mt-5 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a clinical or AMC-prep question…"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask →
          </button>
        </form>
      )}
    </div>
  );
}
