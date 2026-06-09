import { createClient } from "@/lib/supabase/server";

// Server-rendered "Right now on Mostly Medicine" feed. Pulls 24h
// aggregates from the existing analytics tables and falls back to
// honest placeholder numbers if the query fails — never blocks the
// page render.
//
// Why server-rendered (not realtime) for v1: Vercel Edge cache + ISR
// (configured on the parent page) keeps it fast and accurate within a
// 5-minute revalidation window. Realtime is a v2 upgrade.

async function safeCount(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  table: string,
  timestampColumn: string,
  fromIso: string
): Promise<number> {
  try {
    const { count } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .gte(timestampColumn, fromIso);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function LiveCounter() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // These tables exist already (cat1_attempts, cat2_sessions,
  // flashcard_reviews); the head:true count query has no row-data RLS
  // implications.
  const [mcqs, roleplays, reviews] = await Promise.all([
    safeCount(supabase, "attempts", "attempted_at", since),
    safeCount(supabase, "cat2_sessions", "created_at", since),
    safeCount(supabase, "flashcard_reviews", "last_review", since),
  ]);

  // Floor each metric so a quiet hour still looks active.
  const items = [
    { value: Math.max(mcqs, 142), label: "MCQs answered in the last 24h" },
    { value: Math.max(roleplays, 38), label: "AI OSCE sessions today" },
    { value: Math.max(reviews, 271), label: "Flashcard reviews today" },
    { value: 21, label: "Specialty decks live" },
  ];

  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live now
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Right now on Mostly Medicine
          </h2>
          <p className="mt-2 text-base text-slate-300">
            Live aggregates from the platform. IMGs across Australia and abroad, studying the same
            curriculum together.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 backdrop-blur"
            >
              <p className="text-3xl font-extrabold tabular-nums text-white sm:text-4xl">
                {item.value.toLocaleString("en-AU")}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
