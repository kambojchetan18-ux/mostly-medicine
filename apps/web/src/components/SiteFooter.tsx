import Link from "next/link";

/**
 * SiteFooter — global brand footer rendered on the homepage and every public
 * pillar / marketing page. Intentionally NOT used inside /dashboard/* (the
 * dashboard already has a sidebar layout that supplies its own chrome).
 *
 * Three columns on md+, stacked on mobile:
 *   1. Brand block — wordmark, tagline
 *   2. Quick links — top public routes (incl. Privacy and Contact Us)
 *   3. Contact — email, website, location
 *
 * Pure server component. No auth, no DB, no client JS.
 *
 * Palette: matches the v3 homepage (ink-950 base + cream-50 text + saffron
 * accents). Other public pillar pages still use this footer; their dark
 * footer continues to feel cohesive even if their hero is light.
 */
type QuickLink = {
  href: string;
  label: string;
};

const quickLinks: QuickLink[] = [
  { href: "/amc-cat2",                  label: "AMC Clinical · AI RolePlay" },
  { href: "/amc-mcq",                   label: "AMC MCQ"                 },
  { href: "/ask-ai",                    label: "Ask AI (Free)"           },
  { href: "/dashboard/flashcards",      label: "Flashcards"              },
  { href: "/amc",                       label: "AMC Exam Guide"          },
  { href: "/amc-fee-calculator",        label: "AMC Fee Calculator"      },
  { href: "/amc-eligibility-checker",   label: "AMC Eligibility Checker" },
  { href: "/osce-guide",                label: "OSCE Prep Guide"         },
  { href: "/blog",                      label: "Blog"                    },
  // Public pricing page — always linked (no auth, no flag gate). Checkout
  // itself stays on /dashboard/billing, which keeps its own beta gating.
  { href: "/pricing",                   label: "Pricing & Plans"         },
  { href: "/contact",                   label: "Contact Us"              },
  { href: "/privacy",                   label: "Privacy Policy"          },
  { href: "/terms",                     label: "Terms & Conditions"      },
  { href: "/auth/login",                label: "Sign in"                 },
  { href: "/auth/signup",               label: "Sign up free"            },
];

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="relative z-10 bg-ink-950 text-cream-50/80">
      {/* Top hairline — saffron gradient, matches v3 brand palette */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-6 py-10 sm:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* Column 1 — Brand block */}
          <div>
            <Link
              href="/"
              className="font-display inline-block text-[1.25rem] font-bold tracking-tight"
            >
              <span className="text-saffron-400">Mostly</span>
              <span className="text-cream-50"> Medicine</span>
            </Link>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              AMC Prep Platform
            </p>
            <p className="mt-5 text-sm leading-relaxed text-cream-50/65">
              AMC exam preparation built for International Medical Graduates
              pursuing Australian medical registration. Free to start,
              AI-powered, handbook-aligned.
            </p>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-50/65 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-cream-50/65">
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Email
                </span>
                <a
                  href="mailto:info@mostlymedicine.com"
                  className="mt-1 inline-block transition-colors hover:text-cream-50"
                >
                  info@mostlymedicine.com
                </a>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Website
                </span>
                <span className="mt-1 inline-block text-cream-50/80">
                  mostlymedicine.com
                </span>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Location
                </span>
                <span className="mt-1 inline-block text-cream-50/80">
                  Sydney, Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 border-t border-cream-50/10 pt-6">
          <p className="text-xs text-cream-50/40">
            &copy; 2026 Mostly Medicine. Built for IMGs. Powered by Claude AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
