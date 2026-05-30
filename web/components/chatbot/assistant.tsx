"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { faq, siteConfig } from "@/lib/site-config";

type Msg = { role: "user" | "assistant"; text: string };

const GREETING: Msg = {
  role: "assistant",
  text: `Hi — I'm ${siteConfig.firstName}'s Mission Control assistant. Tap a question below, or ask me anything about his cloud, DevOps, FinOps or AI work.`,
};

export function Assistant() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Close on Escape and trap initial focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pushFaq = (q: string, a: string) => {
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: a }]);
  };

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    // Local fallback: best-matching curated answer.
    const fallback = () => {
      const lower = q.toLowerCase();
      const hit = faq.find((f) =>
        f.q.toLowerCase().split(" ").some((w) => w.length > 4 && lower.includes(w)),
      );
      return (
        hit?.a ??
        `I can't reach the live AI right now, but here's what I can tell you: ${siteConfig.name} is a Principal Cloud Architect & FinOps consultant (GCP/AWS/Azure, 10+ years), available for international projects. Email ${siteConfig.links.email}.`
      );
    };

    try {
      const res = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { answer?: string };
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer?.trim() || fallback() },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: fallback() }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? "Close assistant" : "Open AI assistant"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-fg)] shadow-2xl transition-colors hover:border-[var(--color-blue)]"
      >
        <span className="status-dot" />
        <span className="font-medium">{open ? "Close" : "Ask AI"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="AI assistant"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="panel fixed bottom-20 right-5 z-[90] flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-3">
              <span className="status-dot" />
              <div className="flex-1">
                <p className="text-sm text-[var(--color-fg)]">Mission Control Assistant</p>
                <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                  AI · Llama 3.3 (free)
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent accent-blue text-white"
                        : "panel-2 text-[var(--color-fg)]"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {loading && (
                <p className="panel-2 inline-block rounded-lg px-3 py-2 font-mono text-xs text-[var(--color-fg-muted)]">
                  analyzing…
                </p>
              )}

              {/* FAQ quick buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {faq.map((f) => (
                  <button
                    key={f.q}
                    type="button"
                    onClick={() => pushFaq(f.q, f.a)}
                    className="rounded-full border border-[var(--color-hairline)] px-3 py-1.5 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)]"
                  >
                    {f.q}
                  </button>
                ))}
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
                placeholder="Ask anything about Cesar…"
                aria-label="Ask the assistant"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
