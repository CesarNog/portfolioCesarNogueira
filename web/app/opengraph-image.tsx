import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// No runtime export — defaults to edge, compatible with output: "export"
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#08090c",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Blue gradient accent */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Left: text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            gap: 0,
          }}
        >
          {/* Available badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} />
            <span style={{ fontFamily: "monospace", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.18em", color: "#34d399" }}>
              Available for global consulting
            </span>
          </div>

          {/* Name */}
          <div style={{ fontSize: 88, fontWeight: 700, color: "#edf0f3", lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 28 }}>
            Cesar<br />Nogueira.
          </div>

          {/* Role */}
          <div style={{ fontSize: 18, color: "#3b82f6", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 48 }}>
            {siteConfig.shortRole}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28 }}>
            {[
              { v: "11+", l: "Years in cloud" },
              { v: "40+", l: "Cloud projects" },
              { v: "$2.5M+", l: "Cost savings" },
              { v: "4", l: "Cloud providers" },
            ].map((s) => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#edf0f3" }}>{s.v}</span>
                <span style={{ fontSize: 11, color: "#788490", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* URL */}
          <div style={{ marginTop: "auto", paddingTop: 32, fontSize: 14, color: "#788490", fontFamily: "monospace" }}>
            cesarnogueira.tech
          </div>
        </div>

        {/* Right: monogram accent */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 160, color: "rgba(59,130,246,0.08)", fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1 }}>
            CN
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
