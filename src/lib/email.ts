import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@libsar.org";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://libsar.org";

export async function sendWelcomeCredentials(email: string, fullName: string, tempPassword: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a3c5e;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">LIBSAR</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Liberian Students Association in Rwanda</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Welcome, ${fullName}! 👋</p>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
              Your LIBSAR account has been created by an administrator. Use the credentials below to sign in.
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#9ca3af;">Email</p>
                  <p style="margin:0;font-size:15px;font-family:monospace;color:#111827;">${email}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;background:#eff6ff;border-bottom:1px solid #dbeafe;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#3b82f6;">Temporary Password</p>
                  <p style="margin:0;font-size:18px;font-family:monospace;font-weight:700;color:#1d4ed8;letter-spacing:1px;">${tempPassword}</p>
                </td>
              </tr>
            </table>

            <!-- Warning -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#92400e;">
                  ⚠️ <strong>This password will not be sent again.</strong> Please save it now.
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${APP_URL}/login"
                     style="display:inline-block;background:#1a3c5e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:10px;letter-spacing:0.2px;">
                    Sign In to LIBSAR →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Steps -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#111827;">How to get started:</p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#374151;">
                        <span style="display:inline-block;width:20px;height:20px;background:#1a3c5e;color:#fff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">1</span>
                        Go to <a href="${APP_URL}/login" style="color:#1d4ed8;text-decoration:none;font-weight:500;">${APP_URL}/login</a> and enter your email + temp password
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#374151;">
                        <span style="display:inline-block;width:20px;height:20px;background:#1a3c5e;color:#fff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">2</span>
                        Once signed in, go to <strong>Profile → Change Password</strong> to set a new one
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#374151;">
                        <span style="display:inline-block;width:20px;height:20px;background:#1a3c5e;color:#fff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">3</span>
                        Or use <strong>Forgot Password</strong> on the login page to reset via email
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              This email was sent by LIBSAR administration. If you did not expect this, please ignore it.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[DEV] Welcome email suppressed. Credentials:", { email, tempPassword });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: `LIBSAR <${FROM}>`,
      to: email,
      subject: "Your LIBSAR Account Credentials",
      html,
    });
    if (error) console.error("[Resend API Error]:", error);
  } catch (err) {
    console.error("[Resend send failed]:", err);
  }
}
