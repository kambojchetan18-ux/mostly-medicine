import { defineConfig } from "vitest/config";

// Unit tests for server-side billing/money-safety logic. Node environment —
// these test pure helpers + Supabase-mocked sync logic, no DOM or network.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
