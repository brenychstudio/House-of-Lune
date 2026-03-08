import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          color: "#f5f2eb",
          background: "radial-gradient(circle at 20% 10%, #2f3138 0%, #0a0b0f 45%, #07080b 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.78 }}>House of Lune</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "820px" }}>
          <div style={{ fontSize: 68, lineHeight: 1.05 }}>Luxury Jewelry Maison</div>
          <div style={{ fontSize: 30, lineHeight: 1.3, color: "rgba(245,242,235,0.86)" }}>
            Contemporary high jewelry shaped in shadow, precision, and deliberate restraint.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
