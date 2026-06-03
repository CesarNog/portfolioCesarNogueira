import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og() {
  // Fetch portrait for the image panel
  const portraitUrl = `${siteConfig.url}/portrait.jpg`;
  let portraitData: string | null = null;
  try {
    const res = await fetch(portraitUrl);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const b64 = Buffer.from(buf).toString("base64");
      portraitData = `data:image/jpeg;base64,${b64}`;
    }
  } catch {
    // fallback: no portrait
  }

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
        {/* Subtle blue gradient top-left */}
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

        {/* Left content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 56px",
            gap: 0,
          }}
        >
          {/* Available badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34d399",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#34d399",
              }}
            >
              Available for global consulting
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: "#edf0f3",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              marginBottom: 28,
            }}
          >
            Cesar
            <br />
            Nogueira.
          </div>

          {/* Role line */}
          <div
            style={{
              fontSize: 18,
              color: "#3b82f6",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 40,
            }}
          >
            {siteConfig.shortRole}
          </div>

          {/* Stats strip */}
          <div
            style={{
              display: "flex",
              gap: 40,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 28,
            }}
          >
            {[
              { v: "11+", l: "Years in cloud" },
              { v: "40+", l: "Cloud projects" },
              { v: "$2.5M+", l: "Cost savings" },
              { v: "4", l: "Cloud providers" },
            ].map((s) => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: "#edf0f3" }}>{s.v}</span>
                <span style={{ fontSize: 11, color: "#788490", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 32,
              fontSize: 14,
              color: "#788490",
              fontFamily: "monospace",
            }}
          >
            cesarnogueira.tech
          </div>
        </div>

        {/* Right: portrait */}
        {portraitData && (
          <div
            style={{
              width: 340,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portraitData}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
            {/* Left fade */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #08090c 0%, rgba(8,9,12,0.3) 40%, transparent 100%)",
              }}
            />
          </div>
        )}

        {/* Right fallback: abstract grid when no portrait */}
        {!portraitData && (
          <div
            style={{
              width: 340,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 120,
                color: "rgba(59,130,246,0.12)",
                fontWeight: 900,
                letterSpacing: "-0.06em",
              }}
            >
              CN
            </div>
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
