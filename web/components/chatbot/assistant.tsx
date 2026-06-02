"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { faq, recruiterPrompts, siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { AVATAR_SRC } from "@/lib/images";

type Msg = { role: "user" | "assistant"; text: string };

export function Assistant() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Allow other UI (command palette, recruiter mode) to open the assistant.
  useEffect(() => {
    const openIt = () => setOpen(true);
    document.addEventListener("open-smart-faq", openIt);
    return () => document.removeEventListener("open-smart-faq", openIt);
  }, []);

  // Match a free-text question to the best curated answer.
  const matchFaq = (q: string) => {
    const lower = q.toLowerCase();
    let best: { score: number; a: string } | null = null;
    for (const f of faq) {
      const words = f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
      const score = words.reduce((n, w) => (lower.includes(w) ? n + 1 : n), 0);
      if (score > 0 && (!best || score > best.score)) best = { score, a: f.a };
    }
    return best?.a;
  };

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    const fallback = () =>
      matchFaq(q) ??
      `Here's the short version: ${siteConfig.name} is a Principal Cloud Architect & FinOps consultant (GCP/AWS/Azure, 10+ years) available for international projects. Email ${siteConfig.links.email}.`;

    try {
      const res = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { answer?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer?.trim() || fallback() },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: fallback() }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? "Close Smart AI FAQ" : "Open Smart AI FAQ"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-fg)] shadow-2xl transition-colors hover:border-[var(--color-blue)]"
      >
        <span className="status-dot" />
        <span className="font-medium">{open ? t.assistant.close : t.assistant.launch}</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            role="dialog"
            aria-label="Smart AI FAQ — AI Career Assistant"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="panel fixed bottom-20 right-5 z-[90] flex h-[72vh] max-h-[600px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_SRC}
                alt={siteConfig.name}
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-full border border-[var(--color-hairline-strong)] object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-[var(--color-fg)]">{t.assistant.header}</p>
                <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                  {t.assistant.subtitle}
                </p>
              </div>
              <button
                aria-label={t.assistant.close}
                onClick={() => setOpen(false)}
                className="text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {/* Localized greeting always leads the thread */}
              <div className="flex justify-start">
                <p className="panel-2 max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed text-[var(--color-fg)]">
                  {t.assistant.greeting}
                </p>
              </div>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent accent-blue text-white"
                        : "panel-2 text-[var(--color-fg)]"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
              {loading && (
                <p className="panel-2 inline-block rounded-lg px-3 py-2 font-mono text-xs text-[var(--color-fg-muted)]">
                  analyzing…
                </p>
              )}

              {/* Recruiter-focused suggested prompts */}
              <div className="pt-1">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {t.assistant.suggested}
                </p>
                <div className="flex flex-wrap gap-2">
                  {recruiterPrompts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      disabled={loading}
                      className="rounded-full border border-[var(--color-hairline)] px-3 py-1.5 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-[var(--color-hairline)] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                aria-label={t.assistant.header}
                className="flex-1 rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-accent accent-blue rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                ↑
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
