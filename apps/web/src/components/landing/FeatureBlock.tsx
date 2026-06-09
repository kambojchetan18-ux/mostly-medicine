import Link from "next/link";

interface Props {
  tag: string;
  title: string;
  blurb: string;
  bullets: string[];
  cta: { href: string; label: string };
  imageSrc: string;
  imageAlt: string;
  // Default: image-right. Set to true to flip and put image-left, text-right.
  reverse?: boolean;
  accent?: "emerald" | "violet" | "sky" | "rose";
  // "phone" wraps a portrait mobile screenshot in a phone-style rounded
  // frame, max-width constrained so it doesn't dominate the column.
  // "screen" (default) is a landscape product capture in a card frame.
  variant?: "screen" | "phone";
}

const ACCENT: Record<NonNullable<Props["accent"]>, { tag: string; cta: string }> = {
  emerald: {
    tag: "bg-emerald-100 text-emerald-700",
    cta: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  violet: {
    tag: "bg-violet-100 text-violet-700",
    cta: "bg-violet-600 hover:bg-violet-700 text-white",
  },
  sky: {
    tag: "bg-sky-100 text-sky-700",
    cta: "bg-sky-600 hover:bg-sky-700 text-white",
  },
  rose: {
    tag: "bg-rose-100 text-rose-700",
    cta: "bg-rose-600 hover:bg-rose-700 text-white",
  },
};

export default function FeatureBlock({
  tag,
  title,
  blurb,
  bullets,
  cta,
  imageSrc,
  imageAlt,
  reverse = false,
  accent = "emerald",
  variant = "screen",
}: Props) {
  const c = ACCENT[accent];
  const glowColor =
    accent === "emerald"
      ? "bg-emerald-200/40"
      : accent === "violet"
        ? "bg-violet-200/40"
        : accent === "sky"
          ? "bg-sky-200/40"
          : "bg-rose-200/40";

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Text column */}
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${c.tag}`}
            >
              {tag}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{blurb}</p>
            <ul className="mt-5 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className={`mt-6 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition ${c.cta}`}
            >
              {cta.label}
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Image column — two visual treatments */}
          <div className="relative flex items-center justify-center">
            {variant === "phone" ? (
              // Phone-style frame: rounded-[2.5rem] bezel + notch hint,
              // max-width caps the portrait shot so it doesn't dwarf the
              // text column on wide screens.
              <div className="relative w-full max-w-xs">
                <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="block h-auto w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              // Standard landscape product capture in a card frame.
              <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            )}
            {/* Soft accent glow behind the frame for visual interest */}
            <div
              className={`pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] blur-2xl ${glowColor}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
