import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://api.stripe.com",
              "frame-src 'self' https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
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
};

export default nextConfig;
