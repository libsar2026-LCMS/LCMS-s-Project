"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function ConfirmPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;

    // If no hash token, this page was reached incorrectly
    if (!hash || !hash.includes("access_token")) {
      setError("This link is invalid or has already been used. Please request a new invitation.");
      return;
    }

    const supabase = createClient();

    // Supabase implicit-flow invite links deliver tokens as hash fragments:
    // #access_token=...&refresh_token=...&type=invite
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        window.location.replace("/reset-password");
      }
    });

    supabase.auth.getSession();

    // Timeout fallback — if no session after 10s, show error
    const timer = setTimeout(() => {
      setError("Could not verify your invitation. The link may have expired. Please request a new one.");
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-sm text-accent">{error}</p>
        <a href="/login" className="text-sm font-medium text-primary underline underline-offset-4">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LoadingSpinner />
      <p className="text-sm text-text-secondary">Setting up your account…</p>
    </div>
  );
}
