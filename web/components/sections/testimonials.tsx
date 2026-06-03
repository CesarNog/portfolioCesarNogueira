"use client";

import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { testimonials } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { EASE, DUR } from "@/lib/motion";

export function Testimonials() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <Section
      id="testimonials"
      label={t.sections.testimonials.label}
      title={t.sections.testimonials.title}
    >
      {/* Editorial pull-quote layout — alternating indent, no card borders */}
      <div className="space-y-0 divide-y divide-[var(--color-hairline)]">
        {testimonials.map((testimonial, i) => (
          <m.figure
            key={testimonial.name}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: DUR.reveal, delay: i * 0.1, ease: EASE.out }}
            className={`py-12 ${i % 2 === 1 ? "lg:pl-16 xl:pl-24" : ""}`}
          >
            {/* Quote — large, editorial weight */}
            <blockquote className="relative">
              {/* Decorative opening mark */}
              <span
                className="absolute -top-6 -left-2 font-display text-7xl leading-none text-[var(--color-blue)]/15 select-none"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="relative max-w-3xl text-xl leading-[1.65] text-[var(--color-fg)] sm:text-2xl lg:text-[1.625rem]">
                {testimonial.text}
              </p>
            </blockquote>

            {/* Attribution */}
            <figcaption className="mt-8 flex items-center gap-4">
              {/* Initials avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] font-mono text-[13px] font-medium text-[var(--color-fg-muted)]"
                aria-hidden
              >
                {testimonial.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-fg)]">{testimonial.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {testimonial.title}
                </p>
              </div>
            </figcaption>
          </m.figure>
        ))}
      </div>
    </Section>
  );
}
