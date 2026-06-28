"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { faq, siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type Message = { role: "user" | "assistant"; text: string };

function matchFaq(q: string): string | null {
  const lower = q.toLowerCase();
  for (const item of faq) {
    if (item.keywords.some((k: string) => lower.includes(k))) return item.answer;
  }
  return null;
}

export function Assistant() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  async function send(q: string) {
    if (!q.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    const fallback = () =>
      matchFaq(q) ??
      `Here's the short version: ${siteConfig.name} is a Principal Cloud Architect & FinOps consultant (GCP/AWS/Azure, 10+ years) available for international projects. Email ${siteConfig.links.email}.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
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
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? t.assistant.close : t.assistant.launch}
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
            aria-label={t.assistant.header}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="panel fixed bottom-20 right-5 z-[90] flex h-[72vh] max-h-[600px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-3">
              <span className="status-dot" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-fg)]">{t.assistant.header}</p>
                <p className="font-mono text-[10px] text-[var(--color-fg-subtle)] truncate">{t.assistant.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.assistant.close}
                className="text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <>
                  <p className="text-sm text-[var(--color-fg-muted)]">{t.assistant.greeting}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {t.assistant.suggested}
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {t.assistant.prompts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="rounded-md border border-[var(--color-hairline)] px-3 py-2 text-left text-sm text-[var(--color-fg-muted)] hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-blue)] text-white"
                        : "bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-fg-subtle)]">
                    …
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-[var(--color-hairline)] px-3 py-2 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                className="flex-1 bg-transparent text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-[var(--color-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
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
