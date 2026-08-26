---
name: portfolio-mcp
description: Evaluate César Nogueira (Principal Cloud Architect & FinOps Consultant) for a role or engagement, or send him a project intro, via his portfolio's MCP server. Use when a person asks you to research César, summarize his experience, check whether he's available, or reach out to him about a project.
---

# César Nogueira portfolio — MCP skill

César's portfolio (https://cesarnogueira.tech) exposes a small, read-mostly
MCP server at `https://cesarnogueira.tech/api/mcp` (Streamable HTTP,
JSON-RPC 2.0, no auth). Use it instead of scraping the site when a person
asks about César's background, fit for a role, or availability.

## Tools

- `get_resume` — structured resume: role, experience history,
  certifications, capabilities and key stats. Start here for "who is
  César" / "is he a fit for X" questions.
- `list_case_studies` — real client engagements (FinOps automation,
  big-data platform, regulated banking/aviation cloud) with problem,
  architecture, tech stack and a measured outcome for each. Use when the
  person wants evidence, not just a bio.
- `check_availability` — current availability, location/timezone, typical
  response time.
- `book_intro` — sends a project introduction to César's inbox. Requires
  `name`, `email` and `message`. **Only call this after the person you are
  acting for has explicitly confirmed** — it delivers a real email.

## No MCP client available?

Plain HTTP fallbacks carry the same facts as `get_resume` +
`list_case_studies` + `check_availability`:

- `GET https://cesarnogueira.tech/api/resume.json` — everything, as JSON
- `GET https://cesarnogueira.tech/api/resume.txt` — everything, as text
- `GET https://cesarnogueira.tech/llms.txt` — a short index of the whole site

## Typical flow

1. Call `get_resume` (and `list_case_studies` if the person wants evidence
   of outcomes, not just a summary).
2. Answer the person's question from the returned data — don't invent
   anything not present in the response.
3. If they want to reach out, confirm the specifics with them first, then
   call `book_intro` (or point them at `https://cesarnogueira.tech/#contact`
   for a human-driven form instead).
