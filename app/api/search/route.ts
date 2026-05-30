import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SearchRequestSchema } from "@/schemas/domain";
import { buildSearchCandidates } from "@/lib/domain/search-candidates";
import {
  buildResultFromAvailability,
  checkAvailability,
} from "@/lib/domain/availability";
import { normalizeDomain } from "@/lib/domain/utils";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import type {
  DomainAvailabilityResult,
  SearchResponse,
} from "@/lib/domain/types";

export const runtime = "nodejs";

/**
 * Instant domain search. Candidate generation (incl. the thesaurus-driven
 * variations) and deterministic scoring run here on the server, so none of that
 * logic ships in the client bundle. The browser only sends the raw query and
 * renders the finished results.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "search", 180, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  try {
    const { query, part } = SearchRequestSchema.parse(body);
    const candidates = buildSearchCandidates(query);
    const label = candidates.query.label;

    if (!label) {
      const empty: SearchResponse =
        part === "primary"
          ? { label: "", primary: null }
          : { label: "", exact: [], variations: [] };
      return NextResponse.json(empty);
    }

    const toResult = (
      domain: string,
      avail: Map<string, DomainAvailabilityResult>
    ) =>
      buildResultFromAvailability(
        avail.get(normalizeDomain(domain)) ?? {
          domain,
          status: "unknown",
          source: "unknown",
        }
      );

    if (part === "primary") {
      const primaryDomain = candidates.query.primaryDomain;
      const avail = await checkAvailability([primaryDomain]);
      const res: SearchResponse = {
        label,
        primary: toResult(primaryDomain, avail),
      };
      return NextResponse.json(res);
    }

    // part === "rest": all other extensions + brandable variations.
    const exactRest = candidates.exact.slice(1);
    const avail = await checkAvailability([
      ...exactRest,
      ...candidates.variations,
    ]);
    const res: SearchResponse = {
      label,
      exact: exactRest.map((d) => toResult(d, avail)),
      variations: candidates.variations.map((d) => toResult(d, avail)),
    };
    return NextResponse.json(res);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid search query." },
        { status: 422 }
      );
    }
    console.error("[/api/search] failed", err);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
