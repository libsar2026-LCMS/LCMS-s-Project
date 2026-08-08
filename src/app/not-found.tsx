import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-display text-[120px] font-extrabold leading-none text-border select-none sm:text-[160px]">
        404
      </p>
      <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <ArrowLeft size={15} /> Go Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-secondary shadow-sm transition-all hover:border-primary/30 hover:text-primary"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
