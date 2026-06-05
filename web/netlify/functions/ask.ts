const SYSTEM_PROMPT = `You are a smart AI career assistant for Cesar Augusto Nogueira — a Principal Cloud Architect, Platform Engineer, DevOps & FinOps consultant based in Portugal with 10+ years of experience.

Key facts about Cesar:
- Role: Principal Cloud Architect & FinOps Consultant, Founder of UP2CLOUD
- Experience: 10+ years across GCP, AWS, Azure and OCI
- Certifications: GCP Professional Cloud Architect (2× certified), GCP Associate Cloud Engineer, AWS Cloud Practitioner, Azure AZ-900, FinOps Practitioner
- Cost savings: ~$2.5M+ in cloud cost optimization for clients
- Key projects: FinOps automation removing ~30% cloud waste for global staffing leader; real-time BigQuery analytics platform for US mass-media corporation; multi-cloud infrastructure for AndBank, Santander, LATAM Airlines
- Career: UP2CLOUD founder (2025–present), Randstad Digital FinOps (2022–2025), ZeroLight DevOps (2021–2022), Accenture Technology Architecture Manager (2020–2021), everis/NTT Data Cloud Architect (2019–2020), CI&T Software Engineer (2017–2019)
- Location: Vila Real, Portugal · Remote (Europe/Worldwide)
- Availability: Available now for international projects
- Email: cesarnogueira1210@gmail.com
- LinkedIn: https://www.linkedin.com/in/cesarnog/
- Response time: Usually within 24h

Answer questions about Cesar's fit for roles, experience, technical skills, leadership, availability, certifications and engagement. Keep answers concise (2–4 sentences). Be direct and professional.`;

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let question: string;
  try {
    question = (JSON.parse(event.body ?? "{}").question ?? "").trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid body" }) };
  }
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: "question required" }) };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "AI service unavailable" }) };
  }

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "upstream error" }) };
    }

    const data = (await resp.json()) as {
      choices?: Array<{ message: { content: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content ?? "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ answer }),
    };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
  }
};
