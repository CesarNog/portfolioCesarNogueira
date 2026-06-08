---
name: César A. Nogueira Portfolio
description: Principal Cloud Architect and FinOps specialist portfolio — earned, precise, international.
colors:
  # Dark theme (default) — normative values
  surface-void: "#08090c"
  surface-base: "#0e1014"
  surface-raised: "#16191f"
  surface-overlay: "#20242c"
  ink-primary: "#edf0f3"
  ink-secondary: "#97a1ad"
  ink-tertiary: "#788490"
  # Light ink-tertiary updated 2026-06-08: was #697785 (4.27:1 on surface-base-light — WCAG fail), now #616e7b (4.87:1 ✓)
  accent-blue: "#3b82f6"
  accent-cyan: "#22b8c4"
  accent-orange: "#f59e5b"
  accent-green: "#34d399"
  hairline: "rgba(255,255,255,0.07)"
  hairline-strong: "rgba(255,255,255,0.13)"
  # Light theme overrides
  surface-void-light: "#ffffff"
  surface-base-light: "#f6f8fa"
  surface-raised-light: "#eef1f5"
  ink-primary-light: "#0b1118"
  ink-secondary-light: "#4a5663"
  ink-tertiary-light: "#616e7b"
  accent-blue-light: "#1f6fe0"
  accent-cyan-light: "#0e9aa3"
  accent-orange-light: "#e0641b"
typography:
  display:
    fontFamily: "Inter Tight, Geist, sans-serif"
    fontSize: "clamp(3.5rem, 5vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Tight, Geist, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "-0.011em"
  label:
    fontFamily: "Geist Mono, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.18em"
  ui:
    fontFamily: "Hanken Grotesk, Geist, ui-sans-serif, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
rounded:
  none: "0px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-scanner:
    backgroundColor: "rgba(52,211,153,0.05)"
    textColor: "{colors.accent-green}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-panel:
    backgroundColor: "{colors.surface-base}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "28px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  chip-tech:
    backgroundColor: "transparent"
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  chip-role:
    backgroundColor: "rgba(52,211,153,0.08)"
    textColor: "{colors.accent-green}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: César A. Nogueira Portfolio

## 1. Overview

**Creative North Star: "The Field Report"**

This is a briefing document, not a portfolio. The visual system serves someone who has been in production at 3am and knows exactly what a system costs when it fails. Every design decision defers to evidence: specific numbers, named clients, concrete outcomes. Nothing decorates what can instead inform.

The aesthetic comes from technical artifacts — incident reports, architecture decision records, cloud billing dashboards — translated into a premium dark surface. The tension between the precision of monospace labels and the editorial weight of Inter Tight headlines is intentional: engineer by training, communicator by necessity. The dark near-void background is not a trend; it is the operating environment where this work happens.

This system explicitly rejects: SaaS landing-page templates (Webflow, Framer AI, v0-generated); AI portfolio syndrome (symmetric card grids, gradient badges, dashboard-widget credibility signals, fake terminal boot sequences); generic consultant sites with buzzword headlines; over-designed portfolios that put the tool before the person.

**Key Characteristics:**
- Dark-first, two-theme (dark default, light toggle)
- Four fonts, four roles: display (Inter Tight), body (Geist), mono (Geist Mono), UI/nav (Hanken Grotesk)
- Three accent colors with distinct semantic roles: blue (action/architecture), cyan (platform/data), orange (FinOps/cost)
- Green reserved exclusively for availability signals and positive verdicts
- Hairline borders at 7% opacity — structure without noise
- Motion: precise, decelerated, reduced-motion-aware throughout

## 2. Colors: The Mission-Control Palette

Three accent colors with distinct domain roles, deployed deliberately against a near-void dark surface. Color appears only when it carries information.

