import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { BulkCheckRequestSchema } from "@/schemas/tools";
import { checkAvailability } from "@/lib/domain/availability";
import { getRegistrarSearchUrl, normalizeDomain } from "@/lib/domain/utils";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import type { BulkCheckResult, BulkCheckRow } from "@/lib/tools/types";
import type { DomainAvailabilityStatus } from "@/lib/domain/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "bulk-check", 30, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { domains } = BulkCheckRequestSchema.parse(body);

    // Normalize, keep only entries that look like real domains (have a TLD),
    // dedupe while preserving order.
    const seen = new Set<string>();
    const cleaned: string[] = [];
    for (const raw of domains) {
      const normalized = normalizeDomain(raw);
      if (!normalized.includes(".")) continue;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      cleaned.push(normalized);
    }

    const availability = await checkAvailability(cleaned);

    const rows: BulkCheckRow[] = cleaned.map((domain) => {
      const status: DomainAvailabilityStatus =
        availability.get(domain)?.status ?? "unknown";
      return { domain, status, registrarUrl: getRegistrarSearchUrl(domain) };
    });

    const result: BulkCheckResult = { rows, checkedCount: rows.length };
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Provide 1–50 domains to check." },
        { status: 422 }
      );
    }
    console.error("[/api/bulk-check] failed", err);
    return NextResponse.json({ error: "Bulk check failed." }, { status: 500 });
  }
}
