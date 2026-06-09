// Single-row trust band. Quiet ink-on-cream chips replace the v2 emoji
// chip row — feels less stamped and reads as "spec sheet" not
// "marketing".

const ITEMS = [
  { figure: "151", label: "AMC Handbook stations" },
  { figure: "13", label: "AMC examiner domains" },
  { figure: "8 min", label: "Voice station length" },
  { figure: "100%", label: "AU clinical aligned" },
];

export default function TrustBand() {
  return (
    <section className="border-y border-ink-950/10 bg-cream-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-ink-950/10 px-6 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 py-5 sm:py-6">
            <p className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
              {item.figure}
            </p>
            <p className="text-center text-[11px] font-medium uppercase tracking-wider text-ink-900/60 sm:text-xs">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