### Primary
- **Cloud Blue** (#3b82f6 / #1f6fe0 light): The architecture accent. Used for primary CTAs, active navigation states, link hovers, and GCP/cloud-architecture domain signals. The single most trusted color in the system.
- **Availability Green** (#34d399): Reserved exclusively for "available now" signals, positive verdicts ("Proceed to Interview", "Strong Match"), and status indicators. Never used for decoration.

### Secondary
- **Infrastructure Cyan** (#22b8c4 / #0e9aa3 light): Platform engineering, DevOps, and data domain. Used for secondary accents, Kubernetes/platform capability signals, and "interview" decision verdicts.

### Tertiary
- **FinOps Orange** (#f59e5b / #e0641b light): Cost data, FinOps domain signals, and considerations/warnings. Appears on the FinOps capability card, spending metrics, and "risk consideration" states in the hiring scanner.

### Neutral
- **Void** (#08090c): Page background. So dark it reads as environment, not surface.
- **Base** (#0e1014): Card and panel background. 1 step up from void.
- **Raised** (#16191f): Elevated interactive surfaces, input backgrounds.
- **Overlay** (#20242c): Highest-elevation interactive states.
- **Ink Primary** (#edf0f3): Body text and headings. Near-white, not pure white — reduces harshness.
- **Ink Secondary** (#97a1ad): Supporting text, meta information.
- **Ink Tertiary** (#788490 dark / #616e7b light): Labels, hints, placeholder text. Dark 5.22:1 on Base ✓; light #616e7b 4.87:1 on surface-base-light ✓. Do not revert to #697785 — it fails 4.5:1 on tinted light surfaces.
- **Hairline** (rgba(255,255,255,0.07)): Dividers, card borders. Structural without competing with content.

### Named Rules

**The Domain-Color Rule.** Each accent maps to one technical domain: blue for cloud architecture, cyan for platform engineering and data, orange for FinOps and cost. Mixing domains through their colors signals expertise where it belongs. Never use all three on the same element.

**The Green Reservation Rule.** Availability green (#34d399) is the rarest color in the system. It appears only when the system is making a positive declaration: "available now", "proceed to interview", "strong match", "low risk". The moment it appears on decorative elements, it loses the authority that makes it credible.

## 3. Typography

**Display Font:** Inter Tight (with Geist, sans-serif fallback)
**Body Font:** Geist (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (with SFMono-Regular, monospace)
**UI Font:** Hanken Grotesk (nav, footer, metadata — with Geist fallback)

**Character:** Inter Tight at -0.02em tracking provides the editorial authority of a condensed grotesque without the geometric coldness of Space Grotesk. Geist carries the body at 17px with generous 1.85 leading — long-form readable, not dashboard-dense. Geist Mono handles all data labels: timestamps, scores, identifiers, uppercase metadata. Hanken Grotesk in the header nav and footer holds the brand identity outside the editorial frame.

### Hierarchy
- **Display** (700, clamp(3.5rem, 5vw, 5.5rem), leading-[0.9], -0.02em): Hero name only. One instance per page. Tracked tight, stacked two lines.
- **Headline** (600, clamp(1.875rem, 4vw, 3.75rem), 1.1, -0.04em): Section headings (h2). Text-wrap: balance. Max width 3xl.
- **Title** (500, 1.125rem–1.25rem, 1.4): Card headings, experience company names, form titles.
- **Body** (400, 17px, 1.85, -0.011em): All prose content. Max 2xl wide (65ch). Text-wrap: pretty on paragraphs.
- **Label** (400, 11px, 1.4, 0.18em, UPPERCASE): Mono labels — section eyebrows, data keys, cert counts, status strings. All uppercase reserved for labels of 4 words or fewer.

### Named Rules

**The Mono-Label Rule.** Monospace is not "technical atmosphere." Every mono element carries a specific data class: a timestamp, a score, a category key, a terminal command, a status string. Decorative mono — mono text used for atmosphere without data meaning — is prohibited.

**The Four-Family Ceiling.** Inter Tight (display) + Geist (body) + Geist Mono (data) + Hanken Grotesk (UI nav) is the full font budget. No new families. If a design decision requires a fifth font, it requires a removal instead.

## 4. Elevation

This system is flat by default and tonal by architecture. The surface ramp (void → base → raised → overlay) communicates depth through color alone — no shadows on resting surfaces. Shadows appear only as responsive glow states under accent elements, and only when they communicate meaning (not depth).

The sole exception is the scanner overlay: `box-shadow: 0 0 40px -12px color-mix(in oklab, var(--color-ok) 30%, transparent)` — the green glow on the "Proceed to Interview" verdict card. This shadow exists because it communicates the positive verdict, not because the card needs visual depth.

### Shadow Vocabulary

- **Accent glow** (`0 0 24px -6px var(--color-blue)`): Hover state on primary CTA buttons and the "Hiring Assistant" floating button when active. Signals interactivity.
- **Verdict glow** (`0 0 40px -12px color-mix(in oklab, var(--color-ok) 30%, transparent)`): The green glow on the "Proceed to Interview" card in the recruiter scanner. Reserved for this one component.
- **Panel shadow** (`0 0 0 1px var(--color-hairline), 0 0 32px -16px var(--color-blue) 38%`): The `.glow` utility class on highlighted panels in Recruiter Mode.

### Named Rules

**The Flat-by-Default Rule.** Every surface is flat at rest. The moment a shadow appears on a card just to look elevated, the system breaks. Shadows are semantic signals, not decoration. If a design choice requires a shadow, ask what state it communicates first.

## 5. Components

### Buttons

Tactile and decisive. Buttons press cleanly with scale feedback. No gradients, no radius excess, no ghost-card border+shadow combinations.

- **Shape:** 6px radius (md) — gently curved, not pill, not squared
- **Primary** (blue fill, white text, 12px 24px padding): All primary CTAs. Uses `bg-accent accent-blue` utility. Hover: `opacity: 0.9` — simple, no color shift.
- **Ghost** (transparent, ink-primary text, 1px hairline-strong border): Secondary CTAs alongside a primary. "See the work", "Download CV". Hover: border brightens to fg-muted.
- **Scanner trigger** (green/5 bg, green text, green border at 40% opacity): Exclusively the "Evaluate Cesar" button. Pulse ring on idle. The only green button in the system.
- **Hiring Assistant** (blue fill when active, hairline border + blue glow when idle): Floating bottom-left. Full-pill radius (9999px). Animates in from left on load.
- **Focus:** `outline: 2px solid var(--color-blue); outline-offset: 2px; border-radius: 2px` — WCAG 2.2 compliant on all interactive elements.

### Cards / Containers

- **Corner style:** 8–12px radius (rounded-lg for panels, rounded-xl for certification and report cards)
- **Background:** surface-base (#0e1014) with 1px hairline border
- **Shadow strategy:** Flat at rest. `.glow` utility adds accent glow only when a card is highlighted in Recruiter Mode
- **Border:** 1px hairline (rgba(255,255,255,0.07)) — all cards. 1px hairline-strong on hover/active states
- **Internal padding:** 28px (p-7) standard; 20px (p-5) for compact scanner cards; 16px (p-4) for data-dense sections

**Nested cards are prohibited.** `.panel` inside `.panel` never. The `panel-2` variant (surface-raised background) exists for content containers inside a panel — it reads as "inside the card", not "a card on a card."

**Inline callout / lesson block:** when a section of content needs to stand out without a side-stripe accent, use `rounded border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 px-4 py-3`. Full border at 20% opacity + subtle blue tint. Never `border-l-2` or `border-r-2` — those are banned regardless of intent.

### Inputs / Fields

- **Style:** transparent background, 1px hairline border, 8px radius
- **Focus:** border shifts to accent-blue + `ring-1 ring-blue/20` glow — visible without being theatrical
- **Placeholder text:** ink-tertiary (#788490) — WCAG AA verified
- **Disabled:** opacity-50, pointer-events: none

### Navigation

- **Font:** Hanken Grotesk, 13px, 500 weight — distinct from the Inter Tight/Geist body system
- **Desktop:** centered nav links (13px, 500), active state at full ink-primary, resting at ink-subtle
- **Separator:** 1px hairline between logo zone and nav links
- **Right zone:** AVAILABLE pill (green), search ⌘K icon, language dropdown (PT ▾), theme toggle
- **Available pill i18n:** static visible part = `t.hero.available.split(" ")[0]`; hover-expanded part = rest of string after first space. ZH has no space, so full text shows statically and the hover expansion is empty — works without special casing.
- **Scroll indicator:** blue `scaleX` progress bar at bottom of header, springs with scroll
- **Mobile:** right-drawer at 288px, slides in from right with spring easing

### Chips / Tags

Two types — tech tags and role chips:

- **Tech tags** (transparent bg, ink-tertiary text, 1px hairline border, 0px radius, 2px 8px padding, Geist Mono 11px): Stack names, certification labels. No rounding — reads as code, not badge.
- **Role chips** (green/8 bg, green text, green border at 25% opacity, pill radius): "Cloud Architect", "FinOps Engineer" role fit signals. Exclusively in the hiring scanner report.
- **Capability level chips** (accent-color/15 bg, accent text, 0px radius, Geist Mono 10px uppercase): "Principal", "Expert", "Specialist" — in the capability matrix section.

### Hiring Scanner (Signature Component)

The recruiter scanner is the most complex surface in the system. Full-screen overlay, three phases, plain div rendering (no AnimatePresence on conditional sections — React 18 concurrent mode requirement).

- **Overlay:** `position: fixed; inset: 0; z-index: 200; background: surface-void` — must not be wrapped in any ancestor with CSS `filter`, `transform`, or `perspective` (creates a new containing block for fixed positioning)
- **Top bar:** 14px Geist overlay, hairline border-b, live status label updates per phase
- **Scanner beam:** m.div with `top: 0 → 100vh` animation, blue/green gradient, 16px glow shadow
- **Skill bars:** m.div `width: 0 → score%`, 0.85s ease-out, shimmer sweep keyframe on completion
- **Verdict card:** `border-2 border-green/40`, `box-shadow: 0 0 40px -12px green/30`, centered text, 4xl–5xl "Proceed to Interview"

### Chatbot / Hiring Assistant

The floating AI career assistant. Full-pill launcher mounts at bottom-right with a green status dot, expands into a 400px panel.

- **Launcher:** full-pill border, `border-hairline-strong`, `surface-1` background. Status dot pulses green (`status-dot` class). `whileHover` scale 1.04, `whileTap` 0.95. Slides up on mount (0.55s, delay 0.5s, `EASE.spring`).
- **Panel:** `transformOrigin: bottom-right` — scale entrance from 0.92 to 1 so it physically expands from the button. 400px wide, `h-[76vh] max-h-[min(640px,calc(100dvh-144px))]` — the dvh cap prevents the panel from overlapping the fixed header on small viewports (≤568px). `rounded-xl` (16px).
- **Focus trap:** Tab key cycles inside the dialog when open. `dialogRef` queries `'button:not([disabled]), input:not([disabled]), a[href]'` and wraps at boundaries. ESC closes.
- **API resilience:** fetch uses `AbortSignal.timeout(12000)`. 429 response shows `t.assistant.rateLimit` (localized in all 5 languages). All error paths use `t.*` — no hardcoded English strings.
- **Aria:** launcher `aria-label` uses `t.assistant.launch` / `t.assistant.close`. Dialog `aria-label` uses `t.assistant.header`. All localized.
- **Messages:** user messages right-aligned, slide in from right (`x: 16 → 0`). Assistant messages left-aligned, slide from left (`x: -16 → 0`). 280ms, `EASE.spring`.
- **Greeting:** slides from left on panel open, `delay: 0.12s`.
- **Suggested prompts:** stagger in `y: 8 → 0`, `delay: 0.2 + i * 0.07`. Each chip has `whileTap` scale 0.97.
- **Follow-up chips:** stagger from left after assistant reply, `x: -10 → 0`, `delay: 0.22 + i * 0.06`.
- **Thinking indicator:** `AnimatePresence` exit slide. Header icon breathes (opacity `[1, 0.45, 1]` loop) while loading.
- **Thinking dots:** `bg-[blue]/70`, vertical wave `y: [0, -4, 0]` + opacity `[0.35, 1, 0.35]`, staggered per dot (0.18s apart).
- **Input focus:** `focus:ring-2 focus:ring-[blue]/15` glow ring on focus.
- **Inline callout block (projects lessons):** `rounded border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 px-4 py-3`. Full border at 20% opacity. Never `border-l-2` or `border-r-2`.

## 6. Do's and Don'ts

### Do:
- **Do** use Inter Tight for all display headings at -0.02em tracking minimum. Tighter than -0.04em and letters touch.
- **Do** use monospace (Geist Mono) only for data-class content: scores, timestamps, status labels, terminal commands, identifiers.
- **Do** deploy the three accents by domain: blue for architecture/action, cyan for platform/data, orange for FinOps/cost. Each domain gets one color.
- **Do** reserve availability green (#34d399) for exactly two contexts: the "Available" status signal and positive hiring verdicts. Nothing else.
- **Do** use `text-wrap: balance` on all h2 section headings and `text-wrap: pretty` on prose paragraphs.
- **Do** keep body text at ink-secondary (#97a1ad) against surface-base (#0e1014) — verified 5.22:1 for tertiary text.
- **Do** wrap `position: fixed` overlays (command palette, scanner, hiring panel) in plain `<div>` containers with no CSS `filter`, `transform`, or `perspective` on ancestors.
- **Do** use the motion system: EASE.spring [0.22,1,0.36,1] for entrances, EASE.out [0.16,1,0.3,1] for reveals. Every animation needs a `prefers-reduced-motion` fallback.
- **Do** keep card radius at 8–12px. Tags and status pills use full-pill (9999px). Nothing in between.
- **Do** ship all 5 language variants (EN, PT, ES, FR, ZH) before merging any new interactive feature. Partial translations break the experience for non-English visitors and undermine the multilingual credibility signal.
- **Do** name clients and outcomes. "AndBank, Santander, LATAM Airlines" beats "major enterprise clients". Specificity is the brand.
- **Do** pad all icon-only interactive elements (footer social links, small action buttons) to minimum 24×24px touch target per WCAG 2.2 SC 2.5.8. Use `p-2` on the anchor to reach 34×34px.

### Don't:
- **Don't** use SaaS landing-page templates: symmetric card grids, gradient badges, dashboard-widget credibility signals, fake terminal boot sequences. The PRODUCT.md explicitly prohibits all of these.
- **Don't** use gradient text (`background-clip: text`). Single solid color for all text, always.
- **Don't** use `border-left` or `border-right` greater than 1px as colored accent stripes on cards or callouts. Full borders, background tints, or nothing.
- **Don't** pair `border: 1px solid` with `box-shadow` with blur > 8px on the same element (ghost-card pattern). Pick one.
- **Don't** add a fifth font family. The four-family budget is fixed.
- **Don't** use border-radius above 16px on cards or containers. 16px is the ceiling; above that reads as AI-generated rounding excess.
- **Don't** use green for anything except availability status and positive verdicts. Not hover states, not decorative accents, not secondary buttons.
- **Don't** write "enterprise-grade", "world-class", "cutting-edge", "seamless", "mission-critical", "next-generation", or any other buzzword. Nouns and verbs that describe what was actually built.
- **Don't** use em dashes. Commas, colons, semicolons, periods, or parentheses instead.
- **Don't** wrap `position: fixed` overlays in motion/react `m.div` elements that animate `filter` or `blur`. CSS filter on any ancestor creates a new containing block, trapping the fixed overlay inside the element's bounding box.
- **Don't** put an eyebrow label (small all-caps tracked text) above every section heading. The section component uses `noEyebrow` prop on most sections — the eyebrow appears only when the label adds information the heading doesn't.
- **Don't** use AI slop copy: "productivity theater", "actually X", "not just X, it's Y". Specific noun + verb, always.
- **Don't** animate opacity to 0 on components that conditionally render based on state in React 18 concurrent mode. Initial opacity:0 on phase-conditional divs causes the animate callback to never fire. Conditional rendering = instantly visible; motion enhances, never gates visibility.
- **Don't** hardcode user-visible strings. Every label, badge, button, tooltip, or status text must go through the i18n `Dict` (`t.*`). Hardcoded English strings are invisible to non-English visitors.
