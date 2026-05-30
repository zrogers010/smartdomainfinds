import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { GenerateRequestSchema } from "@/schemas/domain";
import { generateDomainCandidates } from "@/lib/ai/generate-domain-candidates";
import { assembleDomainResults } from "@/lib/domain/availability";
import { getAvailabilityProvider } from "@/lib/domain/provider";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import type { GenerateResponse } from "@/lib/domain/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "generate", 30, 60_000);
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
    const request = GenerateRequestSchema.parse(body);

    const { names, usedFallback } = await generateDomainCandidates(request);
    const { results, checkedCount } = await assembleDomainResults(
      names,
      request,
      { limit: 36 }
    );

    const provider = await getAvailabilityProvider();

    const response: GenerateResponse = {
      queryId: crypto.randomUUID(),
      results,
      metadata: {
        generatedCount: names.length,
        checkedCount,
        provider: provider.name,
        usedFallback,
      },
    };

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

    console.error("[/api/generate] failed", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong while generating domains. Please try again.",
      },
      { status: 500 }
    );
  }
}
