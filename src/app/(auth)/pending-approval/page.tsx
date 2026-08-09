"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Clock, RefreshCw, LogOut, Home, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/actions/auth";

export default function PendingApprovalPage() {
  const [status, setStatus] = useState<string>("pending");
  const [checking, setChecking] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const checkStatus = useCallback(async () => {
    setChecking(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const memberStatus = profile?.membership_status ?? "pending";
      setStatus(memberStatus);

      if (memberStatus === "active") {
        window.location.href = "/dashboard";
      } else if (memberStatus === "rejected") {
        window.location.href = "/unauthorized?reason=rejected";
      }
    } finally {
      setChecking(false);
    }
  }, []);

  // Auto-poll every 15 seconds
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 15_000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  async function handleLogout() {
    setLoggingOut(true);
    const result = await logout();
    window.location.href = result.redirect ?? "/login";
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
        <Clock size={40} className="text-warning" />
      </div>

      <h1 className="font-display text-2xl font-bold text-text-primary">
        Registration Successful
      </h1>

      <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
        Thank you for registering with LIBSAR. Your membership request has been submitted
        successfully. Your account is currently awaiting approval by the Super Administrator.
        Once approved, you will automatically gain access to the Member Portal.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 py-2 text-sm font-semibold text-warning">
        <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
        Pending Approval
      </div>

      <p className="mt-4 text-xs text-text-secondary">
        This page checks for updates automatically. Please check back later.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Home size={15} /> Return Home
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition-all hover:border-primary/30 hover:text-primary"
        >
          <Mail size={15} /> Contact LIBSAR
        </Link>

        <button
          onClick={checkStatus}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
          {checking ? "Checking…" : "Refresh Status"}
        </button>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent disabled:opacity-50"
        >
          <LogOut size={15} />
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
