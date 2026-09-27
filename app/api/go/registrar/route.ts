import { NextRequest, NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/domain/utils";

export const runtime = "edge";

/**
 * First-party redirect wrapper for registrar links (W1-03).
 * - Logs outbound clicks (structured console log, analytics-friendly).
 * - Redirects to Namecheap with affiliate params when env is set.
 * - Returns 302 so search engines don't index the redirect.
 *
 * Required env vars (when affiliate is enabled):
 * - NAMECHEAP_AFFILIATE_ID: Your Namecheap affiliate ID
 * - NAMECHEAP_USERNAME: Your Namecheap username (affiliate tracking)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() };
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Missing required parameter: domain" },
      { status: 400 }
    );
  }

  const normalized = normalizeDomain(domain);
  if (!normalized) {
    return NextResponse.json(
      { error: "Invalid domain format" },
      { status: 400 }
    );
  }

  // Structured log for analytics/monitoring (can be ingested by log aggregators).
  const logEntry = {
    event: "registrar_outbound_click",
    timestamp: new Date().toISOString(),
    domain: normalized,
    registrar: "namecheap",
    affiliated: !!(
      process.env.NAMECHEAP_AFFILIATE_ID && process.env.NAMECHEAP_USERNAME
    ),
    userAgent: request.headers.get("user-agent") || "unknown",
    referer: request.headers.get("referer") || "direct",
  };

  console.log(JSON.stringify(logEntry));

  // Build Namecheap URL with affiliate params if env vars are present.
  const baseUrl = "https://www.namecheap.com/domains/registration/results/";
  const url = new URL(baseUrl);
  url.searchParams.set("domain", normalized);

  if (process.env.NAMECHEAP_AFFILIATE_ID && process.env.NAMECHEAP_USERNAME) {
    url.searchParams.set("affid", process.env.NAMECHEAP_AFFILIATE_ID);
    url.searchParams.set("aff", process.env.NAMECHEAP_USERNAME);
  }

  // 302 redirect (temporary, tells search engines not to index).
  return NextResponse.redirect(url.toString(), { status: 302 });
}
