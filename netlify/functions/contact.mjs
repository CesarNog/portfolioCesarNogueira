// Netlify Function: handles contact form submissions via Resend.
// Set RESEND_API_KEY in Netlify > Site settings > Environment variables.

const TO = "cesarnogueira1210@gmail.com";
const FROM = "portfolio@cesarnogueira.tech";

export default async (req) => {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ error: "Email not configured" }, 500);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const { name, email, subject, message } = body;
  if (!name || !email || !message) return json({ error: "Missing fields" }, 400);

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] Message from ${name}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
<p><strong>Subject:</strong> ${subject || "—"}</p>
<hr />
<p>${message.replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return json({ error: "Send failed", detail }, 500);
  }

  return json({ ok: true });
};
