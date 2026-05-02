# Plan — Make the AMC Fee Calculator the Hero Hook

> Status: PROPOSED · awaiting Chetan + Amandeep review

The `/amc-fee-calculator` page already exists (190 lines, fully functional), but right now you can only get to it via the sitemap or a direct link. It is the single most viral, lead-magnet-style asset on the site — costs are the #1 anxiety driver for IMGs — and it's almost invisible.

This plan moves it from "buried tool" to "the visual everyone sees first."

## What the calculator gives the user

- Total AUD/USD/INR cost of the full AMC pathway (CAT 1, CAT 2, EPIC, IELTS/OET, AHPRA)
- Live update as they tick each item
- A shareable result they can WhatsApp to their family

## Where to surface it (ranked by impact)

### 1. Hero section of the homepage — primary placement
The homepage's hero currently has signup CTAs. Replace the secondary CTA block with a **mini, embedded calculator widget** showing 3 inputs (CAT 1, CAT 2, IELTS) and an animated total in big numerals.

Concept:
```
[Hero copy]                              ┌─────────────────────────┐
"Built for IMGs. Honest about           │  AMC PATHWAY · 2026     │
 the AMC pathway."                       │                         │
                                          │  AMC CAT 1     A$2,790  │
[Get started →]                          │  AMC CAT 2     A$3,490  │
                                          │  IELTS         A$  410  │
                                          │  ─────────────────────  │
                                          │  Your total    A$6,690  │
                                          │  [Open full calc →]     │
                                          └─────────────────────────┘
```

- Animated count-up when total updates (uses existing site fonts, tabular-nums)
- Sticky on desktop (right column), inline below hero on mobile
- Tappable inputs trigger jump to `/amc-fee-calculator` for full version
- Effect: every visitor sees a live numeric anchor — "this much, here's what you're really up against"

### 2. Sidebar widget on every pillar article
The new article 4 (and the next 9 in the GEO plan) end with a CTA block. Add a small "Calculate your real cost" card alongside the existing "Try it free" CTA on every pillar page.

```
┌─ Cost calculator (live) ─┐
│  A$ 6,690                │
│  for the full pathway    │
│  [Personalise →]         │
└──────────────────────────┘
```

- Reuses the calculator's data
- Different angle than "sign up" — appeals to undecided readers
- Internal-link juice for /amc-fee-calculator

### 3. A "Cost shock" pop-up on first visit
On pages where intent is high (`/amc`, `/amc-cat1`, `/amc-cat2`, `/img-australia-pathway`), show a one-time interstitial card after 15 seconds:

> *"Most IMGs underestimate the AMC pathway by A$15,000+. Calculate your real number in 30 seconds →"*

- Hard cap: shows once per device (cookie-stored, 30-day expiry)
- Dismissible with one tap
- Tracks click-through rate so we can A/B the copy

### 4. Dashboard module card for logged-in users
Inside `/dashboard`, add a small "Plan your costs" tile alongside MCQ / RolePlay modules. Pre-fills any country data we know about the user from signup.

### 5. Embeddable widget for partner sites
Long-game: package the calculator as a single `<script>` snippet partner medical schools / IMG Facebook groups can drop into their pages. Each embed back-links to mostlymedicine.com — pure off-page SEO + brand awareness.

## Visual / UX direction

- **Font**: tabular-nums for all numbers (no jitter as values change)
- **Color**: brand teal-to-pink gradient on the total
- **Animation**: count-up via simple `requestAnimationFrame` (no chart lib)
- **Mobile**: collapse into a single bordered card with currency toggle pill (AUD / USD / INR)
- **Accessibility**: live region for screen readers when the total updates

## Engineering effort

| Surface | Effort | Risk |
|---|---|---|
| Homepage embedded mini-calc | 3-4 hr | Medium (needs careful mobile handling) |
| Pillar-page sidebar widget | 1-2 hr | Low (additive component) |
| Cost-shock pop-up | 1 hr | Low |
| Dashboard tile | 30 min | Low |
| Embeddable iframe widget | 4-6 hr | Medium (CORS, branding, security) |

## Recommended sequencing

1. **Phase 1 (this week, ~5 hr)**: Pillar sidebar widget + dashboard tile. Pure additive, low risk.
2. **Phase 2 (next week, ~4 hr)**: Homepage hero embedded calculator.
3. **Phase 3 (after first 50 conversions)**: Cost-shock pop-up A/B test.
4. **Phase 4 (later)**: Embeddable widget for partner sites.

## Tracking

Add `data-source` attribute to every calculator entry-point (e.g., `data-source="hero" | "pillar-sidebar" | "popup" | "dashboard"`). Log impressions to a `calculator_events` Supabase table. Compare conversion of source → signup → paid.
