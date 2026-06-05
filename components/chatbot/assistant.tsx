"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { faq, siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { AVATAR_SRC } from "@/lib/images";

// ─── Types ────────────────────────────────────────────────────────────────────

type Msg = {
  role: "user" | "assistant";
  text: string;
  followUps?: string[];
};

// ─── FAQ matcher ─────────────────────────────────────────────────────────────

function matchFaq(q: string): string | null {
  const lower = q.toLowerCase();
  let best: { score: number; a: string } | null = null;
  for (const f of faq) {
    const words = f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    const score = words.reduce((n, w) => (lower.includes(w) ? n + 1 : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, a: f.a };
  }
  return best?.a ?? null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Assistant() {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  // Follow-up suggestions from i18n — fully translated per active language
  const getFollowUps = (answer: string): string[] => {
    const lower = answer.toLowerCase();
    const fu = t.assistantFollowUps;
    const map: Record<string, string[]> = {
      kubernetes: fu.kubernetes,
      finops: fu.finops,
      leadership: fu.leadership,
      architecture: fu.architecture,
      gcp: fu.gcp,
      cloud: fu.cloud,
      enterprise: fu.enterprise,
      ai: fu.ai,
    };
    for (const [key, suggestions] of Object.entries(map)) {
      if (lower.includes(key)) return suggestions;
    }
    return fu.fallback;
  };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs
  const listRef = useRef<HTMLDivElement>(null);
  const lastAnswerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track manual scroll — stop auto-scrolling if user scrolls up
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let prevScrollTop = el.scrollTop;
    const onScroll = () => {
      if (el.scrollTop < prevScrollTop - 20) userScrolledRef.current = true;
      else if (el.scrollTop >= el.scrollHeight - el.clientHeight - 40)
        userScrolledRef.current = false;
      prevScrollTop = el.scrollTop;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to START of last answer when it arrives (explicit container scroll
  // avoids viewport jump from scrollIntoView on nested scroll containers)
  useEffect(() => {
    if (loading) return;
    if (userScrolledRef.current) return;
    if (!lastAnswerRef.current || !listRef.current) return;
    const timer = setTimeout(() => {
      const container = listRef.current!;
      const el = lastAnswerRef.current!;
      const elTop = el.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elTop - 12,
        behavior: reduce ? "instant" : "smooth",
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [messages, reduce, loading]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // External open trigger (command palette, recruiter mode)
  useEffect(() => {
    const openIt = () => setOpen(true);
    document.addEventListener("open-smart-faq", openIt);
    return () => document.removeEventListener("open-smart-faq", openIt);
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || loading) return;

      userScrolledRef.current = false;
      setMessages((prev) => [...prev, { role: "user", text: q }]);
      setInput("");
      setLoading(true);

      // Scroll to show the "Thinking…" state immediately
      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: reduce ? "instant" : "smooth",
        });
      }, 40);

      const fallback = () =>
        matchFaq(q) ??
        `Cesar is a Principal Cloud Architect with 10+ years across GCP, AWS, Azure and OCI, available now for international consulting via UP2CLOUD. For specific questions email ${siteConfig.links.email}.`;

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { answer?: string };
        const answer = data.answer?.trim() || fallback();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: answer, followUps: getFollowUps(answer) },
        ]);
      } catch {
        const answer = fallback();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: answer, followUps: getFollowUps(answer) },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, reduce],
  );

  return (
    <>
      {/* Launcher button */}
      <button
        type="button"
        aria-label={open ? "Close AI Career Assistant" : "Open AI Career Assistant"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-floating flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-fg)] shadow-2xl transition-colors hover:border-[var(--color-blue)]"
      >
        <span className="status-dot" />
        <span className="font-medium">{open ? t.assistant.close : t.assistant.launch}</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-label="AI Career Assistant"
            aria-modal="true"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="panel fixed bottom-20 right-5 z-floating flex h-[76vh] max-h-[640px] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-xl shadow-2xl"
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-fg)]">{t.assistant.header}</p>
                <p className="truncate font-mono text-[10px] text-[var(--color-fg-subtle)]">
                  {t.assistant.subtitle}
                </p>
              </div>
              <button
                aria-label={t.assistant.close}
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* Message thread */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain scroll-pt-2 p-4"
            >
              <div className="space-y-4">
                {/* Greeting */}
                <div className="flex justify-start">
                  <p className="panel-2 max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--color-fg)]">
                    {t.assistant.greeting}
                  </p>
                </div>

                {/* Message list */}
                {messages.map((msg, i) => {
                  const isLast = i === messages.length - 1;
                  const isLastAssistant = msg.role === "assistant" && isLast;

                  return (
                    <div key={i} className="space-y-2">
                      <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {/* Attach ref to the START of the last assistant message */}
                        <div
                          ref={isLastAssistant ? lastAnswerRef : undefined}
                          className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-accent accent-blue text-white"
                              : "panel-2 text-[var(--color-fg)]"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                              {t.assistant.sourceLabel}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>

                      {/* Smart follow-ups after assistant messages */}
                      {msg.role === "assistant" && msg.followUps && msg.followUps.length > 0 && (
                        <m.div
                          initial={reduce ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                          className="ml-1 flex flex-col gap-1.5"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                            {t.assistant.followUp}
                          </p>
                          {msg.followUps.map((fu) => (
                            <button
                              key={fu}
                              type="button"
                              onClick={() => ask(fu)}
                              disabled={loading}
                              className="w-fit rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-1.5 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                            >
                              {fu}
                            </button>
                          ))}
                        </m.div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking indicator */}
                {loading && (
                  <m.div
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="panel-2 flex items-center gap-2 rounded-xl px-4 py-3">
                      <ThinkingDots />
                      <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                        {t.assistant.thinking}
                      </span>
                    </div>
                  </m.div>
                )}

                {/* Suggested prompts — shown only when thread is empty */}
                {messages.length === 0 && (
                  <div className="pt-2">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {t.assistant.suggested}
                    </p>
                    <div className="flex flex-col gap-2">
                      {t.recruiterPrompts.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => ask(q)}
                          disabled={loading}
                          className="w-fit rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-2 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                aria-label={t.assistant.header}
                className="flex-1 rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="bg-accent accent-blue flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-white disabled:opacity-40"
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

// Animated thinking dots
function ThinkingDots() {
  return (
    <div className="flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
