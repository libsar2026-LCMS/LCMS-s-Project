import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const FROM = `LIBSAR <${process.env.RESEND_FROM_EMAIL ?? "noreply@libsar.org"}>`;

export type EmailType =
  | "welcome"
  | "pending_approval"
  | "member_approved"
  | "member_rejected"
  | "forgot_password"
  | "password_changed"
  | "login_notification"
  | "role_updated"
  | "admin_created_account"
  | "account_disabled";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  type: EmailType;
}

async function logEmail(
  to: string,
  subject: string,
  type: EmailType,
  status: "sent" | "failed",
  error?: string
) {
  try {
    const admin = createAdminClient();
    await admin.from("email_logs").insert({ to, subject, type, status, error: error ?? null });
  } catch {
    // Logging must never throw
  }
}

export async function sendEmail({ to, subject, html, type }: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Email DEV] type=${type} to=${to} subject="${subject}"`);
    await logEmail(to, subject, type, "sent");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Email] RESEND_API_KEY is not set");
    await logEmail(to, subject, type, "failed", "RESEND_API_KEY not configured");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error("[Email] Resend error:", error);
      await logEmail(to, subject, type, "failed", JSON.stringify(error));
    } else {
      await logEmail(to, subject, type, "sent");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Email] Send failed:", msg);
    await logEmail(to, subject, type, "failed", msg);
  }
}
