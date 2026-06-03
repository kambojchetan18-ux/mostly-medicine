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
    // Content Security Policy — restricts which origins can serve scripts,
    // styles, connections, and frames. unsafe-inline + unsafe-eval are
    // required for Next.js runtime and Tailwind; a nonce-based policy can
    // replace them once middleware nonce wiring is set up. Even with those
    // directives, the CSP still blocks scripts/connections from untrusted
    // origins, which defeats most reflected-XSS and data-exfil attacks.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(), payment=(self), usb=(), interest-cohort=()",
          },
          { key: "X-XSS-Protection", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
