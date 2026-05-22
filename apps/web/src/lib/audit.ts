import { createClient as createServiceClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let _sb: ReturnType<typeof createServiceClient> | null = null;
function service() {
  if (!_sb) _sb = createServiceClient(url, key, { auth: { persistSession: false } });
  return _sb;
}

export async function auditLog(opts: {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}): Promise<void> {
  await service()
    .from("admin_audit_log")
    .insert({
      admin_id: opts.adminId,
      action: opts.action,
      target_type: opts.targetType ?? null,
      target_id: opts.targetId ?? null,
      metadata: opts.metadata ?? {},
      ip_address: opts.ip ?? null,
    })
    .then(() => {});
}
