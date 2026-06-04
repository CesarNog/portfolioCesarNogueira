import type { SVGProps } from "react";

/**
 * CN monogram — César A. Nogueira brand mark.
 * Two overlapping paths suggest connected infrastructure nodes.
 * Works at any size; accent color inherits from `color` prop.
 */
export function Logo({ size = 28, className = "" }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* Outer ring — faint infrastructure frame */}
      <circle
        cx="14"
        cy="14"
        r="12.5"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.25"
      />
      {/* C glyph — left arc */}
      <path
        d="M16.5 9C15.5 8.4 14.3 8 13 8C9.7 8 7 10.7 7 14C7 17.3 9.7 20 13 20C14.3 20 15.5 19.6 16.5 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* N glyph — right letterform */}
      <path
        d="M18 9V19M18 9L22 19M22 9V19"
        stroke="var(--color-blue)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Node dot — infrastructure accent */}
      <circle cx="14" cy="14" r="1.1" fill="var(--color-blue)" fillOpacity="0.5" />
    </svg>
  );
}
