import { ImageResponse } from "next/og";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

/** Generated app icon / favicon: an "S" monogram on the brand gradient. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
          color: "#ffffff",
          fontSize: 180,
          fontWeight: 700,
          borderRadius: 56,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
