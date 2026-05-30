import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { GenerateMoreRequestSchema } from "@/schemas/domain";
import { generateDomainCandidates } from "@/lib/ai/generate-domain-candidates";
import { assembleDomainResults } from "@/lib/domain/availability";
import { normalizeDomain } from "@/lib/domain/utils";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import type { GenerateMoreResponse, GenerateRequest } from "@/lib/domain/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "generate-more", 30, 60_000);
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
    const { originalDomain, idea, style } =
      GenerateMoreRequestSchema.parse(body);

    // Bias the generator toward the chosen style and nudge it to riff on the
    // original name.
    const request: GenerateRequest = {
      idea: `${idea}\n\nGenerate names in a similar spirit to "${originalDomain}".`,
      styles: [style],
    };

    const { names } = await generateDomainCandidates(request);
    const { results } = await assembleDomainResults(names, request, {
      limit: 9,
    });

    const original = normalizeDomain(originalDomain);
    const filtered = results.filter((r) => r.domain !== original);

    const response: GenerateMoreResponse = { results: filtered.slice(0, 8) };
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Please check your input.",
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 422 }
      );
    }

    console.error("[/api/generate-more-like-this] failed", err);
    return NextResponse.json(
      { error: "Could not generate more names. Please try again." },
      { status: 500 }
    );
  }
}
