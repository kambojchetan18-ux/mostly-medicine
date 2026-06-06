import Link from "next/link";
import {
  cardiologyFlashcards,
  respiratoryFlashcards,
  gastroFlashcards,
} from "@mostly-medicine/content";

const decks = [
  {
    slug: "cardiology",
    name: "Cardiology",
    description: "AF · HF · ACS · HTN · valvular · AMC mark-sheet aligned",
    count: cardiologyFlashcards.length,
    citation: "Murtagh · NHFA · RACGP · AMC handbook",
  },
  {
    slug: "respiratory",
    name: "Respiratory",
    description: "Asthma · COPD · CAP · PE · pneumothorax · TB screening for IMGs",
    count: respiratoryFlashcards.length,
    citation: "Murtagh · NACA · eTG · COPD-X · Lung Foundation AU",
  },
  {
    slug: "gastroenterology",
    name: "Gastroenterology",
    description: "GORD · H. pylori · IBD · coeliac · HBV/HCV · GI bleed · NBCSP",
    count: gastroFlashcards.length,
    citation: "Murtagh · eTG · GESA · ASHM · NHMRC · AMC handbook",
  },
];

export default function FlashcardsHubPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Flashcards</h1>
        <p className="mt-2 text-sm text-gray-600">
          AMC-blueprint cloze cards. AU-guideline cited. Reviewing packaged decks is free for
          everyone; AI generation and Anki import have daily caps on Free —{" "}
          <Link href="/dashboard/billing" className="font-semibold text-emerald-700 hover:underline">
            Pro is unlimited
          </Link>
          .
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
            ✨ Generate: 3 / day Free · ∞ Pro
          </span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-200">
            📦 Anki import: 1 / day Free · ∞ Pro
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 ring-1 ring-gray-200">
            🃏 Review: unlimited everyone
          </span>
        </div>
      </header>

      {/* AI generation + Anki import — surfaced first so users see the
          "make your own" path before scrolling to packaged decks. */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/flashcards/generate"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-base font-bold text-gray-900">Generate from notes</h3>
          </div>
          <p className="mt-1.5 text-xs text-gray-600">
            Paste a lecture, RACGP guideline, or your revision notes → AU-cited cloze cards in
            seconds. Powered by Claude Sonnet 4.6.
          </p>
        </Link>
        <Link
          href="/dashboard/flashcards/import"
          className="rounded-2xl border border-sky-200 bg-sky-50 p-4 transition hover:border-sky-400 hover:bg-sky-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h3 className="text-base font-bold text-gray-900">Import existing deck (.apkg)</h3>
          </div>
          <p className="mt-1.5 text-xs text-gray-600">
            Drag-drop your existing AnKing / Lyonsy / personal Anki deck. Notes + media land in
            your library with FSRS-5 scheduling.
          </p>
        </Link>
      </section>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Packaged decks
      </h2>
      <section className="space-y-4">
        {decks.map((d) => (
          <Link
            key={d.slug}
            href={`/dashboard/flashcards/${d.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-500/40 hover:bg-gray-50"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-gray-900">{d.name}</h2>
              <span className="text-xs uppercase tracking-wider text-gray-500">
                {d.count} cards
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{d.description}</p>
            <p className="mt-3 text-xs text-gray-500">Sourced: {d.citation}</p>
          </Link>
        ))}
      </section>

      <p className="mt-10 text-xs text-gray-500">
        More decks (respiratory, GI, neuro, endo, OBGYN, paeds, pharm, ethics) coming as we
        validate the format with you. Comment on the launch reel if you want a specialty
        bumped up.
      </p>
    </div>
  );
}
