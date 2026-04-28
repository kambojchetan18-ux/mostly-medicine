import FunLoading from "@/components/FunLoading";

export default function LeaderboardLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🏆 Counting XP across the realm…",
          "📊 Tallying weekly champions…",
          "🥇 Sorting the leaderboard…",
          "🔥 Checking who's on a hot streak…",
        ]}
      />
    </div>
  );
}
