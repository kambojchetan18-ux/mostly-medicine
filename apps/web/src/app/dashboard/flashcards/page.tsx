import Link from "next/link";
import {cardiologyFlashcards} from "@mostly-medicine/content";

const decks = [
  {
    slug: "cardiology",
    name: "Cardiology",
    description: "AF · HF · ACS · HTN · valvular · AMC mark-sheet aligned",
    count: cardiologyFlashcards.length,
    citation: "Murtagh · NHFA · RACGP · AMC handbook",
  },
];

export default function FlashcardsHubPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Flashcards</h1>
        <p className="mt-2 text-sm text-white/70">
          AMC-blueprint cloze cards. AU-guideline cited. Free.
        </p>
      </header>

      <section className="space-y-4">
        {decks.map((d) => (
          <Link
            key={d.slug}
            href={`/dashboard/flashcards/${d.slug}`}
            className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-500/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-white">{d.name}</h2>
              <span className="text-xs uppercase tracking-wider text-white/50">
                {d.count} cards
              </span>
            </div>
            <p className="mt-1 text-sm text-white/70">{d.description}</p>
            <p className="mt-3 text-xs text-white/40">Sourced: {d.citation}</p>
          </Link>
        ))}
      </section>

      <p className="mt-10 text-xs text-white/40">
        More decks (respiratory, GI, neuro, endo, OBGYN, paeds, pharm, ethics) coming as we
        validate the format with you. Comment on the launch reel if you want a specialty
        bumped up.
      </p>
    </div>
  );
}
