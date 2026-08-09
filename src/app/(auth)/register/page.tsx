"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { register as registerAction } from "@/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    const result = await registerAction(data);
    if (result?.error) {
      setError(result.error);
    } else if (result?.redirect) {
      window.location.href = result.redirect;
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">Join LIBSAR</h1>
        <p className="mt-2 text-sm text-text-secondary">Create your member account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Full name</label>
          <input
            {...register("full_name")}
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {errors.full_name && <p className="mt-1.5 text-xs text-accent">{errors.full_name.message}</p>}
        </div>

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
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Phone number <span className="text-xs font-normal text-text-secondary">(optional)</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="+250 000 000 000"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-accent">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Password</label>
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
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Confirm password</label>
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          <UserPlus size={16} />
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
