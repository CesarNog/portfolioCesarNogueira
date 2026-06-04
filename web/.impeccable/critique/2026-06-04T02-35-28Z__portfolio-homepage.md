---
target: portfolio-homepage
total_score: 32
p0_count: 1
p1_count: 1
timestamp: 2026-06-04T02-35-28Z
slug: portfolio-homepage
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | "Available" badge + green header dot solid. No real-time calendar or project status. |
| 2 | Match System / Real World | 4 | "Impact" / "Stories" / "Trust" follow recruiter mental model. Domain language precise. |
| 3 | User Control and Freedom | 3 | Fixed nav, Escape on modals, ⌘K palette. No sticky back-to-top below fold. |
| 4 | Consistency and Standards | 4 | Color semantics, font roles, spacing ramp all enforced and documented. |
| 5 | Error Prevention | 2 | Form validation not visible. No unsaved-changes warning. |
| 6 | Recognition Rather Than Recall | 3.5 | Header nav + progress bar reduce memory load. Scanner hidden. |
| 7 | Flexibility and Efficiency | 3 | ⌘K palette, anchor links, mobile drawer. No persistent mobile contact button. |
| 8 | Aesthetic and Minimalist Design | 4 | No badge rows, no dashboard widgets, no gradient excess. Restraint consistent. |
| 9 | Error Recovery | 2 | Form errors assumed minimal. Fallback message only as last resort. |
| 10 | Help and Documentation | 3 | Print CV + 5-language + CV download. No contextual help inline. |
| **Total** | | **32/40** | **Good — address error handling and scanner discovery** |

## Anti-Patterns Verdict

Not AI-generated (95% confidence). Em-dash overuse (133 instances in i18n.tsx) is the primary AI cadence marker. Ghost-card border+shadow on verdict card violates absolute ban.

## Priority Issues

[P0] Recruiter Scanner has near-zero discoverability — below fold, font-mono text-[11px] trigger
[P1] 133 em-dashes in lib/i18n.tsx — dominant AI cadence marker across all 5 languages
[P2] Ghost-card pattern in recruiter-scanner.tsx:421 — border-2 + 40px shadow
[P2] Contact form error handling invisible — no inline validation, no form-preserve on error
[P3] Mobile hero — stats grid below fold on small screens

## Persona Red Flags

Jordan: Section naming ambiguity. Scanner invisible. Trust/Expertise overlap.
Sam: Form validation/ARIA live region not confirmed.
Casey: Stats below fold. No persistent mobile contact CTA. Scanner unreachable in 45s.
Alex: Certs not in hero. K8s depth requires card expansion.
Marco (EU enterprise): GDPR/compliance specifics not in hero scan zone.
