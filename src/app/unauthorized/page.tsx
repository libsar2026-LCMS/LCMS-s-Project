"use client";

import Link from "next/link";
import { ShieldOff, ArrowLeft, LogOut } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { logout } from "@/actions/auth";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const isRejected = reason === "rejected";
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await logout();
      window.location.href = result.redirect ?? "/login";
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 ring-8 ring-accent/5">
        <ShieldOff size={36} className="text-accent" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
        {isRejected ? "Membership Not Approved" : "Access Denied"}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
        {isRejected
          ? "Your membership application was not approved at this time. Please contact LIBSAR for more information or to appeal this decision."
          : "You don't have permission to view this page. Contact an administrator if you believe this is a mistake."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {isRejected ? (
          <>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
            >
              Contact LIBSAR
            </Link>
            <button
              onClick={handleLogout}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-secondary shadow-sm transition-all hover:border-accent/30 hover:text-accent disabled:opacity-50"
            >
              <LogOut size={15} /> {pending ? "Signing out…" : "Sign Out"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
            >
              <ArrowLeft size={15} /> Go to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-secondary shadow-sm transition-all hover:border-primary/30 hover:text-primary"
            >
              Go Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense>
      <UnauthorizedContent />
    </Suspense>
  );
}
