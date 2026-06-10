"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Sticky top nav for the v3 homepage. Transparent over the hero (ink text
// reads on the cream page), turns into a solid cream pill once the user
// scrolls past ~80px so it stays readable over white sections. Mobile
// collapses to a hamburger drawer.

const LINKS = [
  { href: "/amc-cat2", label: "AMC Clinical" },
  { href: "/amc-mcq", label: "AMC MCQ" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-cream-200/80 bg-cream-50/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[68px] sm:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-cream-50 transition-transform group-hover:rotate-3">
            <span className="font-display text-sm font-bold">M</span>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-950">
            Mostly Medicine
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-800/80 transition-colors hover:text-ink-950"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-ink-800/80 transition-colors hover:text-ink-950"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-cream-50 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-ink-900"
          >
            Start free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950/5 text-ink-950 md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-4 bg-ink-950 transition-transform ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 h-0.5 w-4 bg-ink-950 transition-transform ${
                open ? "-translate-y-1 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-cream-200/80 bg-cream-50 px-5 pb-6 pt-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-cream-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-cream-200 pt-4">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-ink-950/15 px-4 py-2.5 text-center text-sm font-semibold text-ink-950"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-ink-950 px-4 py-2.5 text-center text-sm font-semibold text-cream-50"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
