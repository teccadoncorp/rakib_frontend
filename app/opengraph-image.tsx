import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Digital Service — Your Digital Partner in Jaynagar";
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
          background: "linear-gradient(135deg, #071938 0%, #0d6efd 100%)",
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7dd3fc",
            fontWeight: 700,
          }}
        >
          Jaynagar · South 24 Parganas
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>Digital Service</div>
          <div style={{ fontSize: 32, marginTop: 16, color: "#dbeafe", fontWeight: 500 }}>
            AEPS · GST · PAN · Tax · PVC Cards
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#cbd5e1" }}>
          <span>Your Digital Partner</span>
          <span>7872292614</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
