"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-sans">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 ring-8 ring-accent/5">
            <AlertTriangle size={36} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Something went wrong</h1>
          <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
          >
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      </body>
    </html>
  );
}
