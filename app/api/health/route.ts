import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight liveness probe for monitoring / load balancers. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    provider: process.env.DOMAIN_PROVIDER ?? "rdap",
    aiEnabled: Boolean(process.env.OPENAI_API_KEY),
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
