import { emailLayout, btn, infoBox, warningBox, h, p } from "./layout";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://libsar.org";

// ── 1. Welcome (after self-registration) ────────────────────────────────────
export function welcomeEmail(fullName: string): { subject: string; html: string } {
  return {
    subject: "Welcome to LIBSAR 🎉",
    html: emailLayout(
      h(`Welcome, ${fullName}! 👋`) +
      p("Thank you for registering with the LIBSAR Community Management System. Your account has been created successfully.") +
      infoBox(
        `<strong style="color:#0f172a;">What happens next?</strong><br/>
        Your membership application is currently <strong>pending review</strong> by our administrators.
        You will receive an email once your account has been approved — usually within 1–3 business days.`,
        "#bfdbfe", "#eff6ff"
      ) +
      btn("Visit LIBSAR Website", APP_URL) +
      p("If you have any questions, please contact us at <a href='mailto:info@libsar.org' style='color:#1a3c5e;'>info@libsar.org</a>."),
      "Welcome to LIBSAR — your registration was successful"
    ),
  };
}

// ── 2. Pending Approval ──────────────────────────────────────────────────────
export function pendingApprovalEmail(fullName: string): { subject: string; html: string } {
  return {
    subject: "Membership Request Received — LIBSAR",
    html: emailLayout(
      h("Membership Request Received") +
      p(`Hi ${fullName}, we have received your membership application.`) +
      infoBox(
        `<strong style="color:#92400e;">Current Status: Pending Approval</strong><br/>
        Our administrators will review your application and notify you by email once a decision has been made.
        This typically takes 1–3 business days.`,
        "#fde68a", "#fffbeb"
      ) +
      p("You can check your application status by visiting the pending approval page.") +
      btn("Check Status", `${APP_URL}/pending-approval`),
      "Your LIBSAR membership application is under review"
    ),
  };
}

// ── 3. Member Approved ───────────────────────────────────────────────────────
export function memberApprovedEmail(fullName: string): { subject: string; html: string } {
  return {
    subject: "Congratulations! Your LIBSAR Membership is Approved 🎊",
    html: emailLayout(
      h("You're officially a LIBSAR member! 🎊") +
      p(`Congratulations, ${fullName}! Your membership application has been <strong style="color:#16a34a;">approved</strong>.`) +
      infoBox(
        `You now have full access to the LIBSAR Member Portal, including:<br/>
        <ul style="margin:8px 0 0;padding-left:20px;color:#374151;">
          <li>Your digital membership card</li>
          <li>Events registration</li>
          <li>Community news and announcements</li>
          <li>Member directory</li>
        </ul>`,
        "#bbf7d0", "#f0fdf4"
      ) +
      btn("Open Member Dashboard", `${APP_URL}/dashboard`, "#16a34a") +
      p("Welcome to the LIBSAR family! We are excited to have you with us."),
      "Your LIBSAR membership has been approved"
    ),
  };
}

// ── 4. Member Rejected ───────────────────────────────────────────────────────
export function memberRejectedEmail(fullName: string, reason?: string): { subject: string; html: string } {
  return {
    subject: "Update on Your LIBSAR Membership Application",
    html: emailLayout(
      h("Membership Application Update") +
      p(`Dear ${fullName}, thank you for your interest in joining LIBSAR.`) +
      p("After careful review, we are unable to approve your membership application at this time.") +
      (reason ? infoBox(`<strong>Reason:</strong> ${reason}`, "#fecaca", "#fef2f2") : "") +
      infoBox(
        `If you believe this decision was made in error, or if you would like more information,
        please do not hesitate to contact us at <a href="mailto:info@libsar.org" style="color:#1a3c5e;">info@libsar.org</a>.
        We are happy to discuss your application further.`,
        "#e2e8f0", "#f8fafc"
      ) +
      p("We appreciate your understanding and hope to welcome you to LIBSAR in the future."),
      "Update on your LIBSAR membership application"
    ),
  };
}

// ── 5. Forgot Password ───────────────────────────────────────────────────────
export function forgotPasswordEmail(fullName: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset Your LIBSAR Password",
    html: emailLayout(
      h("Password Reset Request") +
      p(`Hi ${fullName}, we received a request to reset the password for your LIBSAR account.`) +
      btn("Reset My Password", resetUrl, "#dc2626") +
      warningBox("⏱️ This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will not change.") +
      p("For security, this link can only be used once. If you need a new link, visit the forgot password page again."),
      "Reset your LIBSAR account password"
    ),
  };
}

// ── 6. Password Changed Confirmation ────────────────────────────────────────
export function passwordChangedEmail(fullName: string): { subject: string; html: string } {
  return {
    subject: "Your LIBSAR Password Has Been Changed",
    html: emailLayout(
      h("Password Updated Successfully ✓") +
      p(`Hi ${fullName}, your LIBSAR account password was successfully changed.`) +
      infoBox(
        `If you made this change, no further action is required.<br/><br/>
        <strong style="color:#dc2626;">If you did NOT make this change</strong>, please contact us immediately at
        <a href="mailto:info@libsar.org" style="color:#1a3c5e;">info@libsar.org</a> or reset your password right away.`,
        "#fecaca", "#fef2f2"
      ) +
      btn("Sign In to LIBSAR", `${APP_URL}/login`),
      "Your LIBSAR password was changed"
    ),
  };
}

