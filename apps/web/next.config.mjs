import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mostly-medicine/ui",
    "@mostly-medicine/ai",
    "@mostly-medicine/content",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use the SDK-free mobile entry point for browser bundles —
      // the full index.ts pulls in @anthropic-ai/sdk (Node.js only)
      config.resolve.alias["@mostly-medicine/ai"] = path.resolve(
        __dirname,
        "../../packages/ai/src/mobile.ts"
      );
    }
    return config;
  },
  async redirects() {
    // Canonicalise to www subdomain so Supabase auth cookies live on a
    // single origin. Otherwise navigating between www. and the bare domain
    // drops the session and forces re-login.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mostlymedicine.com" }],
        destination: "https://www.mostlymedicine.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Baseline security headers applied to every response. CSP is now in
    // report-only mode — violations are logged to the console but nothing is
    // blocked. Once we confirm no false positives we can promote
    // Content-Security-Policy-Report-Only → Content-Security-Policy and wire
    // up nonces for Tailwind's hashing, Next.js inline runtime, and Stripe
    // Elements. The remaining headers below are zero-risk and still close
    // real attack surface (clickjacking, MIME sniffing, referrer leakage,
    // downgrade, sensitive browser APIs).
    return [
      {
        source: "/:path*",
        headers: [
          // Block iframe embedding from any other origin → defeats
          // clickjacking attacks against /dashboard/billing + /auth/* forms.
          { key: "X-Frame-Options", value: "DENY" },
          // Stop browsers guessing MIME types — old XSS vector.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL (?next=... / ?token=...) to outbound
          // links. Origin-only on cross-origin nav.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for 2 years incl. subdomains. Vercel already
          // 301s→https; HSTS hardens against downgrade attacks.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Lock sensitive browser APIs to same-origin only. Microphone is
          // allowed (Cat2 + ACRP record audio); camera also self-only for
          // Peer Live RolePlay (WebRTC). Disable everything else (FLoC,
          // payment APIs we don't ship yet, USB, etc).
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(), payment=(self), usb=(), interest-cohort=()",
          },
          // Defense-in-depth XSS hint for legacy Safari. Modern browsers
          // ignore it safely; setting "0" disables the buggy auditor.
          { key: "X-XSS-Protection", value: "0" },
          // Report-only CSP — logs violations to the browser console without
          // blocking anything. Covers scripts (Stripe, GA, Vercel Analytics),
          // styles (inline Tailwind), images (Supabase storage, Stripe),
          // connect (Supabase realtime, Stripe API, Groq STT, Cloudflare
          // TURN, Vercel Insights), frames (Stripe Elements), and media
          // (voice recordings). Promote to Content-Security-Policy once
          // there are zero console warnings in production.
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.groq.com https://*.vercel-insights.com https://*.google-analytics.com https://rtc.live.cloudflare.com; frame-src https://js.stripe.com https://hooks.stripe.com; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
