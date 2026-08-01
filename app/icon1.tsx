import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon512() {
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
        <div style={{ display: "flex", fontSize: 296, fontWeight: 900, color: "#3b82f6", letterSpacing: "-0.06em" }}>
          CN
        </div>
      </div>
    ),
    { ...size },
  );
}
