import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { testimonials } from "@/lib/site-config";

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      label="Signal"
      title="Trusted by engineers and leaders"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <figure className="panel h-full rounded-lg p-6">
              <blockquote className="text-sm leading-relaxed text-[var(--color-fg)]">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-4 border-t border-[var(--color-hairline)] pt-3">
                <p className="text-sm text-[var(--color-fg)]">{t.name}</p>
                <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                  {t.title}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
