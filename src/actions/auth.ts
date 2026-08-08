"use server";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

export async function login(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, must_change_password")
    .eq("id", data.user.id)
    .single();

  if (profile?.membership_status === "pending") {
    return { redirect: "/pending-approval" };
  }

  if (profile?.must_change_password) {
    return { redirect: "/reset-password?forced=1" };
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = userRow?.role ?? "member";
  const dest = ["secretary", "president", "super_admin"].includes(role) ? "/admin" : "/dashboard";
  return { redirect: dest };
}

export async function register(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  // Don't reveal whether the email already exists — show success regardless
  if (error && !error.message.toLowerCase().includes("already")) {
    return { error: error.message };
  }

  // Save phone if provided (trigger already created the profile row)
  if (data?.user?.id && parsed.data.phone) {
    await supabase
      .from("profiles")
      .update({ phone: parsed.data.phone })
      .eq("id", data.user.id);
  }

  return { success: "Account created! Your registration is pending admin approval. You'll receive an email once your account is approved." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: "Password reset link sent. Check your email." };
}

export async function resetPassword(input: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  // Clear the forced-change flag if it was set
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", user.id);
  }

  // Redirect to role-appropriate destination
  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const role = userRow?.role ?? "member";
  const dest = ["secretary", "president", "super_admin"].includes(role) ? "/admin" : "/dashboard";
  return { redirect: dest };
}
