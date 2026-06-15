"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const W = 100;
const H = 52;

function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

type Region = "all" | "europe" | "americas";
type DeliveryType = "all" | "Remote" | "On-site" | "Hybrid";

const FILTER_REGION: { label: string; value: Region }[] = [
  { label: "All", value: "all" },
  { label: "Europe", value: "europe" },
  { label: "Americas", value: "americas" },
];

const FILTER_TYPE: { label: string; value: DeliveryType }[] = [
  { label: "Remote", value: "Remote" },
  { label: "On-site", value: "On-site" },
  { label: "Hybrid", value: "Hybrid" },
];

const TYPE_COLOR: Record<string, string> = {
  Remote: "var(--color-blue)",
  "On-site": "var(--color-orange)",
  Hybrid: "var(--color-cyan)",
};

export function GlobalMap() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const [typeFilter, setTypeFilter] = useState<DeliveryType>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hub = globalPresence.markers.find((m) => m.hub)!;
  const hubPt = project(hub.lat, hub.lon);

  const visibleMarkers = globalPresence.markers.filter((marker) => {
    if (regionFilter !== "all" && marker.region !== regionFilter) return false;
    if (typeFilter !== "all" && marker.deliveryType !== typeFilter) return false;
    return true;
  });

  const activeMarker =
    hoveredId ? globalPresence.markers.find((m) => m.id === hoveredId) ?? hub : hub;

  return (
    <Section
      id="global"
      label={t.sections.global.label}
      title={t.sections.global.title}
      intro={t.sections.global.intro}
    >