import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import TicketsClient, { type AdminTicket } from "./TicketsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tickets — Admin · Mostly Medicine" };

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const svc = service();
  const { data: rows } = await svc
    .from("feedback_tickets")
    .select("id, user_id, subject, body, category, status, ai_response, ai_confidence, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
  const { data: profiles } = userIds.length
    ? await svc.from("user_profiles").select("id, email, full_name").in("id", userIds)
    : { data: [] as { id: string; email: string | null; full_name: string | null }[] };
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const tickets: AdminTicket[] = (rows ?? []).map((r) => ({
    id: r.id,
    subject: r.subject,
    body: r.body,
    category: r.category,
    status: r.status,
    aiResponse: r.ai_response,
    aiConfidence: r.ai_confidence,
    createdAt: r.created_at,
    userEmail: byId.get(r.user_id)?.email ?? "(unknown)",
    userName: byId.get(r.user_id)?.full_name ?? "",
  }));

  return <TicketsClient initialTickets={tickets} />;
}
