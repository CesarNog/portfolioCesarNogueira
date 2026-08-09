import { NextRequest, NextResponse } from "next/server";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { knowledgeBase } from "@/lib/site-config";

const LANG_NAMES: Record<string, string> = { en: "English", pt: "Brazilian Portuguese", es: "Spanish", fr: "French", zh: "Chinese" };

function buildSystemPrompt(lang: string): string {
  const langName = LANG_NAMES[lang] || "English";
  const langRule = lang === "en"
    ? "Always reply in English."
    : `MANDATORY LANGUAGE RULE: You MUST reply exclusively in ${langName}. Never switch to English, even for technical terms — keep all explanatory prose in ${langName}. If you reply in English you are violating this rule.`;
  return `You are the AI Career Assistant for Principal Cloud Architect Cesar Augusto Nogueira. Your audience is recruiters, CTOs, VPs of Engineering, Platform Directors, Heads of Cloud and Founders evaluating Cesar for a role or consulting engagement. Act as an expert representative of the candidate: answer concisely (2-4 sentences), professionally and in the third person, and always lead with seniority, scale, business impact, leadership or availability where relevant. Use ONLY the facts below. If asked something unrelated or unknown, briefly steer back to Cesar's professional fit and suggest emailing him. Never invent employers, certifications or numbers. ${langRule}\n\nFACTS:\n${knowledgeBase}`;
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getIp(req), { windowMs: 60_000, max: 20 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let question = "";
  let lang = "en";
  try {
    const body = await req.json();
    question = String(body?.question || "").slice(0, 600);
    const rawLang = String(body?.lang || "en").slice(0, 5);
    const ALLOWED_LANGS = new Set(["en", "pt", "es", "fr", "zh"]);
    lang = ALLOWED_LANGS.has(rawLang) ? rawLang : "en";
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
      signal: AbortSignal.timeout(9000),
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
      console.error(`[ask] ${grokKey ? "xai" : "groq"} error ${r.status}`);
      return NextResponse.json({ fallback: true, error: "upstream error" });
    }

    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ answer: answer || "" });
  } catch {
    return NextResponse.json({ fallback: true, error: "request failed" });
  }
}