// ── 7. Login Notification ────────────────────────────────────────────────────
export function loginNotificationEmail(
  fullName: string,
  meta: { time: string; browser?: string; ip?: string }
): { subject: string; html: string } {
  return {
    subject: "New Sign-in to Your LIBSAR Account",
    html: emailLayout(
      h("New Sign-in Detected") +
      p(`Hi ${fullName}, a new sign-in to your LIBSAR account was detected.`) +
      infoBox(
        `<table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280;width:90px;">Time</td><td style="font-size:13px;color:#0f172a;font-weight:500;">${meta.time}</td></tr>
          ${meta.browser ? `<tr><td style="padding:4px 0;font-size:13px;color:#6b7280;">Browser</td><td style="font-size:13px;color:#0f172a;font-weight:500;">${meta.browser}</td></tr>` : ""}
          ${meta.ip ? `<tr><td style="padding:4px 0;font-size:13px;color:#6b7280;">IP Address</td><td style="font-size:13px;color:#0f172a;font-weight:500;">${meta.ip}</td></tr>` : ""}
        </table>`,
        "#bfdbfe", "#eff6ff"
      ) +
      p("If this was you, no action is needed. If you did not sign in, please reset your password immediately.") +
      btn("Reset Password", `${APP_URL}/forgot-password`, "#dc2626"),
      "New sign-in to your LIBSAR account"
    ),
  };
}

// ── 8. Role Updated ──────────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  committee_head: "Committee Head",
  secretary: "Secretary",
  president: "President",
  super_admin: "Super Administrator",
};

export function roleUpdatedEmail(fullName: string, newRole: string): { subject: string; html: string } {
  const roleLabel = ROLE_LABELS[newRole] ?? newRole;
  const isAdmin = ["secretary", "president", "super_admin"].includes(newRole);
  return {
    subject: `Your LIBSAR Role Has Been Updated — ${roleLabel}`,
    html: emailLayout(
      h("Your Role Has Been Updated") +
      p(`Hi ${fullName}, your role in the LIBSAR system has been updated by an administrator.`) +
      infoBox(
        `<strong style="color:#0f172a;">New Role:</strong>
        <span style="display:inline-block;margin-left:8px;background:#1a3c5e;color:#fff;padding:2px 12px;border-radius:20px;font-size:12px;font-weight:600;">${roleLabel}</span>`,
        "#bfdbfe", "#eff6ff"
      ) +
      (isAdmin
        ? p("You now have access to the Admin Dashboard. Please use your elevated permissions responsibly.")
        : p("Your access level has been updated. Sign in to see your current permissions.")) +
      btn("Sign In", isAdmin ? `${APP_URL}/admin` : `${APP_URL}/dashboard`),
      `Your LIBSAR role has been updated to ${roleLabel}`
    ),
  };
}

// ── 9. Admin-Created Account (with temp password) ────────────────────────────
export function adminCreatedAccountEmail(
  fullName: string,
  email: string,
  tempPassword: string
): { subject: string; html: string } {
  return {
    subject: "Your LIBSAR Account Has Been Created",
    html: emailLayout(
      h(`Welcome to LIBSAR, ${fullName}! 👋`) +
      p("An administrator has created a LIBSAR account for you. Use the credentials below to sign in.") +
      `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:16px 0;">
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#94a3b8;">Email</p>
            <p style="margin:0;font-size:15px;font-family:monospace;color:#0f172a;">${email}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;background:#eff6ff;border-bottom:1px solid #dbeafe;">
            <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#3b82f6;">Temporary Password</p>
            <p style="margin:0;font-size:20px;font-family:monospace;font-weight:700;color:#1d4ed8;letter-spacing:2px;">${tempPassword}</p>
          </td>
        </tr>
      </table>` +
      warningBox("⚠️ <strong>This password will not be sent again.</strong> Please save it now and change it immediately after signing in.") +
      btn("Sign In to LIBSAR", `${APP_URL}/login`) +
      infoBox(
        `<strong style="color:#0f172a;">Getting started:</strong>
        <ol style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:13px;">
          <li style="margin-bottom:4px;">Sign in with your email and temporary password above</li>
          <li style="margin-bottom:4px;">You will be prompted to set a new personal password</li>
          <li>Once done, you will have full access to your account</li>
        </ol>`,
        "#e2e8f0", "#f8fafc"
      ),
      "Your LIBSAR account credentials"
    ),
  };
}

// ── 10. Account Disabled ─────────────────────────────────────────────────────
export function accountDisabledEmail(fullName: string, reason?: string): { subject: string; html: string } {
  return {
    subject: "Your LIBSAR Account Has Been Suspended",
    html: emailLayout(
      h("Account Suspended") +
      p(`Dear ${fullName}, your LIBSAR account has been suspended by an administrator.`) +
      (reason ? infoBox(`<strong>Reason:</strong> ${reason}`, "#fecaca", "#fef2f2") : "") +
      infoBox(
        `If you believe this is a mistake or would like to appeal this decision, please contact us at
        <a href="mailto:info@libsar.org" style="color:#1a3c5e;">info@libsar.org</a>.`,
        "#e2e8f0", "#f8fafc"
      ),
      "Your LIBSAR account has been suspended"
    ),
  };
}
