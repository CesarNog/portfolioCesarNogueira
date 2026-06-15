"use client";

import { useState } from "react";
import { Section } from "@/components/sections/section";
import { Magnetic } from "@/components/ui/magnetic";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactConsole() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const rows = [
    { k: t.contact.rowLabels.email, v: siteConfig.links.email, href: `mailto:${siteConfig.links.email}` },
    { k: t.contact.rowLabels.linkedin, v: "in/CesarNog", href: siteConfig.links.linkedin },
    { k: t.contact.rowLabels.github, v: "@CesarNog", href: siteConfig.links.github },
    { k: t.contact.rowLabels.location, v: siteConfig.location },
    { k: t.contact.rowLabels.responseTime, v: t.contact.responseTime },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section
      id="contact"
      label={t.sections.contact.label}
      title={t.sections.contact.title}
      intro={t.sections.contact.intro}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
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
                  {r.href ? (
                    <a
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="hover:text-[var(--color-blue)]"
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

        <div className="panel accent-blue glow flex flex-col rounded-lg p-6">
          <h3 className="font-display text-2xl text-[var(--color-fg)]">
            {t.contact.briefingTitle}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{t.contact.briefingDesc}</p>

          {status === "success" ? (
            <div className="mt-6 flex flex-1 items-center justify-center rounded-md border border-[var(--color-ok)]/30 bg-[var(--color-ok)]/5 p-8">
              <p className="text-center text-sm text-[var(--color-ok)]">{t.contact.form.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.form.name}
                className="rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)]"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.form.email}
                className="rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)]"
              />
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.form.message}
                className="resize-none rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)]"
              />
              {status === "error" && (
                <p className="text-xs text-[var(--color-warn)]">{t.contact.form.error}</p>
              )}
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-accent inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? t.contact.form.sending : t.contact.form.send}
                </button>
              </Magnetic>
            </form>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
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
        </div>
      </div>
    </Section>
  );
}
