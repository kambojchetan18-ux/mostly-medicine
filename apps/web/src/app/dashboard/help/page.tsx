import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HelpClient, { type HelpTicket } from "./HelpClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Help & Feedback — Mostly Medicine" };

export default async function HelpPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: tickets } = await supabase
    .from("feedback_tickets")
    .select("id, subject, body, category, status, ai_response, ai_confidence, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(25);

  return <HelpClient initialTickets={(tickets ?? []) as HelpTicket[]} />;
}
