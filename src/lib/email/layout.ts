const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://libsar.org";

export function emailLayout(content: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>LIBSAR</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:linear-gradient(135deg,#1a3c5e 0%,#1e4976 100%);padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">LIBSAR</p>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.65);letter-spacing:0.5px;text-transform:uppercase;">Liberian Students Association in Rwanda</p>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px;">
            ${content}
          </td>
        </tr>

        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">LIBSAR · Kigali, Rwanda</p>
            <p style="margin:0;font-size:11px;color:#cbd5e1;">
              <a href="${APP_URL}" style="color:#1a3c5e;text-decoration:none;">libsar.org</a>
              &nbsp;·&nbsp;
              <a href="mailto:info@libsar.org" style="color:#1a3c5e;text-decoration:none;">info@libsar.org</a>
            </p>
            <p style="margin:12px 0 0;font-size:10px;color:#cbd5e1;">You received this because of your LIBSAR membership. Do not reply to this email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function btn(label: string, href: string, color = "#1a3c5e"): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr><td align="center">
      <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;">${label} →</a>
    </td></tr>
  </table>`;
}

export function infoBox(content: string, borderColor = "#e2e8f0", bg = "#f8fafc"): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${borderColor};border-radius:12px;margin:16px 0;">
    <tr><td style="padding:16px 20px;font-size:13px;color:#374151;line-height:1.6;">${content}</td></tr>
  </table>`;
}

export function warningBox(content: string): string {
  return infoBox(content, "#fde68a", "#fffbeb");
}

export function h(text: string): string {
  return `<p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">${text}</p>`;
}

export function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7;">${text}</p>`;
}
