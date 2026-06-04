"use client";

import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export function Story() {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  return (
    <section id="summary" className="scroll-mt-20 border-t border-[var(--color-hairline)] px-6 py-16 lg:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Pull quote — large editorial statement */}
        <m.blockquote
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 lg:mb-24"
        >
          {/* Blue accent rule — editorial typographic marker */}
          <div className="mb-8 h-px w-16 bg-[var(--color-blue)]" />
          <p className="font-display max-w-3xl text-2xl leading-[1.25] text-[var(--color-fg)] sm:text-3xl lg:text-[2.5rem] [text-wrap:balance]">
            &ldquo;{t.story.pullQuote}&rdquo;
          </p>
        </m.blockquote>

        {/* Two-column: prose first, portrait second (portrait below text on mobile) */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-24">
          <div className="space-y-6">
            <m.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base leading-[1.85] text-[var(--color-fg-muted)] sm:text-[17px] [text-wrap:pretty]"
            >
              {t.story.p1}
            </m.p>
            <m.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base leading-[1.85] text-[var(--color-fg-muted)] sm:text-[17px] [text-wrap:pretty]"
            >
              {t.story.p2}
            </m.p>
          </div>

          {/* Portrait — mobile: full width below text, desktop: right column */}
          <m.figure
            initial={reduce ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto w-full max-w-sm sm:max-w-none"
          >
            <Image
              src="/portrait.webp"
              alt={siteConfig.name}
              width={480}
              height={640}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[3/4] w-full rounded-xl object-cover object-top"
            />
            <figcaption className="mt-3 font-mono text-[11px] text-[var(--color-fg-subtle)]">
              {t.portraitCaption}
            </figcaption>
          </m.figure>
        </div>

        {/* Third paragraph — full width */}
        <m.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 max-w-2xl text-base leading-[1.85] text-[var(--color-fg-muted)] sm:text-[17px] lg:mt-16"
        >
          {t.story.p3}
        </m.p>
      </div>
    </section>
  );
}
