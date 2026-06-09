import Link from "next/link";

// Single big card at page end. One CTA. No clutter. The whole page has
// been building toward "try a station now"; this is the last push.

export default function FinalCTA() {
  return (
    <section className="bg-cream-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-8 py-14 text-center text-cream-50 sm:px-14 sm:py-20">
          {/* Decorative saffron blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-saffron-500/15 blur-3xl"
          />

          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-400">
            Your first station
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            Stop reading. Start talking.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-cream-50/75 sm:text-lg">
            One AMC Handbook station. 8 minutes. Voice OSCE with an AI patient and a real examiner
            rubric on the other side.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 text-base font-bold text-ink-950 shadow-[0_12px_32px_-12px_rgba(232,146,22,0.6)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400"
            >
              Try a station &mdash; free
              <span aria-hidden>→</span>
            </Link>
            <p className="text-xs text-cream-50/55 sm:ml-2">
              No card. 1 free station / day. Cancel any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
