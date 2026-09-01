import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Every post is written by César himself (no guest authors on this site),
// so this is a static byline rather than a per-post `author` field.
export function BlogAuthor() {
  return (
    <Link href="/" className="group flex items-center gap-4">
      <img
        src="/avatar.webp"
        alt=""
        aria-hidden
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-[var(--color-hairline)] transition-[box-shadow] group-hover:ring-[var(--accent)]"
      />
      <span>
        <span className="block text-base font-semibold text-[var(--color-fg)] transition-colors group-hover:text-accent">
          {siteConfig.name}
        </span>
        <span className="block text-sm text-[var(--color-fg-subtle)]">
          {siteConfig.shortRole}
        </span>
      </span>
    </Link>
  );
}
