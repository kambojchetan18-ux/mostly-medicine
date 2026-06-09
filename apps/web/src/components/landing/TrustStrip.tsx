// Tight horizontal strip immediately under the hero — single-line
// promise repeated as discrete chips. Same content as the footer
// mantra but rendered statically (no marquee) so the trust signals
// are readable at the first scroll.

const ITEMS = [
  { icon: "🇦🇺", label: "100% AU-cited" },
  { icon: "📖", label: "Murtagh · RACGP · eTG · AMC Handbook 2026" },
  { icon: "🩺", label: "Aboriginal Health, built in" },
  { icon: "🎙️", label: "Voice OSCE 24/7" },
  { icon: "💳", label: "AUD billing · cancel any time" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-5">
      <div className="mx-auto max-w-6xl px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-700 sm:text-sm">
          {ITEMS.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
