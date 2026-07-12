import * as THREE from "three";

// The Domain-Color Rule (DESIGN.md): blue = cloud architecture, cyan =
// platform engineering/DevOps/data, orange = FinOps/cost. The 3D assembly
// now encodes this directly in its own geometry (see blocks-data.ts), not
// only in the 2D DOM icon overlay layered on top in intro-sequence.tsx.
// Architecture (blue) stays the dominant/majority domain — it's the
// chassis's "home" color and the core's color — cyan and orange appear only
// on a minority of accent strips, so the scene reads as one system with
// three legible specialities, not a rainbow.
// Mirrors --color-blue/--color-cyan/--color-orange in app/globals.css (kept
// as plain hex since three.js materials don't read CSS custom properties).
export const ACCENT_BLUE = "#3b82f6";
export const ACCENT_CYAN = "#22b8c4";
export const ACCENT_ORANGE = "#f59e5b";

export type Domain = "blue" | "cyan" | "orange";

const DOMAIN_COLOR: Record<Domain, string> = {
  blue: ACCENT_BLUE,
  cyan: ACCENT_CYAN,
  orange: ACCENT_ORANGE,
};

export function domainColor(domain: Domain): string {
  return DOMAIN_COLOR[domain];
}

// Chassis stays a single neutral dark shell regardless of domain — the
// module's "body" is quiet by design; only its accent strip declares which
// domain it belongs to. This keeps the composition disciplined (one bold
// signal per element) instead of tinting every surface.
export function chassisMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#0f1520",
    metalness: 0.6,
    roughness: 0.35,
  });
}

export function accentMaterial(domain: Domain, emissiveIntensity = 1.05) {
  const color = domainColor(domain);
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    metalness: 0.2,
    roughness: 0.4,
  });
}

// The core is the architecture domain's hub — it stays blue: the dominant,
// central discipline the whole assembly orbits around.
export function coreMaterial() {
  return new THREE.MeshStandardMaterial({
    color: ACCENT_BLUE,
    emissive: ACCENT_BLUE,
    emissiveIntensity: 1,
    metalness: 0.1,
    roughness: 0.2,
  });
}
