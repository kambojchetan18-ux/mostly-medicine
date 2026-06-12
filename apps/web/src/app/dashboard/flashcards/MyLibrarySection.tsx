"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DeckSummary {
  deckName: string;
  source: string;
  count: number;
  lastAdded: string;
  slug: string;
}

const SOURCE_LABEL: Record<string, { label: string; chip: string }> = {
  ai_notes: { label: "AI · notes", chip: "bg-emerald-100 text-emerald-700" },
  ai_mcq: { label: "AI · MCQ", chip: "bg-violet-100 text-violet-700" },
  anki_apkg: { label: "Anki import", chip: "bg-sky-100 text-sky-700" },
  manual: { label: "Manual", chip: "bg-gray-100 text-gray-700" },
};

export default function MyLibrarySection() {
  const [decks, setDecks] = useState<DeckSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/flashcards/my-library")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) {
          setDecks([]);
        } else {
          setDecks(d.decks ?? []);
        }
      })
      .catch(() => !cancelled && setDecks([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (decks === null || decks.length === 0) return null; // hide until populated

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Your library
        </h2>
        <span className="text-xs text-gray-400">{decks.length} deck{decks.length === 1 ? "" : "s"}</span>
      </div>
      <div className="space-y-3">
        {decks.map((d) => {
          const meta = SOURCE_LABEL[d.source] ?? SOURCE_LABEL.manual;
          const lastAdded = new Date(d.lastAdded).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          return (
            <Link
              key={d.slug}
              href={`/dashboard/flashcards/library/${d.slug}`}
              className="block rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-saffron-400 hover:shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="truncate text-base font-bold text-gray-900">{d.deckName}</h3>
                <span className="shrink-0 text-xs uppercase tracking-wider text-gray-500">
                  {d.count} card{d.count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-medium ${meta.chip}`}>
                  {meta.label}
                </span>
                <span className="text-gray-500">Last added · {lastAdded}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
