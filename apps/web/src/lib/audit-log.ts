import { createClient as createServiceClient } from "@supabase/supabase-js";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function logAdminAction(opts: {
  adminId: string;
  action: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ip?: string;
}): Promise<void> {
  try {
    await service().from("admin_audit_log").insert({
      admin_id: opts.adminId,
      action: opts.action,
      target_id: opts.targetId ?? null,
      details: opts.details ?? {},
      ip_address: opts.ip ?? null,
    });
  } catch (err) {
    console.error("[audit-log] write failed:", err);
  }
}
