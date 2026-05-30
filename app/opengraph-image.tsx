import { ImageResponse } from "next/og";

export const alt = "SmartDomainFinds — AI Domain Name Generator & Availability Checker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated social share image (Open Graph + Twitter). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 600px at 80% -10%, #312e81 0%, #0a0a0a 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
              borderRadius: 22,
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#c7d2fe" }}>
            SmartDomainFinds
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 980,
            letterSpacing: -1,
          }}
        >
          Find the smartest available domain for your next idea.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#a1a1aa",
            maxWidth: 900,
          }}
        >
          AI-generated names · real-time availability · a Smart Score for every option
        </div>
      </div>
    ),
    { ...size }
  );
}
