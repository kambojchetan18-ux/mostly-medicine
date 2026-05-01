"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface AdminTicket {
  id: string;
  subject: string;
  body: string;
  category: string | null;
  status: string;
  aiResponse: string | null;
  aiConfidence: string | null;
  createdAt: string;
  userEmail: string;
  userName: string;
}

const FILTERS = ["all", "escalated", "ai_answered", "open", "resolved"] as const;
type Filter = (typeof FILTERS)[number];

function statusColor(s: string) {
  if (s === "escalated") return "bg-rose-100 text-rose-700 border-rose-200";
  if (s === "ai_answered") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s === "resolved") return "bg-gray-100 text-gray-600 border-gray-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

export default function TicketsClient({ initialTickets }: { initialTickets: AdminTicket[] }) {
  const [tickets, setTickets] = useState<AdminTicket[]>(initialTickets);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = tickets;
    if (filter !== "all") rows = rows.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.userEmail.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [tickets, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tickets.length };
    for (const t of tickets) c[t.status] = (c[t.status] ?? 0) + 1;
    return c;
  }, [tickets]);

  async function setStatus(id: string, status: "resolved" | "escalated") {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed");
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💬 Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">User feedback + AI auto-responses. Escalated tickets need your attention.</p>
        </div>
        <Link href="/dashboard/admin" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">← Admin home</Link>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.replace("_", " ")} {counts[f] ? `(${counts[f]})` : ""}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, body, email…"
          className="ml-auto rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
        {filtered.map((t) => (
          <div key={t.id} className="p-4">
            <button onClick={() => setOpen(open === t.id ? null : t.id)} className="w-full text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.subject}</p>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">
                    {t.userEmail} · {new Date(t.createdAt).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    {t.category && <span className="ml-2 capitalize">· {t.category}</span>}
                    {t.aiConfidence && <span className="ml-2 capitalize">· conf: {t.aiConfidence}</span>}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColor(t.status)}`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
            </button>
            {open === t.id && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">User wrote</p>
                  <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{t.body}</p>
                </div>
                {t.aiResponse && (
                  <div className="rounded-xl border border-brand-200 bg-brand-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">AI auto-reply</p>
                    <p className="mt-1 text-sm text-brand-900 whitespace-pre-wrap">{t.aiResponse}</p>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2">
                  {t.status !== "resolved" && (
                    <button
                      onClick={() => setStatus(t.id, "resolved")}
                      disabled={busy === t.id}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Mark resolved
                    </button>
                  )}
                  {t.status === "ai_answered" && (
                    <button
                      onClick={() => setStatus(t.id, "escalated")}
                      disabled={busy === t.id}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                    >
                      Re-escalate
                    </button>
                  )}
                  <a
                    href={`mailto:${t.userEmail}?subject=Re: ${encodeURIComponent(t.subject)}&body=${encodeURIComponent(`Hi,\n\nThanks for reaching out about your ticket. `)}`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Email user
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-12 text-center text-sm text-gray-400">No tickets match this filter.</p>
        )}
      </div>
    </div>
  );
}
