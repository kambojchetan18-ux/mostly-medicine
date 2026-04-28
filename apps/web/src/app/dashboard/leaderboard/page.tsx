import { createClient } from "@/lib/supabase/server";

type LeaderboardRow = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "enterprise" | string;
  weekly_xp: number;
  event_count: number;
};

function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function planBadgeStyle(plan: string): string {
  switch (plan) {
    case "enterprise":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "pro":
      return "bg-violet-100 text-violet-800 border-violet-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function rankBadge(rank: number): string {
  if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-500 text-white";
  if (rank === 2) return "bg-gradient-to-br from-slate-300 to-slate-400 text-white";
  if (rank === 3) return "bg-gradient-to-br from-orange-400 to-amber-600 text-white";
  return "bg-slate-100 text-slate-600";
}

function rankIcon(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

function displayName(row: LeaderboardRow): string {
  // Privacy: free-tier users show as "Anonymous"
  if (row.plan === "free") return "Anonymous";
  return row.full_name?.trim() || "Anonymous";
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows, error } = await supabase
    .from("leaderboard_weekly")
    .select("user_id, full_name, avatar_url, plan, weekly_xp, event_count")
    .order("weekly_xp", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[leaderboard] query failed", error.message);
  }

  const leaderboard = (rows ?? []) as LeaderboardRow[];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>🏆</span> Leaderboard
        </h2>
        <p className="text-gray-500 text-sm">
          Top 50 learners this week · XP from MCQs, roleplays, and feedback
        </p>
      </div>

      <div className="bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 border border-violet-200/60 rounded-2xl p-4 mb-6">
        <p className="text-xs text-violet-700 font-semibold uppercase tracking-widest mb-1">
          How XP works
        </p>
        <div className="text-[13px] text-slate-700 grid grid-cols-2 gap-x-4 gap-y-0.5">
          <span>MCQ correct: +10 XP</span>
          <span>MCQ attempt: +2 XP</span>
          <span>Roleplay completed: +50 XP</span>
          <span>Live roleplay: +100 XP</span>
          <span>Feedback received: +10 XP</span>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">🚀</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No XP yet this week</h3>
          <p className="text-sm text-gray-500">
            Be the first! Practise an MCQ or finish a roleplay to climb the board.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-800 text-sm">This Week</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest">Last 7 days</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {leaderboard.map((row, idx) => {
              const rank = idx + 1;
              const isMe = user && row.user_id === user.id;
              const name = displayName(row);
              return (
                <li
                  key={row.user_id}
                  className={`px-4 sm:px-5 py-3 flex items-center gap-3 transition ${
                    isMe ? "bg-violet-50/70 border-l-4 border-violet-500" : ""
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[13px] font-bold ${rankBadge(rank)}`}
                  >
                    {rank <= 3 ? <span className="text-base">{rankIcon(rank)}</span> : `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="shrink-0">
                    {row.avatar_url && row.plan !== "free" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold">
                        {row.plan === "free" ? "?" : initialsOf(row.full_name)}
                      </div>
                    )}
                  </div>

                  {/* Name + plan */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {name}
                        {isMe && <span className="ml-1.5 text-[10px] text-violet-600 font-bold uppercase tracking-wider">You</span>}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${planBadgeStyle(row.plan)}`}
                      >
                        {row.plan}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {row.event_count} action{row.event_count === 1 ? "" : "s"} this week
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-violet-600 leading-none">
                      {row.weekly_xp.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">XP</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-5">
        Free-tier users appear anonymously. Upgrade to show your name on the leaderboard.
      </p>
    </div>
  );
}
