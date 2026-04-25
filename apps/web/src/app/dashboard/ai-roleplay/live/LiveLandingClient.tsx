"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface BlueprintRow {
  id: string;
  slug: string;
  family_name: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export default function LiveLandingClient({ blueprints }: { blueprints: BlueprintRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [hostRole, setHostRole] = useState<"doctor" | "patient">("doctor");
  const [blueprintId, setBlueprintId] = useState<string>("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function host(useRandom: boolean) {
    setError(null);
    try {
      const res = await fetch("/api/ai-roleplay/live/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          useRandom ? { random: true, hostRole } : { blueprintId, hostRole }
        ),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "upgrade_required") {
          setError("This is an Enterprise feature. Please upgrade your plan.");
          return;
        }
        throw new Error(json.error ?? "Could not create session");
      }
      startTransition(() => router.push(`/dashboard/ai-roleplay/live/${json.inviteCode}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create session");
    }
  }

  async function join() {
    setError(null);
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch("/api/ai-roleplay/live/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not join");
      startTransition(() => router.push(`/dashboard/ai-roleplay/live/${code}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="rounded-2xl bg-gradient-to-br from-fuchsia-600 to-violet-700 p-8 text-white shadow-lg">
        <Link href="/dashboard/ai-roleplay" className="text-xs text-white/70 hover:text-white">
          ← Solo mode
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Live RolePlay (2-player)</h1>
        <p className="mt-1 text-sm text-white/80">
          Practice with a partner over video. One plays the doctor, one plays the patient. AI gives feedback after.
        </p>
      </header>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">⚠️ {error}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Host */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">🎬 Start a session</h2>
          <p className="mt-1 text-xs text-gray-500">Generate a fresh case and invite a partner.</p>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">I want to play</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["doctor", "patient"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setHostRole(r)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
                    hostRole === r
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {r === "doctor" ? "🩺 Doctor" : "🎭 Patient"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pick a blueprint (optional)</label>
            <select
              value={blueprintId}
              onChange={(e) => setBlueprintId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">— Random —</option>
              {blueprints.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.difficulty}] {b.category} · {b.family_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => host(!blueprintId)}
              className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create session"}
            </button>
          </div>
        </section>

        {/* Join */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">🤝 Join a session</h2>
          <p className="mt-1 text-xs text-gray-500">Enter the invite code your partner shared.</p>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="e.g. K3M9PQ"
            maxLength={8}
            className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-center text-lg font-mono font-semibold tracking-widest uppercase"
          />
          <button
            type="button"
            disabled={pending || !joinCode.trim()}
            onClick={join}
            className="mt-3 w-full rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-fuchsia-700 disabled:opacity-60"
          >
            {pending ? "Joining…" : "Join session"}
          </button>
        </section>
      </div>

      <p className="text-center text-xs text-gray-500">
        Browser must support WebRTC, microphone, and camera. Chrome / Edge / Safari recommended.
      </p>
    </div>
  );
}
