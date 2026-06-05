import { NextRequest, NextResponse } from "next/server";

const KNOWLEDGE_BASE = `
Cesar Augusto Nogueira — Principal Cloud Architect, Platform Engineer, DevOps Leader, FinOps Consultant and AI Infrastructure specialist. 10+ years in tech. Based in Vila Real, Portugal; works remotely with international clients via his consultancy UP2CLOUD. Available now for global remote consulting; usually replies within 24h.

Business impact highlights:
- Cut ~30% of cloud waste and automated chargeback for a global staffing leader (Randstad).
- Built a real-time Big Data analytics platform on Google Cloud for a US mass-media corporation.
- Delivered secure, observable multi-cloud at 99.9% availability for AndBank, Santander and LATAM Airlines.
- Led a cloud-enablement team running GKE in production at Accenture.
- ~30% cloud waste reduction documented; 40+ cloud projects; 6+ countries served.

Certifications: 2x Google Cloud Professional Cloud Architect, Google Cloud Associate Cloud Engineer, AWS Cloud Practitioner, Microsoft Azure Fundamentals (AZ-900), applied FinOps.

Experience:
- UP2CLOUD (2022-now): Founder / Principal consultant — cloud architecture, automation, DevOps, FinOps, data engineering for global clients.
- Randstad Digital Portugal (2022-2025): Cloud FinOps Automation Engineer — Python, multi-cloud billing APIs, CloudBees CI/CD, CloudHealth. Automated cost reporting, tagging, chargeback; ~30% waste removed.
- ZeroLight (2021-2022): DevOps Engineer — automotive, AWS/GCP, Kubernetes.
- Accenture Interactive Brazil (2020-2021): Technology Architecture Manager — GKE, Jenkins, Spinnaker, technical pre-sales, team leadership.
- everis/NTT Data Brazil (2019-2020): Cloud Architect — GCP/AWS/Azure/OCI for AndBank, Santander, LATAM Airlines; PII security; observability.
- CI&T (2017-2019): Software Engineer — Big Data on GCP (Apache Beam, DataFlow, BigQuery, App Engine), Java/Node/React.

Industries: Banking, Aviation, Media, Staffing, Automotive, Consulting. Countries: Portugal, Spain, Netherlands, UK, Brazil, US clients.

Skills: GCP, AWS, Azure, OCI, Kubernetes, Terraform, Docker, Argo, GitHub Actions, GitLab CI, Jenkins/CloudBees, BigQuery, Dataform, dbt, Apache Beam, Python, Java, FinOps, Observability, AI infrastructure (LLMs, OpenAI integrations, RAG).

Contact: cesarnogueira1210@gmail.com, LinkedIn linkedin.com/in/cesarnog, GitHub github.com/cesarnog.
`.trim();

const LANG_NAMES: Record<string, string> = { en: "English", pt: "Portuguese", es: "Spanish", fr: "French", zh: "Chinese" };

function buildSystemPrompt(lang: string): string {
  const langName = LANG_NAMES[lang] || "English";
  const langInstruction = lang && lang !== "en"
    ? ` IMPORTANT: You MUST reply in ${langName}. The user's interface language is ${langName} — match it exactly.`
    : "";
  return `You are the AI Career Assistant for Principal Cloud Architect Cesar Augusto Nogueira. Your audience is recruiters, CTOs, VPs of Engineering, Platform Directors, Heads of Cloud and Founders evaluating Cesar for a role or consulting engagement. Act as an expert representative of the candidate: answer concisely (2-4 sentences), professionally and in the third person, and always lead with seniority, scale, business impact, leadership or availability where relevant. Use ONLY the facts below. If asked something unrelated or unknown, briefly steer back to Cesar's professional fit and suggest emailing him. Never invent employers, certifications or numbers.${langInstruction}\n\nFACTS:\n${KNOWLEDGE_BASE}`;
}

export async function POST(req: NextRequest) {
  let question = "";
  let lang = "en";
  try {
    const body = await req.json();
    question = String(body?.question || "").slice(0, 600);
    lang = String(body?.lang || "en").slice(0, 5);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!question.trim()) return NextResponse.json({ error: "Empty question" }, { status: 400 });

  const grokKey = process.env.GROK_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const key = grokKey || groqKey;
  const endpoint = grokKey
    ? "https://api.x.ai/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  const model = grokKey
    ? (process.env.GROK_MODEL || "grok-3-mini")
    : (process.env.GROQ_MODEL || "llama-3.3-70b-versatile");

  if (!key) {
    return NextResponse.json({
      fallback: true,
      answer: "Cesar is a Principal Cloud Architect with 10+ years across GCP, AWS, Azure and OCI, available now for international consulting via UP2CLOUD. For specific questions email cesarnogueira1210@gmail.com.",
    });
  }

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 320,
        messages: [
          { role: "system", content: buildSystemPrompt(lang) },
          { role: "user", content: question },
        ],
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      const provider = grokKey ? "xai" : "groq";
      console.error(`[ask] ${provider} error ${r.status}:`, detail);
      return NextResponse.json({ fallback: true, error: `${provider} ${r.status}`, detail });
    }

    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ answer: answer || "" });
  } catch (e) {
    return NextResponse.json({ fallback: true, error: String(e) });
  }
}
