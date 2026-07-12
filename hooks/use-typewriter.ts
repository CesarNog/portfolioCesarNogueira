"use client";

import { useEffect, useState } from "react";

/**
 * Returns the portion of `text` revealed so far and whether typing is done.
 * Starts after `startDelay` ms (once `start` is true), types one character
 * every `charDelay` ms. Under prefers-reduced-motion: instantly reveals full
 * text. `start` defaults to true (fires on mount, the original behavior) —
 * pass `start: false` until some later trigger (e.g. scroll-arrival) should
 * kick the reveal off, so the caller controls *when* the clock starts
 * without owning the char-by-char ticking logic itself.
 */
export function useTypewriter(
  text: string,
  {
    charDelay = 55,
    startDelay = 0,
    skip = false,
    start = true,
  }: { charDelay?: number; startDelay?: number; skip?: boolean; start?: boolean } = {}
): { displayed: string; done: boolean } {
  const [idx, setIdx] = useState(skip ? text.length : 0);

  useEffect(() => {
    if (skip) { setIdx(text.length); return; }
    if (!start) { setIdx(0); return; }
    setIdx(0);
    let frame: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setIdx(i);
        if (i < text.length) frame = setTimeout(tick, charDelay);
      };
      frame = setTimeout(tick, charDelay);
    }, startDelay);
    return () => { clearTimeout(startTimer); clearTimeout(frame); };
  }, [text, charDelay, startDelay, skip, start]);

  return { displayed: text.slice(0, idx), done: idx >= text.length };
}
