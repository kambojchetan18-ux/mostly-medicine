"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError("No email found. Please sign up again."); setLoading(false); return; }
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) { setError(error.message); } else { setResent(true); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We sent a confirmation link to your email address. Click the link to activate your account and access all features.
        </p>

        {resent ? (
          <p className="text-green-600 text-sm font-medium mb-4">Confirmation email resent!</p>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 mb-3"
            >
              {loading ? "Sending…" : "Resend confirmation email"}
            </button>
          </>
        )}

        <p className="text-xs text-gray-400">
          Wrong email?{" "}
          <Link href="/auth/signup" className="text-brand-600 hover:underline">Sign up again</Link>
          {" · "}
          <Link href="/auth/login" className="text-brand-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
