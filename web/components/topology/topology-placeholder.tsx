/**
 * Static, lightweight stand-in for the interactive infrastructure topology.
 *
 * The full version (react-force-graph-2d, Canvas + d3-force) will be loaded
 * via next/dynamic with { ssr: false } so it never blocks first paint, and
 * this static SVG snapshot doubles as the prefers-reduced-motion fallback.
 */
export function TopologyPlaceholder() {
  const nodes = [
    { cx: 120, cy: 90 },
    { cx: 260, cy: 60 },
    { cx: 400, cy: 110 },
    { cx: 200, cy: 200 },
    { cx: 340, cy: 220 },
    { cx: 470, cy: 180 },
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [3, 4],
    [4, 5],
    [2, 5],
    [1, 4],
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60"
    >
      <svg
        viewBox="0 0 560 280"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r="4"
            fill="var(--color-accent)"
          />
        ))}
      </svg>
    </div>
  );
}
