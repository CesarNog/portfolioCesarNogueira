"use client";

import { useEffect, useState } from "react";

/**
 * True once the page's <footer> enters the viewport — used to fade out
 * floating widgets (recruiter assistant, chat launcher) so they don't
 * overlap the footer's own links/icons.
 */
export function useFooterVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return visible;
}
