import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mostly-medicine/ui",
    "@mostly-medicine/ai",
    "@mostly-medicine/content",
  ],
};

export default nextConfig;
