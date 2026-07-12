import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090c",
        }}
      >
        <div style={{ display: "flex", fontSize: 104, fontWeight: 900, color: "#3b82f6", letterSpacing: "-0.06em" }}>
          CN
        </div>
      </div>
    ),
    { ...size },
  );
}
