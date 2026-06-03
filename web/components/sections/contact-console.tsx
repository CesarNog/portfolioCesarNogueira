"use client";

import { useState } from "react";
import { Section } from "@/components/sections/section";
import { Magnetic } from "@/components/ui/magnetic";
import { ContactFormModal } from "@/components/ui/contact-form-modal";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function ContactConsole() {
  const { t } = useI18n();
  const [formOpen, setFormOpen] = useState(false);

  const rows = [
    { k: t.contact.rowLabels.email, v: siteConfig.links.email, action: () => setFormOpen(true) },
    { k: t.contact.rowLabels.linkedin, v: "in/CesarNog", href: siteConfig.links.linkedin },
    { k: t.contact.rowLabels.github, v: "@CesarNog", href: siteConfig.links.github },
    { k: t.contact.rowLabels.location, v: siteConfig.location },
    { k: t.contact.rowLabels.responseTime, v: t.contact.responseTime },
  ];

  return (
    <>
      <Section
        id="contact"
        label={t.sections.contact.label}
        title={t.sections.contact.title}
        intro={t.sections.contact.intro}
        noEyebrow
      >
        <blockquote className="mb-8 rounded-lg bg-[var(--color-blue)]/5 px-5 py-4 text-base leading-relaxed text-[var(--color-fg-muted)] italic ring-1 ring-[var(--color-blue)]/15">
          {t.contact.contactQuote}
        </blockquote>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Contact info */}
          <div data-recruiter-highlight className="panel rounded-lg p-6">
            <div className="flex items-center gap-3">
              <span className="status-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-ok)]">
                {t.contact.availability}
              </span>
            </div>
            <dl className="mt-6 divide-y divide-[var(--color-hairline)]">
              {rows.map((r) => (
                <div key={r.k} className="flex items-center justify-between gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {r.k}
                  </dt>
                  <dd className="text-sm text-[var(--color-fg)]">
                    {"action" in r && r.action ? (
                      <button
                        type="button"
                        onClick={r.action}
                        className="transition-colors hover:text-[var(--color-blue)]"
                      >
                        {r.v}
                      </button>
                    ) : "href" in r && r.href ? (
                      <a
                        href={r.href}
                        target={r.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="transition-colors hover:text-[var(--color-blue)]"
                      >
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CTA panel */}
          <div className="panel accent-blue glow flex flex-col justify-between rounded-lg p-6">
            <div>
              <h3 className="font-display text-2xl text-[var(--color-fg)] [text-wrap:balance]">
                {t.contact.briefingTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                {t.contact.briefingDesc}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="bg-accent inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {t.contact.emailCta}
                </button>
              </Magnetic>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
                >
                  LinkedIn ↗
                </a>
                <a
                  href={siteConfig.links.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
                >
                  {t.contact.downloadCv} ↓
                </a>
              </div>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-2.5 text-sm text-[#25D366] transition-colors hover:bg-[#25D366]/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>

      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
