"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DraftCard {
  tempId: string;
  subtopic: string;
  front_md: string;
  back_md: string;
  citation: string;
  mark_sheet_domain: string;
  amc_part: string;
}

interface GenerateResponse {
  deckName: string;
  cards: DraftCard[];
}

const RENDER_CLOZE = (text: string) => {
  // Render cloze placeholders as inline hatched boxes so the user can see
  // the masked answer at a glance in the preview.
  return text.split(/(\{\{c\d+::[^}]+\}\})/g).map((part, i) => {
    const m = part.match(/\{\{c\d+::([^}]+)\}\}/);
    if (!m) return <span key={i}>{part}</span>;
    return (
      <span
        key={i}
        className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-semibold text-emerald-200"
      >
        {m[1]}
      </span>
    );
  });
};

export default function GenerateClient() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [deckName, setDeckName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftCard[]>([]);
  const [resolvedDeckName, setResolvedDeckName] = useState<string>("");
  // tempId → keep/drop. Default keep (true).
  const [keep, setKeep] = useState<Record<string, boolean>>({});

  const keptCount = drafts.filter((c) => keep[c.tempId] !== false).length;
  const charCount = notes.length;
  const tooShort = charCount > 0 && charCount < 40;

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    setDrafts([]);
    try {
      const res = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, deckName: deckName || undefined }),
      });
      const data = (await res.json()) as Partial<GenerateResponse> & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Generation failed (${res.status})`);
        return;
      }
      const cards = data.cards ?? [];
      setDrafts(cards);
      setResolvedDeckName(data.deckName ?? deckName ?? "Generated deck");
      const init: Record<string, boolean> = {};
      for (const c of cards) init[c.tempId] = true;
      setKeep(init);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (keptCount === 0) return;
    setError(null);
    setSaving(true);
    try {
      const cards = drafts.filter((c) => keep[c.tempId] !== false);
      const res = await fetch("/api/flashcards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards,
          deckName: resolvedDeckName,
          source: "ai_notes",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Save failed (${res.status})`);
        return;
      }
      router.push("/dashboard/flashcards?saved=" + (data.saved ?? cards.length));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between text-sm">
        <Link href="/dashboard/flashcards" className="text-white/60 hover:text-white">
          ← All decks
        </Link>
        <span className="text-white/40">AI generation · Sonnet 4.6</span>
      </header>

      <h1 className="text-3xl font-extrabold tracking-tight text-white">Generate flashcards from notes</h1>
      <p className="mt-2 text-sm text-white/70">
        Paste a lecture summary, an AMC Handbook chapter, an RACGP guideline excerpt, or your own
        revision notes. Claude turns it into AU-cited cloze flashcards aligned with the AMC
        mark-sheet. You decide which ones to keep before they land in your library.
      </p>

      <section className="mt-7 space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
            Deck name (optional)
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. Acute heart failure"
            maxLength={120}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
            Your notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={"Paste anything: a lecture transcript, RACGP guideline section, AMC handbook condition, hand-written revision notes…\n\nLonger and more structured = better cards. Aim for ≥ 200 chars."}
            rows={14}
            maxLength={12_000}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-white placeholder-white/30 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={tooShort ? "text-amber-300" : "text-white/40"}>
              {charCount}/12,000 characters{tooShort ? " — need at least 40 to generate" : ""}
            </span>
            <span className="text-white/30">No medical advice · AU-cited only</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || charCount < 40}
          className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-base font-bold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
        >
          {generating ? "Generating cards…" : "Generate flashcards"}
        </button>
      </section>

      {error && (
        <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {drafts.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-white">
              {resolvedDeckName}{" "}
              <span className="text-sm font-normal text-white/50">
                · {keptCount} of {drafts.length} kept
              </span>
            </h2>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || keptCount === 0}
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
            >
              {saving ? "Saving…" : `Save ${keptCount} to library`}
            </button>
          </div>

          <div className="space-y-3">
            {drafts.map((c) => {
              const isKept = keep[c.tempId] !== false;
              return (
                <article
                  key={c.tempId}
                  className={`rounded-2xl border p-5 transition ${
                    isKept
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-white/5 bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                    {c.subtopic && <span>{c.subtopic}</span>}
                    {c.mark_sheet_domain && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
                        {c.mark_sheet_domain}
                      </span>
                    )}
                    {c.amc_part && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
                        {c.amc_part === "part_2_clinical"
                          ? "AMC Part 2"
                          : c.amc_part === "part_1"
                            ? "AMC Part 1"
                            : "AMC Part 1 + 2"}
                      </span>
                    )}
                  </div>
                  <p className="text-base leading-relaxed text-white">{RENDER_CLOZE(c.front_md)}</p>
                  {c.back_md && (
                    <>
                      <hr className="my-3 border-white/10" />
                      <p className="text-sm leading-relaxed text-white/70">{c.back_md}</p>
                      {c.citation && (
                        <p className="mt-2 text-xs text-white/40">📖 {c.citation}</p>
                      )}
                    </>
                  )}
                  <div className="mt-4 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setKeep((p) => ({ ...p, [c.tempId]: !isKept }))}
                      className={`rounded-lg border px-3 py-1.5 font-semibold transition ${
                        isKept
                          ? "border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                      }`}
                    >
                      {isKept ? "Drop" : "Keep"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-xs text-white/30">
        AI cards are drafts. Always check against the original source — Mostly Medicine is a
        study tool, not a clinical reference.
      </p>
    </div>
  );
}
