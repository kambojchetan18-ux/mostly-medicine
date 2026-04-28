import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import UsersAdminClient, { type AdminUserRow } from "./UsersAdminClient";

export const dynamic = "force-dynamic";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function listAllAuthUsers(svc: ReturnType<typeof service>) {
  const all: { id: string; email: string | null; created_at: string }[] = [];
  const perPage = 200;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await svc.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    for (const u of users) {
      all.push({
        id: u.id,
        email: u.email ?? null,
        created_at: u.created_at ?? new Date().toISOString(),
      });
    }
    if (users.length < perPage) break;
  }
  return all;
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: callerProfile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (callerProfile?.role !== "admin") redirect("/dashboard");

  const svc = service();
  const authUsers = await listAllAuthUsers(svc);

  const { data: profiles } = await svc
    .from("user_profiles")
    .select("id, full_name, plan, role, created_at, email");

  const profileMap = new Map<string, { full_name: string | null; plan: string | null; role: string | null; created_at: string | null; email: string | null }>();
  for (const p of profiles ?? []) {
    profileMap.set(p.id as string, {
      full_name: (p.full_name as string | null) ?? null,
      plan: (p.plan as string | null) ?? null,
      role: (p.role as string | null) ?? null,
      created_at: (p.created_at as string | null) ?? null,
      email: (p.email as string | null) ?? null,
    });
  }

  const rows: AdminUserRow[] = authUsers.map((u) => {
    const p = profileMap.get(u.id);
    return {
      id: u.id,
      email: u.email ?? p?.email ?? "",
      full_name: p?.full_name ?? null,
      plan: p?.plan ?? "free",
      role: p?.role ?? "user",
      created_at: p?.created_at ?? u.created_at,
    };
  });

  rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <UsersAdminClient initialUsers={rows} currentUserId={user.id} />;
}
