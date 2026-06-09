// US/UK question banks vs Mostly Medicine — the head-to-head that
// crystallises the AU-cited promise. StatDoctor-pattern: bold visual
// contrast, two short columns, no apologies.

export default function ComparisonStrip() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            Why MM, not Anki + AMBOSS
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            US guidelines won&rsquo;t pass the AMC.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            The AMC marks against Australian practice &mdash; not USPSTF, not NICE. Every Mostly
            Medicine answer cites a source you&rsquo;ll actually be expected to know.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Other tools — left, muted */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                Other tools
              </span>
              <span className="text-xs text-slate-500">Anki · AMBOSS · UWorld · Sketchy</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-rose-500">✗</span>
                <span>USMLE-tuned MCQs &mdash; antibiotic doses, PBS rules, Australian guidelines all wrong</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-rose-500">✗</span>
                <span>Zero Aboriginal &amp; Torres Strait Islander Health content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-rose-500">✗</span>
                <span>Text-based OSCE prep &mdash; no voice patient, no AMC-rubric scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-rose-500">✗</span>
                <span>Generic flashcards, no built-in AU citation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-rose-500">✗</span>
                <span>Pricing in USD/EUR &mdash; A$60+ per month after FX</span>
              </li>
            </ul>
          </div>

          {/* MM — right, vibrant */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-md">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                Mostly Medicine
              </span>
              <span className="text-xs font-semibold text-emerald-800">A$29/mo · cancel any time</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                <span>4,400+ MCQs <strong>cited from Murtagh, RACGP and AMC Handbook 2026</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                <span>Dedicated Aboriginal Health, Rural Medicine and Cultural Safety decks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                <span>Voice OSCE with AMC 13-domain mark-sheet feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                <span>21 specialty flashcard decks with FSRS-5 spaced recall</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                <span>AUD pricing, Stripe payout to AU bank, GST-ready invoice</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
