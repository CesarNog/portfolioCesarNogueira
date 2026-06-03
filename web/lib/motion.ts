/**
 * Centralized motion system — Vercel/Linear/Datadog reference aesthetic.
 * All durations in ms-equivalent seconds. All easings are cubic-bezier.
 * Import from here, not one-off inline variants.
 */

export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  spring: [0.22, 1, 0.36, 1] as const,
} as const;

export const DUR = {
  micro: 0.12,  // hover state change
  fast: 0.22,   // button press, badge
  reveal: 0.55, // section element entrance
  section: 0.75, // full section reveal
  route: 0.95,  // line draw, path animation
} as const;

/** Stagger offset between children (seconds). */
export const STAGGER = 0.08;

// ─── Variants ─────────────────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.reveal, delay, ease: EASE.out },
  }),
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: DUR.reveal, delay, ease: EASE.out },
  }),
} as const;

export const slideIn = {
  hidden: { opacity: 0, x: -12 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: DUR.reveal, delay, ease: EASE.spring },
  }),
} as const;

/** Container that staggers its children. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.1 },
  },
} as const;

/** Card hover — subtle lift + border brighten. Applied via whileHover. */
export const cardHover = {
  y: -2,
  transition: { duration: DUR.micro, ease: EASE.out },
} as const;

/** Button press feedback. Applied via whileTap. */
export const buttonPress = {
  scale: 0.97,
  transition: { duration: DUR.micro, ease: EASE.in },
} as const;

/** Node pulse ring. Applied via animate with infinite repeat. */
export const nodePulse = {
  initial: { scale: 0.5, opacity: 0.8 },
  animate: { scale: 2.5, opacity: 0 },
  transition: { duration: 2.4, repeat: Infinity, ease: "easeOut" as const },
} as const;
