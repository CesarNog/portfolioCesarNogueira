"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site-config";
import { DOMAIN_ACCENT_CLASS, type BlogPost } from "@/lib/blog-posts";
import { useI18n } from "@/lib/i18n";

export function BlogPostBody({ post }: { post: BlogPost }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const relatedCaseStudy = projects.find((p) => p.id === post.relatedCaseStudyId);

  const date = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className={DOMAIN_ACCENT_CLASS[post.domain]}>
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        <Link href="/" className="transition-colors hover:text-[var(--color-fg)]">{t.palette.home}</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="transition-colors hover:text-[var(--color-fg)]">{t.blog.title}</Link>
      </nav>

      <Reveal>
        <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
          {post.domainLabel}
        </span>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw+0.5rem,3.25rem)] leading-[1.1] text-[var(--color-fg)] [text-wrap:balance]">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-[13px] text-[var(--color-fg-subtle)]">
          {date} · {post.readMinutes} {t.blog.minRead}
        </p>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--color-fg-muted)] [text-wrap:pretty]">
          {post.dek}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 max-w-2xl space-y-6 border-t border-[var(--color-hairline)] pt-10">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-[17px] leading-[1.85] tracking-[-0.011em] text-[var(--color-fg-muted)] [text-wrap:pretty]">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      {relatedCaseStudy && (
        <Reveal delay={0.15}>
          <div className="mt-10 max-w-2xl rounded border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
              {relatedCaseStudy.client}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)] [text-wrap:pretty]">
              {relatedCaseStudy.outcome}
            </p>
            <Link
              href={`/case-studies/${relatedCaseStudy.id}`}
              className="mt-3 inline-block text-sm font-medium text-accent"
            >
              {t.blog.relatedCaseStudy}
            </Link>
          </div>
        </Reveal>
      )}

      {post.references.length > 0 && (
        <Reveal delay={0.18}>
          <div className="mt-10 max-w-2xl border-t border-[var(--color-hairline)] pt-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {t.blog.references}
            </p>
            <ol className="mt-3 space-y-1.5">
              {post.references.map((ref) => (
                <li key={ref.url} className="text-[13px] leading-relaxed">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-fg-muted)] underline decoration-[var(--color-hairline-strong)] underline-offset-2 transition-colors hover:text-accent"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.2}>
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-[var(--color-hairline)] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[var(--color-fg-muted)]">
            {t.caseStudies.similarProblem}
          </p>
          <m.div whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
              style={{ backgroundColor: "var(--color-button-primary)" }}
            >
              {t.caseStudies.letsTalk}
            </Link>
          </m.div>
        </div>
      </Reveal>
    </article>
  );
}
