import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
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
          padding: "62px",
          color: "#f1eee8",
          background:
            "radial-gradient(circle at 72% 30%, #37332d 0%, #15171b 28%, #090a0c 70%)",
          border: "1px solid #393a3d",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23 }}>
          <span style={{ letterSpacing: "0.42em" }}>BRENYCH</span>
          <span style={{ color: "#a8a49c" }}>BARCELONA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "900px" }}>
          <div style={{ fontSize: 84, lineHeight: 0.98 }}>Objects for the Body</div>
          <div style={{ color: "#c7bda9", fontSize: 29 }}>
            Sculptural objects engineered for the body.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
