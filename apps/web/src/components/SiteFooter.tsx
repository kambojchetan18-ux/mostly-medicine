import Link from "next/link";

/**
 * SiteFooter — global brand footer rendered on the homepage and every public
 * pillar / marketing page. Intentionally NOT used inside /dashboard/* (the
 * dashboard already has a sidebar layout that supplies its own chrome).
 *
 * Three columns on md+, stacked on mobile:
 *   1. Brand block — wordmark, tagline, founder credit, GitHub icon
 *   2. Quick links — top public routes
 *   3. Contact — email, website, location
 *
 * Pure server component. No auth, no DB, no client JS.
 */
type QuickLink = {
  href: string;
  label: string;
};

const quickLinks: QuickLink[] = [
  { href: "/amc",                       label: "AMC Exam Guide"        },
  { href: "/amc-fee-calculator",        label: "AMC Fee Calculator"    },
  { href: "/amc-eligibility-checker",   label: "AMC Eligibility Checker" },
  { href: "/osce-guide",                label: "OSCE Prep Guide"       },
  { href: "/ask-ai",                    label: "Ask AI (Free)"         },
  { href: "/dashboard/billing",         label: "Pricing & Plans"       },
  { href: "/auth/login",                label: "Sign in"               },
  { href: "/auth/signup",               label: "Sign up free"          },
];

function GitHubIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 fill-current"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.49.11-3.1 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.61.23 2.8.11 3.1.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.15 0 .31.21.67.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="relative z-10 mt-24 bg-[#070714] text-slate-300">
      {/* Top hairline — emerald gradient, matches brand palette */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-6 py-10 sm:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* Column 1 — Brand block */}
          <div>
            <Link
              href="/"
              className="font-display inline-block text-[1.25rem] font-bold tracking-tight"
            >
              <span className="gradient-text">Mostly</span>
              <span className="text-white"> Medicine</span>
            </Link>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              AMC Prep Platform
            </p>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              AMC exam preparation built for International Medical Graduates
              pursuing Australian medical registration. Free to start,
              AI-powered, handbook-aligned.
            </p>
            <p className="mt-5 text-xs text-slate-500">
              Operated by Chetan Kamboj, Sydney, Australia
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com/kambojchetan18-ux/mostly-medicine"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mostly Medicine on GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-emerald-700/60 hover:text-emerald-300"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Email
                </span>
                <a
                  href="mailto:info@mostlymedicine.com"
                  className="mt-1 inline-block transition-colors hover:text-white"
                >
                  info@mostlymedicine.com
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Website
                </span>
                <span className="mt-1 inline-block text-slate-300">
                  mostlymedicine.com
                </span>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Location
                </span>
                <span className="mt-1 inline-block text-slate-300">
                  Sydney, Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 border-t border-slate-900/80 pt-6">
          <p className="text-xs text-slate-600">
            &copy; 2026 Mostly Medicine. Built for IMGs. Powered by Claude AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
