"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  role: string;
  created_at: string;
}

interface Props {
  initialUsers: AdminUserRow[];
  currentUserId: string;
}

interface RowStatus {
  kind: "idle" | "pending" | "success" | "error";
  message?: string;
}

const PAGE_SIZE = 25;

export default function UsersAdminClient({ initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState<AdminUserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});
  const [confirmDelete, setConfirmDelete] = useState<AdminUserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tempCred, setTempCred] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function setRowStatus(id: string, s: RowStatus) {
    setStatus((prev) => ({ ...prev, [id]: s }));
  }

  async function handleResetPassword(u: AdminUserRow) {
    setRowStatus(u.id, { kind: "pending" });
    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      setRowStatus(u.id, { kind: "success", message: "Email sent" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      setRowStatus(u.id, { kind: "error", message: `Failed: ${msg}` });
    }
  }

  async function handleSetTempPassword(u: AdminUserRow) {
    if (!confirm(`Generate a new temporary password for ${u.email}?\n\nThis IMMEDIATELY overwrites their current password — only use when the user is locked out and email isn't reaching them.`)) return;
    setRowStatus(u.id, { kind: "pending" });
    try {
      const res = await fetch("/api/admin/users/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      setTempCred({ email: json.email ?? u.email, password: json.password });
      setCopied(false);
      setRowStatus(u.id, { kind: "success", message: "Temp password set" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      setRowStatus(u.id, { kind: "error", message: `Failed: ${msg}` });
    }
  }

  async function handleDeleteConfirmed() {
    if (!confirmDelete) return;
    const u = confirmDelete;
    setDeleting(true);
    setRowStatus(u.id, { kind: "pending" });
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      setRowStatus(u.id, { kind: "success", message: "User deleted" });
      setConfirmDelete(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      setRowStatus(u.id, { kind: "error", message: `Failed: ${msg}` });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href="/dashboard/admin" className="hover:text-gray-700">Admin</Link>
            <span>/</span>
            <span className="text-gray-700">Manage Users</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Users</h1>
          <p className="text-sm text-gray-500">{users.length} total users — reset passwords or remove accounts</p>
        </div>
        <Link
          href="/dashboard/admin"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2"
        >
          Back to Admin
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by email or name..."
          className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <span className="text-xs text-gray-400">{filtered.length} match{filtered.length === 1 ? "" : "es"}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageRows.map((u) => {
              const isAdmin = u.role === "admin";
              const isSelf = u.id === currentUserId;
              const disabled = isAdmin || isSelf;
              const s = status[u.id];
              return (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{u.email}</div>
                    {u.full_name && <div className="text-xs text-gray-400">{u.full_name}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.plan === "pro" ? "bg-amber-100 text-amber-700" : u.plan === "enterprise" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isAdmin ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {s && s.kind !== "idle" && (
                        <span className={`text-xs ${s.kind === "success" ? "text-emerald-600" : s.kind === "error" ? "text-rose-600" : "text-gray-500"}`}>
                          {s.kind === "pending" ? "Working..." : s.message}
                        </span>
                      )}
                      <button
                        onClick={() => handleResetPassword(u)}
                        disabled={disabled || s?.kind === "pending"}
                        title={isSelf ? "Cannot act on yourself" : isAdmin ? "Cannot act on another admin" : "Send password reset email"}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Email reset
                      </button>
                      <button
                        onClick={() => handleSetTempPassword(u)}
                        disabled={disabled || s?.kind === "pending"}
                        title={isSelf ? "Cannot act on yourself" : isAdmin ? "Cannot act on another admin" : "Generate a temp password — overwrites current password immediately"}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Temp password
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        disabled={disabled || s?.kind === "pending"}
                        title={isSelf ? "Cannot delete yourself" : isAdmin ? "Cannot delete another admin" : "Delete this user"}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pageRows.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>Page {safePage + 1} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete user?</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>{confirmDelete.email}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-5">
              This permanently removes the user from auth and cascades to all their data (attempts, profile, spaced-repetition cards, etc.). This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="text-sm font-semibold px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tempCred && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🔐 Temporary password set</h3>
            <p className="text-sm text-gray-600 mb-3">
              Share these credentials with <strong>{tempCred.email}</strong> via WhatsApp/SMS. Ask them to log in and change their password from <span className="font-mono text-xs">/dashboard/profile</span>.
            </p>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Email</p>
              <p className="font-mono text-sm text-amber-900 break-all">{tempCred.email}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Password</p>
              <p className="font-mono text-base font-bold text-amber-900 select-all">{tempCred.password}</p>
            </div>
            <p className="text-[11px] text-rose-600 mb-4">
              ⚠️ This won&apos;t be shown again. Copy now.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={async () => {
                  const text = `Email: ${tempCred.email}\nTemp password: ${tempCred.password}`;
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {copied ? "✓ Copied" : "Copy both"}
              </button>
              <button
                onClick={() => setTempCred(null)}
                className="text-sm font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
