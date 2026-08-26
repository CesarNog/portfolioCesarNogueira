import { siteConfig, stats, experience, certifications, projects, capabilities } from "@/lib/site-config";

/**
 * Single source of truth for every machine-readable surface that describes
 * César — the MCP `get_resume`/`list_case_studies`/`check_availability`
 * tools (app/api/mcp/route.ts) and the plain-HTTP fallbacks
 * (/api/resume.json, /api/resume.txt) all call these, so a fact only ever
 * lives in lib/site-config.ts and gets reshaped here, never duplicated.
 */

export function buildResume() {
  return {
    name: siteConfig.name,
    role: siteConfig.role,
    tagline: siteConfig.tagline,
    location: siteConfig.location,
    company: siteConfig.company,
    stats: stats.map((s) => ({ label: s.label, value: `${"prefix" in s ? s.prefix : ""}${s.value}${s.suffix}` })),
    experience: experience.map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      outcome: e.outcome,
    })),
    certifications: certifications.flatMap((c) => c.items.map((it) => it.name)),
    capabilities: capabilities.map((c) => ({ area: c.area, level: c.level })),
    cv: siteConfig.links.cv,
    contact: siteConfig.links.email,
  };
}

export function buildCaseStudies() {
  return projects.map((p) => ({
    title: p.title,
    client: p.client,
    problem: p.problem,
    architecture: p.architecture,
    tech: p.tech,
    outcome: p.outcome,
    metric: `${p.metric} ${p.metricLabel}`,
    url: `${siteConfig.url}/case-studies/${p.id}`,
  }));
}

export function buildAvailability() {
  return {
    availability: siteConfig.availability,
    location: siteConfig.location,
    responseTime: siteConfig.responseTime,
    contact: siteConfig.links.email,
  };
}

/** Terminal-styled plain-text resume for /api/resume.txt — same facts as
 * buildResume()/buildCaseStudies(), formatted for a human or agent reading
 * raw text rather than parsing JSON. ANSI color codes match the green/blue
 * "proof" convention agent-facing terminal resumes commonly use; a plain
 * client just shows the escape codes as harmless noise around real text. */
export function buildResumeText(): string {
  const resume = buildResume();
  const cases = buildCaseStudies();
  const GREEN = "\x1b[32m";
  const BOLD = "\x1b[1m";
  const DIM = "\x1b[2m";
  const RESET = "\x1b[0m";

  const lines: string[] = [];
  lines.push(`${GREEN}${BOLD}cesarnogueira.tech${RESET} ${DIM}// plain-text resume${RESET}`);
  lines.push("");
  lines.push(`${BOLD}${resume.name}${RESET} — ${resume.role}`);
  lines.push(resume.location);
  lines.push("");
  lines.push(`${GREEN}stats${RESET}`);
  for (const s of resume.stats) lines.push(`  ${s.value.padEnd(6)} ${s.label}`);
  lines.push("");
  lines.push(`${GREEN}experience${RESET}`);
  for (const e of resume.experience) {
    lines.push(`  ${e.period.padEnd(22)} ${e.role} — ${e.company}`);
    lines.push(`  ${" ".repeat(22)} ${e.outcome}`);
  }
  lines.push("");
  lines.push(`${GREEN}certifications${RESET}`);
  for (const c of resume.certifications) lines.push(`  ${c}`);
  lines.push("");
  lines.push(`${GREEN}case studies${RESET}`);
  for (const c of cases) lines.push(`  ${c.metric.padEnd(10)} ${c.title} (${c.url})`);
  lines.push("");
  lines.push(`${GREEN}hire${RESET}`);
  lines.push(`  linkedin  ${siteConfig.links.linkedin}`);
  lines.push(`  cv        ${resume.cv}`);
  lines.push(`  json      GET  /api/resume.json`);
  lines.push(`  mcp       POST /api/mcp   (initialize · tools/list · tools/call)`);
  lines.push(`  contact   ${resume.contact}`);
  lines.push("");
  lines.push(`${DIM}agents welcome — this server speaks MCP.${RESET}`);
  lines.push("");
  return lines.join("\n");
}
