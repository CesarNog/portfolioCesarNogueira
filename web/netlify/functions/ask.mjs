// Netlify Function: proxy free-text questions to xAI's Grok API.
//
// Set XAI_API_KEY in Netlify > Site settings > Environment variables to enable
// live AI. Without it (or on any error) the function returns a 200 with a
// `fallback` flag and the client shows a curated answer instead — so the
// chatbot never breaks.

const KNOWLEDGE_BASE = `
Cesar Augusto Nogueira — Principal Cloud Architect, Platform Engineer, DevOps Leader, FinOps Consultant and AI Infrastructure specialist. 10+ years in tech. Based in Vila Real, Portugal; works remotely with international clients via his consultancy UP2CLOUD. Available for international projects.

Certifications: 2x Google Cloud Professional Cloud Architect, Google Cloud Associate Cloud Engineer, AWS Cloud Practitioner, Microsoft Azure Fundamentals (AZ-900).

Experience:
- UP2CLOUD (2025-now): Founder/consultant — cloud, automation, DevOps, data engineering for global clients.
- Randstad Digital Portugal (2022-2025): Cloud FinOps Automation Engineer — Python, multi-cloud billing APIs, CloudBees CI/CD, CloudHealth. Automated cost reporting, tagging, chargeback.
- ZeroLight (2021-2022): DevOps Engineer — automotive, AWS/GCP.
- Accenture Interactive Brazil (2020-2021): Tech Arch Manager — GKE, Jenkins, Spinnaker, team leadership.
- everis/NTT Data Brazil (2019-2020): Cloud Architect — GCP/AWS/Azure/OCI for AndBank, Santander, LATAM Airlines; PII security; observability.
- CI&T (2017-2019): Software Engineer — Big Data on GCP (Apache Beam, DataFlow, BigQuery, App Engine), Java/Node/React.

Skills: GCP, AWS, Azure, OCI, Kubernetes, Terraform, Docker, Argo, GitHub Actions, GitLab CI, Jenkins/CloudBees, BigQuery, Dataform, dbt, Apache Beam, Python, Java, FinOps, Observability, AI infrastructure (LLMs, Grok/OpenAI integrations).

Contact: cesarnogueira1210@gmail.com, LinkedIn linkedin.com/in/cesarnog, GitHub github.com/cesarnog.
`.trim();

const SYSTEM_PROMPT = `You are the friendly "Mission Control" assistant for the portfolio of Cesar Augusto Nogueira. Answer questions about Cesar concisely (2-4 sentences), professionally and in the third person, using ONLY the facts below. If asked something unrelated or unknown, briefly say you focus on Cesar's professional background and suggest emailing him. Never invent employers, certifications or numbers.\n\nFACTS:\n${KNOWLEDGE_BASE}`;

export default async (req) => {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let question = "";
  try {
    const body = await req.json();
    question = String(body?.question || "").slice(0, 600);
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  if (!question.trim()) return json({ error: "Empty question" }, 400);

  const key = process.env.XAI_API_KEY;
  if (!key) {
    return json({
      fallback: true,
      answer:
        "Live AI is not configured yet. Add XAI_API_KEY in Netlify to enable it.",
    });
  }

  try {
    const r = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-2-latest",
        temperature: 0.4,
        max_tokens: 320,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return json({ fallback: true, error: `xAI ${r.status}`, detail }, 200);
    }

    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    return json({ answer: answer || "" });
  } catch (e) {
    return json({ fallback: true, error: String(e) }, 200);
  }
};
