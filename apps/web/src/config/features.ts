// Single source of truth for runtime feature flags. Read from env so flipping
// modes is a Vercel env-var change + redeploy — no code edits required.
//
// Flip both to re-enable paid tiers:
//   NEXT_PUBLIC_PAID_TIERS_ENABLED=true
//   NEXT_PUBLIC_BETA_MODE=false
//
// Default when env vars are missing: beta mode ON, paid tiers OFF. That way a
// fresh local checkout or a Preview deploy without env vars still renders the
// public site without showing any prices or live checkout buttons.

const truthy = (v: string | undefined, fallback: boolean): boolean => {
  if (v == null) return fallback;
  return v.toLowerCase() === "true";
};

export const features = {
  paidTiersEnabled: truthy(process.env.NEXT_PUBLIC_PAID_TIERS_ENABLED, false),
  betaMode: truthy(process.env.NEXT_PUBLIC_BETA_MODE, true),
} as const;
