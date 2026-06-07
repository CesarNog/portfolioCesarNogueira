"use client";

import { useEffect, useRef, useState } from "react";
// inView state kept for future use but ForceGalaxy is now instant SVG
import { Section } from "@/components/sections/section";
import { ForceGalaxy } from "@/components/background/force-graph";
import { galaxy, galaxyGroups } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

export function CloudGalaxy() {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section
      id="stack"
      title={t.sections.stack.title}
      intro={t.sections.stack.intro}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div
          ref={panelRef}
          data-recruiter-dim
          className="panel relative min-h-[360px] overflow-hidden rounded-lg lg:min-h-[420px]"
        >
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
