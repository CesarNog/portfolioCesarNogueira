import * as THREE from "three";

// Mirrors the site's dark-mode CSS tokens (app/globals.css): --color-blue,
// --color-cyan, --color-orange. Kept as plain hex since three.js materials
// don't read CSS custom properties.
export const ACCENT_HEX = {
  blue: "#3b82f6",
  cyan: "#22b8c4",
  orange: "#f59e5b",
} as const;

export function chassisMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#0f1520",
    metalness: 0.6,
    roughness: 0.35,
  });
}

export function accentMaterial(accent: keyof typeof ACCENT_HEX, emissiveIntensity = 0.9) {
  const hex = ACCENT_HEX[accent];
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity,
    metalness: 0.2,
    roughness: 0.4,
  });
}

export function coreMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#22b8c4",
    emissive: "#22b8c4",
    emissiveIntensity: 1,
    metalness: 0.1,
    roughness: 0.2,
  });
}
