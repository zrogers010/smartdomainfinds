import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server bundle (.next/standalone) for a lean,
  // low-memory deploy on a small EC2 instance. Run with `node server.js`.
  output: "standalone",
  // Don't advertise the framework.
  poweredByHeader: false,
  // Hide the on-screen Next.js dev tools indicator (dev-only UI; never ships to
  // production anyway).
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
