import { Sparkles, BookOpen, type LucideIcon } from "lucide-react";

/**
 * TrustBadges — twin pill badges shown in the homepage hero to reinforce
 * brand authority on first paint. "Powered by Claude AI" anchors the AI
 * credibility; "Aligned with AMC Handbook 2026" anchors the exam credibility.
 *
 * Stacks (wraps) on mobile, sits inline on md+. Uses the same dark-glass
 * brand vocabulary as the existing hero status pill (brand-900/30 surface,
 * brand-700/40 ring, brand-300 text) so it slots in without introducing
 * any new colour tokens.
 */
type BadgeProps = {
  icon: LucideIcon;
  label: string;
};

function Badge({ icon: Icon, label }: BadgeProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900/30 ring-1 ring-brand-700/40 text-brand-300 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  );
}

export default function TrustBadges(): JSX.Element {
  return (
    <div
      className="flex flex-wrap gap-2 justify-center md:justify-start mt-6"
      aria-label="Trust badges"
    >
      <Badge icon={Sparkles} label="Powered by Claude AI" />
      <Badge icon={BookOpen} label="Aligned with AMC Handbook 2026" />
    </div>
  );
}
