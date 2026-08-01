import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center px-6 py-5 border-b border-[var(--color-hairline)]">
        <Link href="/" aria-label="Return to home">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="font-mono text-5xl font-bold text-[var(--color-blue)] tabular-nums">
          404
        </p>
        <h1 className="font-heading text-2xl font-semibold text-[var(--color-fg)]">
          Page not found
        </h1>
        <p className="max-w-sm text-[var(--color-fg-subtle)] text-sm leading-relaxed">
          This URL doesn&apos;t exist. It may have been moved, deleted, or you may have followed a broken link.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--color-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]"
        >
          ← Return home
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
