import { features } from "@/config/features";

// Slim site-wide ribbon that announces beta-mode. Pure server component so it
// renders before hydration with no flash. Returns null (renders nothing) when
// features.betaMode is false, so flipping the flag turns the banner off
// without any other code change.
export default function BetaBanner() {
  if (!features.betaMode) return null;
  return (
    <div className="w-full bg-saffron-600 text-white text-center text-xs sm:text-sm font-medium px-4 py-2">
      🚀 Mostly Medicine is in free beta — every feature unlocked. We&rsquo;d love your
      feedback as we iterate.
    </div>
  );
}
