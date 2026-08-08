import Link from "next/link";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 ring-8 ring-accent/5">
        <ShieldOff size={36} className="text-accent" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">Access Denied</h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
        You don&apos;t have permission to view this page. Contact an administrator if you believe this is a mistake.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </div>
    </div>
  );
}
