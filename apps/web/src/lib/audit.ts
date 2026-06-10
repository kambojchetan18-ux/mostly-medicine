import { createClient } from "@supabase/supabase-js";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function logAdminAction(opts: {
  adminUserId: string;
  action: string;
  targetUserId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const svc = serviceClient();
  await svc.from("admin_audit_log").insert({
    admin_user_id: opts.adminUserId,
    action: opts.action,
    target_user_id: opts.targetUserId ?? null,
    details: opts.details ?? {},
    ip_address: opts.ipAddress ?? null,
  });
}
