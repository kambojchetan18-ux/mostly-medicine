"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What's the first-line treatment for ACS according to eTG?",
  "How do I structure a SOCRATES pain history in an AMC station?",
  "Summarise the RACGP approach to hypertension in IMG-friendly terms.",
  "What are the common pitfalls in AMC Handbook communication stations?",
];

export default function AskAiClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const abortRef = useRef<AbortController | null>(null);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Abort any in-flight request before starting a new one
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    // 30-second timeout to prevent hanging connections
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/library-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Server error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry — the request timed out. Please try again." },
        ]);
      } else {
        const msg = err instanceof Error ? err.message : "Request failed";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Sorry — ${msg}. Please try again.` },
        ]);
      }
    } finally {
      clearTimeout(timeout);
      abortRef.current = null;
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-700 mb-1">
          ✨ Ask AI
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Your AMC study mentor on call</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ask anything about clinical medicine or AMC exam prep. Answers are grounded in Murtagh, RACGP, the AMC Handbook and eTG. Streamed live from Claude Haiku 4.5.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div ref={scrollRef} className="max-h-[560px] min-h-[320px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center pt-2">
                Ask anything, or pick a starter:
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => ask(p)}
                    disabled={loading}
                    className="text-left rounded-xl border border-gray-200 bg-gray-50 hover:bg-saffron-50 hover:border-saffron-400 px-3 py-2.5 text-xs text-gray-700 transition disabled:opacity-50"
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
                      ? "bg-saffron-500 text-ink-950"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.content || (loading ? "Thinking…" : "")}
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="border-t border-gray-200 p-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a clinical or AMC-prep question…"
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-saffron-500 hover:bg-saffron-400 text-ink-950 font-bold text-sm px-5 py-2.5 min-h-[44px] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask →
          </button>
        </form>
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed">
        Ask AI is an exam-prep tool. Always confirm clinical decisions with current guidelines and supervisors.
      </p>
    </div>
  );
}
