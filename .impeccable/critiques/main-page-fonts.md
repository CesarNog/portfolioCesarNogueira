---
slug: main-page-fonts
target: main page — font stack
date: 2026-06-07
score: 7
p0: 0
p1: 0
p2: 3
p3: 1
---

# Critique: main-page-fonts

**Target:** main page — font stack audit (AI slop test, brand register, detector)
**Date:** 2026-06-07
**Overall:** 7 / 10

## Font Stack

| Token | Family | Next/Google ID | Role | Status |
|---|---|---|---|---|
| `--font-inter-tight` | Inter Tight | `Inter_Tight` | Display headings | ⚠ parent on reflex-reject list |
| `--font-geist` | Geist | `Geist` | Body copy | ⚠ Vercel portfolio fingerprint |
| `--font-geist-mono` | Geist Mono | `Geist_Mono` | Data labels / code | ✓ acceptable, low risk |
| `--font-hanken` | Hanken Grotesk | `Hanken_Grotesk` | UI / nav | ✓ strongest, most distinctive |

## Heuristic Scores

| # | Heuristic | Score | Note |
|---|---|---|---|
| 1 | First impression | 8 | Dark, restrained, not loud |
| 2 | Visual hierarchy | 8 | Scale + weight contrast clear |
| 3 | **Typography** | 6 | Well-applied but stack is saturated |
| 4 | Color & contrast | 8 | Tokens solid, dark surface |
| 5 | Spacing & layout | 8 | Tight where it should be |
| 6 | Motion | 9 | Spring-based, stagger correct |
| 7 | **Copy** | 6 | Em-dash in meta template (detector) |
| 8 | **Brand alignment** | 6 | Stack diverges from "Precise. Earned. International." identity at the second-order level |
| 9 | Accessibility | 8 | swap display, reduced-motion respected |
| 10 | Responsive | 8 | clamp ranges within spec |

## Findings

### P2 — Font stack: second-order AI reflex (identity risk)

Inter Tight + Geist + Geist Mono on a Vercel-deployed Next.js portfolio is the **signature font stack of AI-generated Vercel portfolios circa 2025-2026**. No individual font is wrong on its own, but the gestalt answers the second-order check: "Vercel-hosted tech portfolio → uses Inter Tight + Geist + Geist Mono" is a correct guess. Primary users (senior tech recruiters calibrated to detect AI portfolios) may register this without naming it.

**Mitigating factors:**
- Inter Tight (condensed) ≠ plain Inter — more distinctive at display sizes with -0.025em / fw700
- Geist is contextually appropriate (Vercel's own font on a Vercel deployment)
- Hanken Grotesk provides genuine contrast
- Identity-preservation rule applies — already committed and working

**Severity:** Notable but not blocking. The execution is above-average even if the ingredients are common.

---

### P2 — Inter Tight: parent font on reflex-reject list

`app/layout.tsx:14` — `Inter_Tight` loaded from `next/font/google`.

Brand register (`reference/brand.md`) lists **Inter** as a reflex-reject font ("training-data defaults"). Inter Tight is a condensed variant of the same family. The distinction is real at display weight; the risk is lower than plain Inter. Identity-preservation applies. Not a forced change — a named acknowledgement.

---

### P2 — Em-dash in meta title template (detector finding)

`app/layout.tsx:23`:
```ts
template: `%s — ${siteConfig.name}`,
```

Em-dash appears in every inner-page `<title>` tag and Twitter card metadata. Brand rule: **no em dashes**. Replace with `·` or ` | ` or ` / `.

```diff
- template: `%s — ${siteConfig.name}`,
+ template: `%s · ${siteConfig.name}`,
```

---

### P3 — Geist Mono: new default for "Vercel technical portfolio"

Low risk. IBM Plex Mono and Space Mono were the previous saturated choices; Geist Mono has displaced them in the post-2024 Vercel template ecosystem. For data labels and code spans it's functional and not banned. Worth knowing; not worth changing.

---

### ✓ Hanken Grotesk: correct call, keep

The strongest decision in the stack. Humanist sans pairs on contrast axis with geometric Geist (humanist vs geometric). Not on reflex-reject list. Low saturation in tech portfolios. Distinctive. Reinforces "Precise. Earned. International." better than the other three.

## Verdict

Stack works. Execution is above average. The identity risk is real at the second-order level but identity-preservation wins for committed choices. If the risk ever warrants action, the lever is Geist (body) — the most replaceable piece without structural disruption. Hanken Grotesk is the model; the others should aspire to its level of deliberateness.

## Recommended Next

- **Quick win:** Fix em-dash → `·` in layout.tsx (5-minute change, zero risk)
- **If identity risk warrants action:** `/impeccable typeset main page` — swap Geist (body) for something less Vercel-template-adjacent (e.g. DM Sans, Plus Jakarta Sans, Outfit). Structural; plan carefully.
- **Otherwise:** move to `.impeccable/design.json` sidecar update (stale since 2026-06-04)
