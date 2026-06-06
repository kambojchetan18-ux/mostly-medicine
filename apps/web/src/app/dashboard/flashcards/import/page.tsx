import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ImportClient } from "./ImportClient";

export const metadata = {
  title: "Import Anki Deck · Mostly Medicine",
  description: "Drag and drop your .apkg to bring an existing Anki deck into Mostly Medicine.",
};

type DeckSummary = { name: string; count: number; imported_at: string };

export default async function FlashcardsImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let decks: DeckSummary[] = [];
  if (user) {
    // Group by deck name on the server so we don't ship every row to the client.
    // Postgres-side grouping via a tiny RPC isn't worth it for the first
    // release — we just paginate the most recent 5000 rows and bucket here.
    const { data: rows } = await supabase
      .from("user_flashcards")
      .select("source_deck_name, imported_at")
      .eq("user_id", user.id)
      .order("imported_at", { ascending: false })
      .limit(5000);
    const bucket = new Map<string, { count: number; latest: string }>();
    for (const r of rows ?? []) {
      const name = (r as { source_deck_name: string | null }).source_deck_name ?? "(unnamed deck)";
      const at = (r as { imported_at: string }).imported_at;
      const e = bucket.get(name);
      if (e) {
        e.count += 1;
        if (at > e.latest) e.latest = at;
      } else {
        bucket.set(name, { count: 1, latest: at });
      }
    }
    decks = [...bucket.entries()]
      .map(([name, v]) => ({ name, count: v.count, imported_at: v.latest }))
      .sort((a, b) => (a.imported_at < b.imported_at ? 1 : -1))
      .slice(0, 20);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <Link
          href="/dashboard/flashcards"
          className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900"
        >
          &larr; Flashcards
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
          Import existing deck
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop a .apkg file. We&rsquo;ll bring across your front, back, cloze,
          tags and any embedded media. Max 50 MB / 10,000 notes per file.
        </p>
      </header>

      <ImportClient />

      {decks.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600">
            Recently imported
          </h2>
          <ul className="space-y-2">
            {decks.map((d) => (
              <li
                key={d.name + d.imported_at}
                className="flex items-baseline justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <span className="text-sm text-gray-900">{d.name}</span>
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  {d.count} {d.count === 1 ? "card" : "cards"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
