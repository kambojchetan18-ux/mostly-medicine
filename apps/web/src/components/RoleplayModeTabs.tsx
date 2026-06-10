import Link from "next/link";

/**
 * Mode switcher between the two Clinical RolePlay modes:
 * Handbook (/dashboard/cat2) and Beyond Handbook (/dashboard/ai-roleplay).
 * Rendered only on the picker/list views — never inside an active session.
 */
export default function RoleplayModeTabs({ active }: { active: "handbook" | "beyond" }) {
  const activeClass = "rounded-full bg-saffron-500 px-4 py-2 text-sm font-bold text-ink-950";
  const inactiveClass =
    "rounded-full px-4 py-2 text-sm font-semibold text-ink-900/60 hover:text-ink-950 transition-colors";
  return (
    <div
      aria-label="Roleplay mode"
      className="mb-5 inline-flex rounded-full border border-ink-950/10 bg-white p-1 shadow-sm"
    >
      <Link
        href="/dashboard/cat2"
        aria-current={active === "handbook" ? "page" : undefined}
        className={active === "handbook" ? activeClass : inactiveClass}
      >
        Handbook · 151 cases
      </Link>
      <Link
        href="/dashboard/ai-roleplay"
        aria-current={active === "beyond" ? "page" : undefined}
        className={active === "beyond" ? activeClass : inactiveClass}
      >
        Beyond Handbook · unlimited
      </Link>
    </div>
  );
}
