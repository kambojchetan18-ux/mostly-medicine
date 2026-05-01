"use client";

import { useState } from "react";

export interface HelpTicket {
  id: string;
  subject: string;
  body: string;
  category: string | null;
  status: string;
  ai_response: string | null;
  ai_confidence: string | null;
  created_at: string;
}

const FAQS = [
  {
    q: "How do I cancel my Pro subscription?",
    a: "Go to /dashboard/billing → Open Billing Portal → Cancel plan. You keep Pro access until the end of the current billing period.",
  },
  {
    q: "I'm a Founder — what does that give me?",
    a: "First 100 signups got Founder access — full Pro features free for 30 days. Once that period ends you'll drop to Free unless you subscribe to Pro.",
  },
  {
    q: "What's the difference between Pro (A$19/mo) and Enterprise (A$49/mo)?",
    a: "Pro unlocks AMC Handbook AI RolePlay + AMC Clinical AI RolePlay (solo voice) + examiner-style feedback. Enterprise adds AMC Peer RolePlay (live video roleplay with another candidate) and higher daily limits.",
  },
  {
    q: "My microphone isn't working in roleplay sessions.",
    a: "Check that the green 🎤 chip is showing in the session UI. On iPhone, ensure Safari has microphone permission (Settings → Safari → Microphone). On Android Chrome, tap the lock icon in the URL bar → Permissions → Microphone → Allow.",
  },
  {
    q: "Is the content aligned to the official AMC handbook?",
    a: "Yes — our AMC Handbook AI RolePlay scenarios are aligned to the official AMC Clinical Examination Handbook. Library content draws from Murtagh, the AMC Red Book, and the AMC Handbook.",
  },
  {
    q: "Do you have a mobile app?",
    a: "Android app is built and pending Play Store submission. iOS support coming. The full web app works great on mobile browsers in the meantime.",
  },
];

function StatusPill({ status, confidence }: { status: string; confidence: string | null }) {
  if (status === "ai_answered" && confidence === "high")
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">✓ Answered</span>;
  if (status === "ai_answered")
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">↗ Auto-answered</span>;
  if (status === "escalated")
    return <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">⚠ Escalated to admin</span>;
  if (status === "resolved")
    return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">Resolved</span>;
  return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">⏳ Working on it…</span>;
}

export default function HelpClient({ initialTickets }: { initialTickets: HelpTicket[] }) {
  const [tickets, setTickets] = useState<HelpTicket[]>(initialTickets);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openTicket, setOpenTicket] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (subject.trim().length < 3) return setError("Subject is too short.");
    if (body.trim().length < 5) return setError("Add a bit more detail in the body.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Submission failed");
      const optimistic: HelpTicket = {
        id: json.ticketId,
        subject,
        body,
        category: json.category ?? null,
        status: json.status ?? "open",
        ai_response: json.answer ?? null,
        ai_confidence: json.confidence ?? null,
        created_at: new Date().toISOString(),
      };
      setTickets((prev) => [optimistic, ...prev]);
      setSubject("");
      setBody("");
      setOpenTicket(json.ticketId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">💬 Help &amp; Feedback</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ask anything, report a bug, or suggest a feature. Most questions get an instant AI answer; anything that needs a human is escalated automatically.
        </p>
      </header>

      {/* ── Submit form ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-gray-900">Send us a message</h2>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (e.g. ‘Mic not working on Android’)"
          maxLength={200}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's going on? Steps to reproduce, expected behaviour, screenshots welcome."
          rows={5}
          maxLength={4000}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {error && <p className="text-xs text-rose-600">⚠️ {error}</p>}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400">{body.length}/4000 chars · AI will reply within seconds.</p>
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send"}
          </button>
        </div>
      </section>

      {/* ── Your tickets ── */}
      {tickets.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Your tickets ({tickets.length})</h2>
          <ul className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <li key={t.id} className="py-3">
                <button
                  onClick={() => setOpenTicket(openTicket === t.id ? null : t.id)}
                  className="w-full text-left flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.subject}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {new Date(t.created_at).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {t.category && <span className="ml-2 capitalize">· {t.category}</span>}
                    </p>
                  </div>
                  <StatusPill status={t.status} confidence={t.ai_confidence} />
                </button>
                {openTicket === t.id && (
                  <div className="mt-3 space-y-3">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">You said</p>
                      <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{t.body}</p>
                    </div>
                    {t.ai_response ? (
                      <div className="rounded-xl border border-brand-200 bg-brand-50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">AI assistant replied</p>
                        <p className="mt-1 text-sm text-brand-900 whitespace-pre-wrap">{t.ai_response}</p>
                        {t.status === "escalated" && (
                          <p className="mt-2 text-[11px] italic text-rose-700">A human admin has also been notified — expect a follow-up within 24 hours.</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">Working on a response…</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Frequently asked</h2>
        <ul className="divide-y divide-gray-100">
          {FAQS.map((f, i) => (
            <li key={i} className="py-2.5">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex items-center justify-between gap-3"
              >
                <span className="text-sm font-medium text-gray-800">{f.q}</span>
                <span className="text-gray-400 text-xs shrink-0">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p className="mt-2 text-sm text-gray-600">{f.a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
