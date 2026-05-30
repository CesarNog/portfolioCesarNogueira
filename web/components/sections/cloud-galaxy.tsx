"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Section } from "@/components/sections/section";
import { galaxy, galaxyGroups } from "@/lib/site-config";

const ForceGalaxy = dynamic(
  () => import("@/components/background/force-graph").then((m) => m.ForceGalaxy),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--color-fg-subtle)]">
        loading galaxy…
      </div>
    ),
  },
);

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

export function CloudGalaxy() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Section
      id="stack"
      label="Multi-Cloud Architecture Map"
      title="An engineering galaxy, not a list of badges"
      intro="A live force-directed graph of the full stack — clouds, orchestration, CI/CD, data and FinOps. Drag, zoom and explore the connections."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel relative min-h-[360px] overflow-hidden rounded-lg lg:min-h-[420px]">
          <ForceGalaxy className="absolute inset-0" activeGroup={active} />
        </div>

        <div className="flex flex-col justify-center gap-2">
          {Object.entries(galaxyGroups).map(([key, g]) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setActive(key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(key)}
              onBlur={() => setActive(null)}
              className={`panel flex items-center justify-between rounded-md px-4 py-3 text-left transition-colors ${
                active === key ? "border-[var(--color-hairline-strong)]" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: ACCENT[g.accent] }}
                />
                <span className="text-sm text-[var(--color-fg)]">{g.label}</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                {galaxy.filter((n) => n.group === key).length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
