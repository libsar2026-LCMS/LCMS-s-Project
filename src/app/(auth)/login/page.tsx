"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "@/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const registered = searchParams.get("registered") === "1";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const result = await login(data);
    if (result?.error) setError(result.error);
    else if (result?.redirect) window.location.href = result.redirect;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-2 text-sm text-text-secondary">Sign in to your LIBSAR account</p>
      </div>

      {registered && (
        <div className="mb-5 rounded-xl border border-success/20 bg-success/8 px-4 py-3 text-sm text-success">
          Account created! Please sign in to continue.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Email address</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
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

        {(error ?? urlError) && (
          <div className="rounded-xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
            {error ?? urlError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          <LogIn size={16} />
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-light transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
