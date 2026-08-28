"use client";

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { blogPosts, DOMAIN_ACCENT_CLASS } from "@/lib/blog-posts";
import { useI18n } from "@/lib/i18n";

// Deliberately not the `.panel` card-per-item pattern the case-studies index
// uses (see case-studies-index-body.tsx): those entries lead with a metric,
// these lead with an argument. A hairline-divided list reads as an index of
// field reports, not a grid of tiles, and keeps the Domain-Color Rule doing
// the classification work instead of a repeated card frame.
export function BlogIndexBody() {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="font-display text-[clamp(2rem,4vw+0.5rem,3.25rem)] leading-[1.1] text-[var(--color-fg)] [text-wrap:balance]">
        {t.blog.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-[17px]">
        {t.blog.subtitle}
      </p>
      <div className="mt-12 divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
        {blogPosts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <Link href={`/blog/${post.slug}`} className={`group block py-8 ${DOMAIN_ACCENT_CLASS[post.domain]}`}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                {post.domainLabel} · {post.readMinutes} {t.blog.minRead}
              </p>
              <h2 className="mt-3 text-xl font-medium text-[var(--color-fg)] transition-colors group-hover:text-accent sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
                {post.dek}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">
                {t.blog.readFull}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
