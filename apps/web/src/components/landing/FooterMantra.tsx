// Server component — pure CSS marquee, no JS needed.
//
// StatDoctor's signature pattern is a footer band that repeats the brand
// mantra many times, scrolling horizontally. For MM the mantra is the
// promise that differentiates us from every US/UK competitor.

const MANTRA = [
  "Built by IMGs",
  "100% AU-cited",
  "AMC-aligned",
  "No US guidelines",
  "Aboriginal Health, built in",
  "Murtagh · RACGP · eTG · AMC Handbook 2026",
];

// Duplicate the list so the marquee can loop seamlessly.
const TRACK = [...MANTRA, ...MANTRA, ...MANTRA, ...MANTRA, ...MANTRA];

export default function FooterMantra() {
  return (
    <section
      aria-label="Mostly Medicine brand mantra"
      className="overflow-hidden border-y border-emerald-900/30 bg-emerald-950 py-4"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {TRACK.map((phrase, i) => (
          <div
            key={`${phrase}-${i}`}
            className="flex items-center gap-8 text-sm font-semibold tracking-wide text-emerald-200"
          >
            <span className="text-emerald-300/60">·</span>
            <span>{phrase}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
