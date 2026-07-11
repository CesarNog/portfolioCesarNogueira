import * as THREE from "three";

// Single accent for the whole scene: blue = architecture, per this
// project's Domain-Color Rule (DESIGN.md) — each accent maps to one
// technical domain and the three are never mixed decoratively on one
// element. Mirrors --color-blue in app/globals.css (kept as a plain hex
// since three.js materials don't read CSS custom properties).
export const ACCENT_BLUE = "#3b82f6";

export function chassisMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#0f1520",
    metalness: 0.6,
    roughness: 0.35,
  });
}

export function accentMaterial(emissiveIntensity = 0.9) {
  return new THREE.MeshStandardMaterial({
    color: ACCENT_BLUE,
    emissive: ACCENT_BLUE,
    emissiveIntensity,
    metalness: 0.2,
    roughness: 0.4,
  });
}

export function coreMaterial() {
  return new THREE.MeshStandardMaterial({
    color: ACCENT_BLUE,
    emissive: ACCENT_BLUE,
    emissiveIntensity: 1,
    metalness: 0.1,
    roughness: 0.2,
  });
}
