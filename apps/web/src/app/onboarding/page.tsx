import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Profile-required fallback page. The on_auth_user_created trigger normally
// inserts a user_profiles row at signup, so this page should rarely fire —
// it covers legacy users / trigger failure. Idempotent: if the row already
// exists, we just redirect to the dashboard.
//
// RLS allows a user to INSERT only their own row (auth.uid() = id); the row
// is also constrained to one-per-user via the PK on `id`.
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = (await searchParams) ?? {};
  const rawNext = params.next ?? "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const { data: existing } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    // Row already exists — nothing to do, off you go.
    redirect(next);
  }

  // Try to insert the profile. RLS check: auth.uid() = id.
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    email: user.email,
    full_name: fullName,
  });

  if (error) {
    // Most likely cause: race with the trigger (row created between our SELECT
    // and INSERT). Re-check; if it's there now, proceed.
    const { data: retry } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (retry) {
      redirect(next);
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Setting up your profile
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Something went wrong creating your profile. Please refresh the page
            or contact support.
          </p>
          <p className="text-xs text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  redirect(next);
}
