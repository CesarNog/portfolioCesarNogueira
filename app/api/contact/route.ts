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

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#111;border:1px solid #222;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#111;border-bottom:1px solid #222;padding:24px 32px;">
            <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:#555;">cesarnogueira.tech</p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:600;color:#f0f0f0;">New message</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 12px;">
                  <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#555;">From</p>
                  <p style="margin:0;font-size:14px;color:#e0e0e0;">${name} <span style="color:#666;">&lt;${email}&gt;</span></p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;">
                  <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Subject</p>
                  <p style="margin:0;font-size:14px;color:#e0e0e0;">${subject || "—"}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:16px 32px 0;"><div style="height:1px;background:#222;"></div></td></tr>
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Message</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#c8c8c8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your message")}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#1a6bff;color:#fff;font-size:13px;font-weight:500;text-decoration:none;border-radius:6px;">Reply to ${name}</a>
          </td>
        </tr>
        <tr>
          <td style="background:#0d0d0d;border-top:1px solid #1a1a1a;padding:16px 32px;">
            <p style="margin:0;font-size:11px;color:#444;">Sent via cesarnogueira.tech contact form</p>
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
