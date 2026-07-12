"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  failed: boolean;
};

/**
 * Hard requirement per CLAUDE.md: a WebGL/Canvas init failure must never
 * take down the page — IdentityConsole has to render regardless. There was
 * no error boundary anywhere in this app (no app/error.tsx / global-error.tsx
 * exist), so an R3F Canvas creation failure (GPU driver crash, hardware
 * acceleration disabled, restrictive browser flags, some headless/CI
 * environments) would previously throw with nothing to catch it — surfacing
 * Next's generic client-exception overlay for the WHOLE page.
 *
 * This boundary is scoped tightly around `<HeroCanvas />` only (see
 * IntroSequence): IdentityConsole and everything else on the page is a
 * sibling outside it, so a Canvas failure degrades to "no 3D scene" — the
 * canvas wrapper div stays in the tree empty — rather than blanking
 * anything else. Class component is required here: React has no hook
 * equivalent of getDerivedStateFromError/componentDidCatch.
 */
export class WebGLBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("IntroSequence: 3D scene failed to initialize, hiding it.", error);
    }
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
