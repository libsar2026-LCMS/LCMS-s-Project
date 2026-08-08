"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, AlertTriangle } from "lucide-react";
import { resetPassword } from "@/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const isForced = searchParams.get("forced") === "1";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setError(null);
    const result = await resetPassword(data);
    if (result?.error) setError(result.error);
    else if (result?.redirect) window.location.replace(result.redirect);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {isForced ? "Set your password" : "Reset password"}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {isForced
            ? "Your account was created by an admin. Please set a personal password to continue."
            : "Enter a new password for your account."}
        </p>
      </div>

      {isForced && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/8 px-4 py-3 text-sm text-warning">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>You must set a new password before accessing the system.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">New password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-accent">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Confirm new password</label>
          <input
            {...register("confirm_password")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {errors.confirm_password && <p className="mt-1.5 text-xs text-accent">{errors.confirm_password.message}</p>}
        </div>

        {error && (
          <div className="rounded-xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ShieldCheck size={16} />
          {isSubmitting ? "Saving…" : isForced ? "Set password & continue" : "Save new password"}
        </button>
      </form>

      {!isForced && (
        <p className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </p>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
