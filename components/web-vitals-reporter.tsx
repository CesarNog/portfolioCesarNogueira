"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __cnVitalsQueue?: unknown[];
    __cnSendVital?: (metric: unknown) => void;
  }
}

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to GA4 as events.
 * gtag.js loads via next/script "afterInteractive", so early metrics (e.g. LCP
 * on a bounce visit) can fire before it's ready — those are queued on
 * window.__cnVitalsQueue and flushed once analytics.tsx's inline script runs.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;

    window.__cnSendVital =
      window.__cnSendVital ||
      ((m) => {
        const metric = m as { name: string; value: number; id: string; rating?: string };
        if (typeof window.gtag !== "function") {
          window.__cnVitalsQueue = window.__cnVitalsQueue || [];
          window.__cnVitalsQueue.push(metric);
          return;
        }
        window.gtag("event", metric.name, {
          value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_rating: metric.rating,
          event_category: "Web Vitals",
          non_interaction: true,
        });
      });

    window.__cnSendVital(metric);
  });

  return null;
}
