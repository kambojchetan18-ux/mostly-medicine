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
};

export default nextConfig;
