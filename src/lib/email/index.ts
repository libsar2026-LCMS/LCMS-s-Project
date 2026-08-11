import { sendEmail } from "./sendEmail";
import {
  welcomeEmail,
  pendingApprovalEmail,
  memberApprovedEmail,
  memberRejectedEmail,
  forgotPasswordEmail,
  passwordChangedEmail,
  loginNotificationEmail,
  roleUpdatedEmail,
  adminCreatedAccountEmail,
  accountDisabledEmail,
} from "./templates";

export async function sendWelcomeEmail(to: string, fullName: string) {
  const { subject, html } = welcomeEmail(fullName);
  await sendEmail({ to, subject, html, type: "welcome" });
}

export async function sendPendingApprovalEmail(to: string, fullName: string) {
  const { subject, html } = pendingApprovalEmail(fullName);
  await sendEmail({ to, subject, html, type: "pending_approval" });
}

export async function sendMemberApprovedEmail(to: string, fullName: string) {
  const { subject, html } = memberApprovedEmail(fullName);
  await sendEmail({ to, subject, html, type: "member_approved" });
}

export async function sendMemberRejectedEmail(to: string, fullName: string, reason?: string) {
  const { subject, html } = memberRejectedEmail(fullName, reason);
  await sendEmail({ to, subject, html, type: "member_rejected" });
}

export async function sendForgotPasswordEmail(to: string, fullName: string, resetUrl: string) {
  const { subject, html } = forgotPasswordEmail(fullName, resetUrl);
  await sendEmail({ to, subject, html, type: "forgot_password" });
}

export async function sendPasswordChangedEmail(to: string, fullName: string) {
  const { subject, html } = passwordChangedEmail(fullName);
  await sendEmail({ to, subject, html, type: "password_changed" });
}

export async function sendLoginNotificationEmail(
  to: string,
  fullName: string,
  meta: { time: string; browser?: string; ip?: string }
) {
  const { subject, html } = loginNotificationEmail(fullName, meta);
  await sendEmail({ to, subject, html, type: "login_notification" });
}

export async function sendRoleUpdatedEmail(to: string, fullName: string, newRole: string) {
  const { subject, html } = roleUpdatedEmail(fullName, newRole);
  await sendEmail({ to, subject, html, type: "role_updated" });
}

export async function sendAdminCreatedAccountEmail(
  to: string,
  fullName: string,
  tempPassword: string
) {
  const { subject, html } = adminCreatedAccountEmail(fullName, to, tempPassword);
  await sendEmail({ to, subject, html, type: "admin_created_account" });
}

export async function sendAccountDisabledEmail(to: string, fullName: string, reason?: string) {
  const { subject, html } = accountDisabledEmail(fullName, reason);
  await sendEmail({ to, subject, html, type: "account_disabled" });
}

// Legacy alias — keeps existing admin.ts import working
export { sendAdminCreatedAccountEmail as sendWelcomeCredentials };
