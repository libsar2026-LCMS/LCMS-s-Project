import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
        <Mail size={36} className="text-primary" />
      </div>
      <h1 className="font-display text-3xl font-bold text-text-primary">Check your email</h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
        We sent a verification link to your email address. Click the link to activate your account
        and join the LIBSAR community.
      </p>

      <div className="mt-8 w-full rounded-2xl border border-border bg-surface p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">What to do next</p>
        <ol className="space-y-2.5">
          {[
            "Open your email inbox",
            "Find the email from LIBSAR",
            "Click the verification link",
            "You'll be redirected to sign in",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-sm text-text-secondary">
        Already verified?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
