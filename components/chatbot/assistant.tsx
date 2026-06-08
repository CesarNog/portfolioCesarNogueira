"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { faq, siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { AVATAR_SRC } from "@/lib/images";
import { EASE, DUR } from "@/lib/motion";

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
  const { t, lang } = useI18n();

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

  const listRef = useRef<HTMLDivElement>(null);
  const lastAnswerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { setOpen(false); return; }
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "?" && !open && tag !== "INPUT" && tag !== "TEXTAREA") setOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  useEffect(() => {
    const openIt = () => setOpen(true);
    document.addEventListener("open-smart-faq", openIt);
    return () => document.removeEventListener("open-smart-faq", openIt);
  }, []);

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

      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: reduce ? "instant" : "smooth",
        });
      }, 40);

      const fallback = () => matchFaq(q) ?? t.assistant.fallback;

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, lang }),
          signal: AbortSignal.timeout(12000),
        });
        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: t.assistant.rateLimit, followUps: getFollowUps(t.assistant.rateLimit) },
          ]);
          return;
        }
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
      {/* Launcher button — slides up on mount, hover lift, tap press */}
      <m.button
        type="button"
        aria-label={open ? t.assistant.close : t.assistant.launch}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.reveal, delay: 0.5, ease: EASE.spring }}
        whileHover={reduce ? undefined : { scale: 1.04, transition: { duration: DUR.micro } }}
        whileTap={reduce ? undefined : { scale: 0.95, transition: { duration: DUR.micro } }}
        className="fixed bottom-5 right-5 z-floating flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-fg)] shadow-2xl transition-colors hover:border-[var(--color-blue)]"
      >
        <span className="status-dot" />
        <span className="font-medium">{open ? t.assistant.close : t.assistant.launch}</span>
      </m.button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-label={t.assistant.header}
            aria-modal="true"
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.32, ease: EASE.spring }}
            style={{ transformOrigin: "bottom right" }}
            className="panel fixed bottom-20 right-5 z-floating flex h-[76vh] max-h-[min(640px,calc(100dvh-144px))] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-3">
              {/* Icon breathes gently while loading */}
              <m.div
                animate={
                  loading && !reduce
                    ? { opacity: [1, 0.45, 1] }
                    : { opacity: 1 }
                }
                transition={{
                  duration: 1.4,
                  repeat: loading ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue)]/15 border border-[var(--color-blue)]/30"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6v6l4 2" />
                  <circle cx="19" cy="5" r="3" fill="var(--color-blue)" stroke="none" />
                </svg>
              </m.div>
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
                {/* Greeting — slides in from left after panel opens */}
                <m.div
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.12, ease: EASE.spring }}
                  className="flex justify-start"
                >
                  <p className="panel-2 max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--color-fg)]">
                    {t.assistant.greeting}
                  </p>
                </m.div>

                {/* Message list — each slides in from its sender's side */}
                {messages.map((msg, i) => {
                  const isLast = i === messages.length - 1;
                  const isLastAssistant = msg.role === "assistant" && isLast;
                  const isUser = msg.role === "user";

                  return (
                    <m.div
                      key={i}
                      initial={reduce ? false : { opacity: 0, x: isUser ? 16 : -16, y: 4 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.28, ease: EASE.spring }}
                      className="space-y-2"
                    >
                      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          ref={isLastAssistant ? lastAnswerRef : undefined}
                          className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isUser
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

                      {/* Follow-up chips stagger in after assistant message */}
                      {msg.role === "assistant" && msg.followUps && msg.followUps.length > 0 && (
                        <m.div
                          initial={reduce ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15, ease: EASE.out }}
                          className="ml-1 flex flex-col gap-1.5"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                            {t.assistant.followUp}
                          </p>
                          {msg.followUps.map((fu, fi) => (
                            <m.button
                              key={fu}
                              initial={reduce ? false : { opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.22,
                                delay: 0.22 + fi * 0.06,
                                ease: EASE.out,
                              }}
                              whileTap={reduce ? undefined : { scale: 0.96, transition: { duration: DUR.micro } }}
                              type="button"
                              onClick={() => ask(fu)}
                              disabled={loading}
                              className="w-fit rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-1.5 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                            >
                              {fu}
                            </m.button>
                          ))}
                        </m.div>
                      )}
                    </m.div>
                  );
                })}

                {/* Thinking indicator — animates in and out */}
                <AnimatePresence>
                  {loading && (
                    <m.div
                      key="thinking"
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.22, ease: EASE.out }}
                      className="flex justify-start"
                    >
                      <div className="panel-2 flex items-center gap-2 rounded-xl px-4 py-3">
                        <ThinkingDots reduce={!!reduce} />
                        <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                          {t.assistant.thinking}
                        </span>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Suggested prompts — stagger in when thread is empty */}
                {messages.length === 0 && (
                  <div className="pt-2">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {t.assistant.suggested}
                    </p>
                    <div className="flex flex-col gap-2">
                      {t.recruiterPrompts.map((q, i) => (
                        <m.button
                          key={q}
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: DUR.fast,
                            delay: 0.2 + i * 0.07,
                            ease: EASE.out,
                          }}
                          whileTap={reduce ? undefined : { scale: 0.97, transition: { duration: DUR.micro } }}
                          type="button"
                          onClick={() => ask(q)}
                          disabled={loading}
                          className="w-fit rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-2 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                        >
                          {q}
                        </m.button>
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
                className="flex-1 rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] transition-[border-color,box-shadow] focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue)]/15"
              />
              <m.button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                whileTap={reduce ? undefined : { scale: 0.87, transition: { duration: DUR.micro, ease: EASE.in } }}
                className="bg-accent accent-blue flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-white disabled:opacity-40"
              >
                ↑
              </m.button>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Animated thinking dots — vertical wave + opacity stagger
function ThinkingDots({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-blue)]/70"
          animate={
            reduce
              ? undefined
              : { y: [0, -4, 0], opacity: [0.35, 1, 0.35] }
          }
          transition={{
            duration: 1.0,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
