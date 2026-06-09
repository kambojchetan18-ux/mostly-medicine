"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// StatDoctor-style hero: full-bleed Sydney location carousel, big white
// headline + subhead + dual CTA over a soft dark overlay, KPI tiles
// pinned below. The carousel auto-rotates every 6s but pauses on hover
// so a curious visitor can read each frame's location label.

const SYDNEY_IMAGES = [
  {
    src: "/marketing/hero/sydney-opera-golden.jpg",
    alt: "Sydney Opera House at golden hour",
    label: "Sydney, NSW · Where over 18,000 IMGs sit the AMC each year",
  },
  {
    src: "/marketing/hero/sydney-harbour.jpg",
    alt: "Sydney Opera House and Harbour Bridge",
    label: "Sydney Harbour · The AU clinical scene you're about to step into",
  },
  {
    src: "/marketing/hero/sydney-bridge.jpg",
    alt: "Sydney Harbour Bridge with CBD",
    label: "Harbour Bridge · 2,300+ IMG roles waiting in NSW alone",
  },
  {
    src: "/marketing/hero/sydney-skyline.jpg",
    alt: "Sydney CBD skyline",
    label: "Sydney CBD · 24/7 AI study, in the time zone you'll work in",
  },
];

const KPIS = [
  { value: "4,400+", label: "AMC-aligned MCQs" },
  { value: "21", label: "Specialty flashcard decks" },
  { value: "150+", label: "AI voice OSCE stations" },
  { value: "100%", label: "AU-cited · zero US guidelines" },
];

export default function HeroV2() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SYDNEY_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carousel background — cross-fade via opacity */}
      <div className="absolute inset-0 -z-10">
        {SYDNEY_IMAGES.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Dark overlay so white text reads on any image. Slight gradient
            so the bottom KPI strip sits on a darker band. */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/65 to-slate-950/85" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-24 sm:pt-32 lg:pt-40">
        {/* Pill above headline — location ticker */}
        <div className="mb-6 flex items-center gap-2 text-xs text-white/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-medium tracking-wide">{SYDNEY_IMAGES[index].label}</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Pass the AMC.
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
            Built by IMGs, for IMGs.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Australia&rsquo;s AI-native AMC prep. Every answer cited from{" "}
          <strong className="text-white">Murtagh</strong>,{" "}
          <strong className="text-white">RACGP</strong> and the{" "}
          <strong className="text-white">AMC Handbook 2026</strong> &mdash; never US guidelines.
          Built by IMGs who walked the same pathway.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            Start free &mdash; no card
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            See Pro &mdash; A$29/mo
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/try-amc-clinical-roleplay"
            className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-white/90 hover:text-white"
          >
            <span aria-hidden>🎙️</span> Hear a sample patient
          </Link>
        </div>

        {/* KPI tiles */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
            >
              <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/75 sm:text-xs">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-10 flex gap-2">
          {SYDNEY_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
