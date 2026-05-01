"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  plan: string;
  role: string;
  created_at: string;
}

interface ModulePermission {
  id: string;
  plan: string;
  module: string;
  enabled: boolean;
  daily_limit: number | null;
}

const MODULES = ["cat1", "cat2", "library", "jobs", "reference", "progress"];
const PLANS   = ["free", "pro"];

const MODULE_LABELS: Record<string, string> = {
  cat1: "AMC MCQ", cat2: "AMC Handbook AI RolePlay", library: "Library",
  jobs: "Jobs", reference: "Reference", progress: "Progress",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "permissions">("users");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, permRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/module-permissions"),
      ]);
      if (usersRes.status === 403) { setError("Access denied — admin only."); setLoading(false); return; }
      const ud = await usersRes.json();
      const pd = await permRes.json();
      if (ud.error) throw new Error(ud.error);
      if (pd.error) throw new Error(pd.error);
      setUsers(ud.users ?? []);
      setPermissions(pd.permissions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function updateUser(userId: string, field: "plan" | "role", value: string) {
    setSaving(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
    }
    setSaving(null);
  }

  async function togglePermission(plan: string, module: string, enabled: boolean) {
    const key = `${plan}-${module}`;
    setSaving(key);
    const existing = permissions.find(p => p.plan === plan && p.module === module);
    const res = await fetch("/api/admin/module-permissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, module, enabled, daily_limit: existing?.daily_limit ?? null }),
    });
    if (res.ok) {
      setPermissions(prev => prev.map(p =>
        p.plan === plan && p.module === module ? { ...p, enabled } : p
      ));
    }
    setSaving(null);
  }

  async function updateLimit(plan: string, module: string, daily_limit: number | null) {
    const key = `${plan}-${module}-limit`;
    setSaving(key);
    const existing = permissions.find(p => p.plan === plan && p.module === module);
    await fetch("/api/admin/module-permissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, module, enabled: existing?.enabled ?? true, daily_limit }),
    });
    setPermissions(prev => prev.map(p =>
      p.plan === plan && p.module === module ? { ...p, daily_limit } : p
    ));
    setSaving(null);
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <div className="text-4xl mb-3">🔒</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">⚙️ Admin Panel</h1>
          <p className="text-sm text-gray-500">{users.length} users · Manage access and freemium limits</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/analytics"
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
          >
            📊 Analytics
          </Link>
          <Link
            href="/dashboard/admin/tickets"
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
          >
            💬 Tickets
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Manage Users →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(["users", "permissions"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "users" ? `👥 Users (${users.length})` : "🔑 Module Permissions"}
          </button>
        ))}
      </div>

      {/* ── USERS tab ── */}
      {tab === "users" && (
        <div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.avatar_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                            : (u.full_name ?? u.email ?? "?").charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.full_name ?? "—"}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.plan}
                        disabled={saving === u.id}
                        onChange={e => updateUser(u.id, "plan", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={saving === u.id}
                        onChange={e => updateUser(u.id, "role", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
            )}
          </div>
        </div>
      )}

      {/* ── PERMISSIONS tab ── */}
      {tab === "permissions" && (
        <div className="space-y-6">
          {PLANS.map(plan => (
            <div key={plan} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan === "pro" ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"}`}>
                  {plan === "pro" ? "⭐ Pro" : "Free"} Plan
                </span>
                <span className="text-xs text-gray-400">Configure what this plan can access</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enabled</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MODULES.map(mod => {
                    const perm = permissions.find(p => p.plan === plan && p.module === mod);
                    const enabled = perm?.enabled ?? true;
                    const limit = perm?.daily_limit ?? null;
                    const toggleKey = `${plan}-${mod}`;
                    const limitKey = `${plan}-${mod}-limit`;
                    return (
                      <tr key={mod} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-3 font-medium text-gray-700">{MODULE_LABELS[mod]}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => togglePermission(plan, mod, !enabled)}
                            disabled={saving === toggleKey}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${enabled ? "bg-brand-600" : "bg-gray-300"}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              placeholder="∞"
                              defaultValue={limit ?? ""}
                              onBlur={e => {
                                const v = e.target.value ? parseInt(e.target.value) : null;
                                if (v !== limit) updateLimit(plan, mod, v);
                              }}
                              disabled={!enabled || saving === limitKey}
                              className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40 disabled:bg-gray-50"
                            />
                            <span className="text-xs text-gray-400">per day</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold mb-1">💡 Freemium model ready</p>
            <p>Changes here apply to all users on that plan automatically. Use the Users tab to upgrade/downgrade individual users or grant admin access.</p>
          </div>
        </div>
      )}
    </div>
  );
}
