import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Every post is written by César himself (no guest authors on this site),
// so this is a static byline rather than a per-post `author` field.
export function BlogAuthor() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <img
        src="/avatar.webp"
        alt=""
        aria-hidden
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
      <span>
        <span className="block text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-accent">
          {siteConfig.name}
        </span>
        <span className="block text-[13px] text-[var(--color-fg-subtle)]">
          {siteConfig.shortRole}
        </span>
      </span>
    </Link>
  );
}
