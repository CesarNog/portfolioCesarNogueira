"use client";

import { useEffect, useState } from "react";

/**
 * Returns the portion of `text` revealed so far and whether typing is done.
 * Starts after `startDelay` ms, types one character every `charDelay` ms.
 * Under prefers-reduced-motion: instantly reveals full text.
 */
export function useTypewriter(
  text: string,
  { charDelay = 55, startDelay = 0, skip = false }: { charDelay?: number; startDelay?: number; skip?: boolean } = {}
): { displayed: string; done: boolean } {
  const [idx, setIdx] = useState(skip ? text.length : 0);

  useEffect(() => {
    if (skip) { setIdx(text.length); return; }
    setIdx(0);
    let frame: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setIdx(i);
        if (i < text.length) frame = setTimeout(tick, charDelay);
      };
      frame = setTimeout(tick, charDelay);
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(frame); };
  }, [text, charDelay, startDelay, skip]);

  return { displayed: text.slice(0, idx), done: idx >= text.length };
}
