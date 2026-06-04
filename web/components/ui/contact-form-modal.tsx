"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type State = "idle" | "sending" | "success" | "error";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ContactFormModal({ open, onClose }: Props) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const c = t.contact;
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", message: "" });
  const firstInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Focus first field on open
  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 80);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const errors = { name: "", email: "", message: "" };
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!validateEmail(form.email)) errors.email = "Enter a valid email address.";
    if (!form.message.trim()) errors.message = "Message is required.";
    setFieldErrors(errors);
    return !errors.name && !errors.email && !errors.message;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState("sending");
    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
      // Announce status change to screen readers
      setTimeout(() => statusRef.current?.focus(), 80);
    } catch {
      setState("error");
      setTimeout(() => statusRef.current?.focus(), 80);
    }
  }

  function reset() {
    setForm({ name: "", email: "", subject: "", message: "" });
    setState("idle");
    onClose();
  }

  const inputClass =
    "w-full rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)]/20 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <m.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Send a message to Cesar"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="panel fixed inset-x-4 top-1/2 z-[120] max-w-lg -translate-y-1/2 overflow-hidden rounded-xl shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
              <div>
                <h2 className="font-display text-lg text-[var(--color-fg)] [text-wrap:balance]">
                  {c.formTitle}
                </h2>
                <p className="mt-0.5 font-mono text-[11px] text-[var(--color-fg-subtle)]">
                  {c.formSubtitle} · {siteConfig.links.email}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label={t.assistant.close}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {state === "success" ? (
                <div className="py-8 text-center">
                  <div className="check-draw mb-4 text-4xl text-[var(--color-ok)]">✓</div>
                  <p className="font-display text-xl text-[var(--color-fg)]">{c.formSuccess}</p>
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{c.formSuccessDesc}</p>
                  <button
                    onClick={reset}
                    className="mt-6 rounded-md border border-[var(--color-hairline)] px-5 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
                  >
                    {t.assistant.close}
                  </button>
                </div>
              ) : (
                <>
                {/* ARIA live region — announces status changes to screen readers */}
                <div ref={statusRef} role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} className="sr-only">
                  {state === "error" && "Message failed to send. Please try again or email directly."}
                </div>

                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  onSubmit={submit}
                  className="space-y-4"
                  noValidate
                >
                  {/* Hidden field for Netlify form detection */}
                  <input type="hidden" name="form-name" value="contact" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="cf-name" className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                        {c.formName} <span className="text-[var(--color-blue)]">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        id="cf-name"
                        name="name"
                        type="text"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? "cf-name-err" : undefined}
                        value={form.name}
                        onChange={set("name")}
                        placeholder={c.formNamePlaceholder}
                        className={`${inputClass} ${fieldErrors.name ? "border-red-500/60" : ""}`}
                      />
                      {fieldErrors.name && <p id="cf-name-err" role="alert" className="font-mono text-[10px] text-red-400">{fieldErrors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="cf-email" className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                        {c.formEmail} <span className="text-[var(--color-blue)]">*</span>
                      </label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "cf-email-err" : undefined}
                        value={form.email}
                        onChange={set("email")}
                        placeholder={c.formEmailPlaceholder}
                        className={`${inputClass} ${fieldErrors.email ? "border-red-500/60" : ""}`}
                      />
                      {fieldErrors.email && <p id="cf-email-err" role="alert" className="font-mono text-[10px] text-red-400">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cf-subject" className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {c.formSubject} <span className="normal-case tracking-normal text-[var(--color-fg-subtle)] opacity-60">(optional)</span>
                    </label>
                    <input
                      id="cf-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={set("subject")}
                      placeholder={c.formSubjectPlaceholder}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cf-message" className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {c.formMessage} <span className="text-[var(--color-blue)]">*</span>
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? "cf-message-err" : undefined}
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder={c.formMessagePlaceholder}
                      className={`${inputClass} resize-none ${fieldErrors.message ? "border-red-500/60" : ""}`}
                    />
                    {fieldErrors.message && <p id="cf-message-err" role="alert" className="font-mono text-[10px] text-red-400">{fieldErrors.message}</p>}
                  </div>

                  {state === "error" && (
                    <p role="alert" className="rounded-md bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                      {c.formError} {siteConfig.links.email}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
                    >
                      {c.formCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="bg-accent accent-blue inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {state === "sending" ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {c.formSending}
                        </>
                      ) : (
                        `${c.formSend} →`
                      )}
                    </button>
                  </div>
                </form>
                </>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
