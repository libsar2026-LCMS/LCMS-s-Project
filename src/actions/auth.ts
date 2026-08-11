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
import {
  sendWelcomeEmail,
  sendPendingApprovalEmail,
  sendLoginNotificationEmail,
  sendPasswordChangedEmail,
} from "@/lib/email";

export async function login(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, must_change_password, full_name")
    .eq("id", data.user.id)
    .single();

  if (profile?.membership_status === "pending") {
    return { redirect: "/pending-approval" };
  }

  if (profile?.membership_status === "rejected") {
    await supabase.auth.signOut();
    return { error: "Your membership application was not approved. Please contact LIBSAR for more information." };
  }

  if (profile?.must_change_password) {
    return { redirect: "/reset-password?forced=1" };
  }

  // Fire login notification (non-blocking)
  const email = data.user.email;
  const fullName = profile?.full_name ?? "Member";
  if (email) {
    const time = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Kigali",
    });
    sendLoginNotificationEmail(email, fullName, { time }).catch(() => null);
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

  const { error: signUpError, data } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.full_name } },
  });

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists. Please sign in." };
    }
    return { error: signUpError.message };
  }

  if (data?.user?.id && parsed.data.phone) {
    await supabase.from("profiles").update({ phone: parsed.data.phone }).eq("id", data.user.id);
  }

  // Send welcome + pending approval emails (non-blocking)
  const email = parsed.data.email;
  const fullName = parsed.data.full_name;
  sendWelcomeEmail(email, fullName).catch(() => null);
  sendPendingApprovalEmail(email, fullName).catch(() => null);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    return { redirect: "/login?registered=1" };
  }

  return { redirect: "/pending-approval" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { redirect: "/login" };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();

  // Supabase sends its own reset email — we rely on that for the reset link.
  // The redirectTo lands on /auth/callback which exchanges the code, then goes to /reset-password.
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

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", user.id);

    // Send password changed confirmation (non-blocking)
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const email = user.email;
    const fullName = profile?.full_name ?? "Member";
    if (email) {
      sendPasswordChangedEmail(email, fullName).catch(() => null);
    }
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const role = userRow?.role ?? "member";
  const dest = ["secretary", "president", "super_admin"].includes(role) ? "/admin" : "/dashboard";
  return { redirect: dest };
}
