export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let name: string, email: string, message: string;
  try {
    ({ name, email, message } = JSON.parse(event.body ?? "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid body" }) };
  }
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "name, email and message are required" }),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "Email service unavailable" }) };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["cesarnogueira1210@gmail.com"],
      reply_to: email,
      subject: `[Portfolio] ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error("Resend error:", resp.status, err);
    return { statusCode: 502, body: JSON.stringify({ error: "Email delivery failed" }) };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
};
