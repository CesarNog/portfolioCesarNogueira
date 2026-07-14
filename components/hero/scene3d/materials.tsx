import * as THREE from "three";

// The Domain-Color Rule (DESIGN.md): blue = cloud architecture, cyan =
// platform engineering/DevOps/data, orange = FinOps/cost. The 3D assembly
// encodes this directly in its own geometry (see blocks-data.ts), not only in
// the 2D DOM icon overlay layered on top in intro-sequence.tsx. Architecture
// (blue) stays the dominant/majority domain — it's the chassis's "home" color
// and the core's color — cyan and orange appear only on a minority of accent
// strips, so the scene reads as one system with three legible specialities,
// not a rainbow.
//
// The scene has TWO deliberate material identities, one per theme, not one
// look that merely survives on both backgrounds:
//   • dark  — glowing modules in a data-center void: near-black metal chassis,
//             bright emissive accent strips, blue rim light, generous bloom.
//   • light — a crisp isometric architecture diagram on paper: light cool-grey
//             module tiles, saturated (not neon) painted indicator strips,
//             even ambient fill, restrained bloom. On white, the dark-void
//             recipe reads as heavy black bricks; this one reads as intentional
//             light-mode hardware.
// Both use the site's own accents (--color-blue/cyan/orange in globals.css) at
// each theme's value — kept as plain hex since three.js materials don't read
// CSS custom properties.

export type Theme = "light" | "dark";

export const ACCENT_BLUE = "#3b82f6";
export const ACCENT_CYAN = "#22b8c4";
export const ACCENT_ORANGE = "#f59e5b";

export type Domain = "blue" | "cyan" | "orange";

// Bright, glow-forward accents for the dark void.
const DOMAIN_COLOR_DARK: Record<Domain, string> = {
  blue: ACCENT_BLUE,
  cyan: ACCENT_CYAN,
  orange: ACCENT_ORANGE,
};
// The site's own light-mode accents — saturated enough to read as painted
// indicators on white without the neon glare the dark hexes get there.
const DOMAIN_COLOR_LIGHT: Record<Domain, string> = {
  blue: "#1f6fe0",
  cyan: "#0e9aa3",
  orange: "#e0641b",
};

export function domainColor(domain: Domain, theme: Theme = "dark"): string {
  return (theme === "light" ? DOMAIN_COLOR_LIGHT : DOMAIN_COLOR_DARK)[domain];
}

// Chassis stays a single neutral shell regardless of domain — the module's
// "body" is quiet by design; only its accent strip declares which domain it
// belongs to. Dark: near-black metal for the void (nudged one step up from
// pure void-black so a scattered, unlit block still has a sliver of presence
// against the near-black background at rest — see SCENE.restOpacity below).
// Light: a mid cool-grey tile that has real presence on white (darker than
// the page's surface-1) and reads as matte hardware, not a shiny black slab.
export function chassisMaterial(theme: Theme) {
  return theme === "light"
    ? new THREE.MeshStandardMaterial({ color: "#c2ccd8", metalness: 0.15, roughness: 0.62 })
    : new THREE.MeshStandardMaterial({ color: "#131b28", metalness: 0.6, roughness: 0.35 });
}

// The accent strip doesn't float on the chassis face as a flat decal — it
// sits inset in a recessed bezel, like a real panel-mounted status light.
// The bezel is a single shared material (it's domain-neutral, unlike the
// strip) sitting just behind the strip and slightly larger, so its edges
// read as a shadowed frame. This is the one "sharpen the detail" addition:
// it costs one extra mesh per block but is what makes the strip read as a
// mounted indicator rather than a sticker.
export function bezelMaterial(theme: Theme) {
  return theme === "light"
    ? new THREE.MeshStandardMaterial({ color: "#8b96a6", metalness: 0.1, roughness: 0.55 })
    : new THREE.MeshStandardMaterial({ color: "#05070c", metalness: 0.1, roughness: 0.85 });
}

export function accentMaterial(domain: Domain, theme: Theme) {
  const color = domainColor(domain, theme);
  // Lower emissive in light: on white the strip should read as a painted
  // indicator, not a glare; in the dark void it's a light coming online.
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: theme === "light" ? 0.55 : 1.05,
    metalness: theme === "light" ? 0.1 : 0.2,
    roughness: theme === "light" ? 0.5 : 0.4,
  });
}

// The core is the architecture domain's hub — always blue, the dominant,
// central discipline the whole assembly orbits around. Softer emissive in
// light so it's a solid saturated hub rather than a bloom blaster on white.
export function coreMaterial(theme: Theme) {
  const color = domainColor("blue", theme);
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: theme === "light" ? 0.7 : 1,
    metalness: 0.1,
    roughness: 0.2,
  });
}

// Per-theme lighting, bloom, and the core's ignite/point-light ranges. Dark
// leans on a strong rim + generous bloom to carve glowing edges out of the
// void; light leans on high even ambient fill (so the grey tiles read as lit
// hardware, not shadowed) with a restrained rim and bloom so white doesn't
// turn to muddy haze.
export const SCENE: Record<
  Theme,
  {
    ambient: number;
    dir: number;
    rim: number;
    rimColor: string;
    bloom: { intensity: number; threshold: number };
    point: { base: number; ignite: number; color: string };
    coreIgnite: { base: number; scale: number };
    /**
     * The 2D DOM wrapper's rest-state opacity (IntroSequence's canvasWrapRef,
     * before the GSAP timeline ramps it to 1 in segment B) — how much of the
     * scattered, not-yet-assembled blocks shows through at progress=0. Dark
     * was 0.16 site-wide; combined with a near-black chassis on a near-black
     * background that's effectively invisible, so the assembly has no visible
     * "before" to animate from. Raised per-theme rather than to one shared
     * value: dark needs the bigger jump (worst contrast case), light's grey-
     * on-white chassis already has some natural presence at low opacity.
     */
    restOpacity: number;
  }
> = {
  dark: {
    ambient: 0.3,
    dir: 0.7,
    rim: 0.9,
    rimColor: ACCENT_BLUE,
    bloom: { intensity: 0.5, threshold: 0.35 },
    point: { base: 1.2, ignite: 6, color: ACCENT_BLUE },
    coreIgnite: { base: 0.6, scale: 3 },
    restOpacity: 0.34,
  },
  light: {
    ambient: 0.92,
    dir: 0.5,
    rim: 0.38,
    rimColor: "#1f6fe0",
    bloom: { intensity: 0.22, threshold: 0.68 },
    point: { base: 0.55, ignite: 2.4, color: "#1f6fe0" },
    coreIgnite: { base: 0.5, scale: 1.6 },
    restOpacity: 0.24,
  },
};
