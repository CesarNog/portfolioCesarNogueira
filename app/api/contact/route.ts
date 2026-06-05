import { NextRequest, NextResponse } from "next/server";

const TO = "cesarnogueira1210@gmail.com";
const FROM = "Portfolio <portfolio@cesarnogueira.tech>";

export async function POST(req: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email not configured" }, { status: 500 });

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { name, email, subject, message } = body;
  if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const sentAt = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Lisbon",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#111;border:1px solid #222;border-radius:10px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#0f1929;border-bottom:1px solid #1e3a5f;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.14em;text-transform:uppercase;color:#2563eb;">cesarnogueira.tech</p>
                  <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#f0f0f0;">New contact message</p>
                </td>
                <td align="right" valign="top">
                  <span style="display:inline-block;padding:4px 10px;background:#1a3a1a;color:#4ade80;font-size:11px;font-family:monospace;border-radius:4px;border:1px solid #166534;">SLA: 24h</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Meta grid -->
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:0 12px 16px 0;vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#444;">From</p>
                  <p style="margin:0;font-size:14px;font-weight:500;color:#e0e0e0;">${name}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#555;">${email}</p>
                </td>
                <td width="50%" style="padding:0 0 16px 0;vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#444;">Received</p>
                  <p style="margin:0;font-size:14px;font-weight:500;color:#e0e0e0;">${sentAt}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#555;">Lisbon time</p>
                </td>
              </tr>
              ${subject ? `<tr>
                <td colspan="2" style="padding:0 0 16px 0;">
                  <p style="margin:0 0 4px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#444;">Subject</p>
                  <p style="margin:0;font-size:14px;font-weight:500;color:#e0e0e0;">${subject}</p>
                </td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

        <!-- Message -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#444;">Message</p>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#c0c0c0;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 28px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your message")}" style="display:inline-block;padding:11px 22px;background:#2563eb;color:#fff;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;letter-spacing:0.01em;">Reply to ${name} →</a>
          </td>
        </tr>

        <!-- SLA reminder -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table cellpadding="0" cellspacing="0" style="background:#0f1a0f;border:1px solid #1a3a1a;border-radius:6px;width:100%;">
              <tr>
                <td style="padding:12px 16px;">
                  <p style="margin:0;font-size:12px;color:#4ade80;">⏱ Reply within <strong>24 hours</strong> — SLA committed on cesarnogueira.tech</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d0d0d;border-top:1px solid #1a1a1a;padding:14px 32px;">
            <p style="margin:0;font-size:11px;color:#3a3a3a;">Sent via cesarnogueira.tech contact form · ${sentAt}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: subject ? `✉ ${subject} — from ${name}` : `✉ New message from ${name}`,
      html,
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return NextResponse.json({ error: "Send failed", detail }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
