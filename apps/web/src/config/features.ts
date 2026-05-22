// Single source of truth for runtime feature flags. Read from env so flipping
// modes is a Vercel env-var change + redeploy — no code edits required.
//
// Flip both to re-enable paid tiers:
//   NEXT_PUBLIC_PAID_TIERS_ENABLED=true
//   NEXT_PUBLIC_BETA_MODE=false
//
// Default when env vars are missing: beta mode ON, paid tiers OFF, Peer
// RolePlay OFF in beta. That way a fresh local checkout or a Preview deploy
// without env vars still renders the public site without showing any prices
// or live checkout buttons, and the most expensive per-session feature stays
// off until we explicitly opt in.

const truthy = (v: string | undefined, fallback: boolean): boolean => {
  if (v == null) return fallback;
  return v.toLowerCase() === "true";
};

export const features = {
  paidTiersEnabled: truthy(process.env.NEXT_PUBLIC_PAID_TIERS_ENABLED, false),
  betaMode: truthy(process.env.NEXT_PUBLIC_BETA_MODE, true),
  // Peer RolePlay (live 2-player video) burns Cloudflare TURN bandwidth +
  // Groq Whisper STT minutes + Anthropic examiner tokens per session. While
  // the platform is free, leave it off and route users to Solo RolePlay.
  // Flip NEXT_PUBLIC_PEER_ROLEPLAY_IN_BETA=true to re-enable.
  peerRolePlayInBeta: truthy(process.env.NEXT_PUBLIC_PEER_ROLEPLAY_IN_BETA, false),
} as const;

// Per-module daily caps applied to non-admin users while betaMode is on.
// `null` means unlimited within beta. Tuned to allow a realistic study day
// (5 handbook + 3 solo + 200 MCQs) while preventing one user — or a bot —
// from burning the Anthropic / Whisper budget. Admins bypass entirely.
//
// acrp_live's cap is irrelevant when peerRolePlayInBeta is false (the
// permission helper short-circuits with allowed:false earlier). It exists
// here as a backstop in case the flag is flipped on without other tuning.
export const BETA_DAILY_LIMITS: Record<
  "mcq" | "mock_exam" | "roleplay" | "acrp_solo" | "acrp_live",
  number | null
> = {
  mcq: 200,
  mock_exam: null,
  roleplay: 5,
  acrp_solo: 3,
  acrp_live: 1,
};
