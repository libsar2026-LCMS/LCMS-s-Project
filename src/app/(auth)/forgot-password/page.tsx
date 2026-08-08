"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPassword } from "@/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setError(null);
    const result = await forgotPassword(data);
    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Check your inbox</h1>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
          We sent a password reset link to your email. It may take a minute to arrive.
        </p>
        <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
          <ArrowLeft size={15} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">Reset password</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" />
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email.message}</p>}
        </div>

        {error && (
          <div className="rounded-xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </p>
    </div>
  );
}
