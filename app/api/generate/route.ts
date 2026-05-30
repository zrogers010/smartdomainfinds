import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { GenerateRequestSchema } from "@/schemas/domain";
import { generateDomainCandidates } from "@/lib/ai/generate-domain-candidates";
import { assembleDomainResults } from "@/lib/domain/availability";
import { getAvailabilityProvider } from "@/lib/domain/provider";
import { correctText } from "@/lib/domain/spellcheck";
import type { GenerateResponse } from "@/lib/domain/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

    // Fix likely misspellings in the idea so generated names use correct words.
    const { corrected, corrections } = correctText(request.idea);
    const effectiveRequest =
      corrections.length > 0 ? { ...request, idea: corrected } : request;

    const { names, usedFallback } =
      await generateDomainCandidates(effectiveRequest);
    const { results, checkedCount } = await assembleDomainResults(
      names,
      effectiveRequest,
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
        correctedIdea: corrections.length > 0 ? corrected : undefined,
        corrections: corrections.length > 0 ? corrections : undefined,
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
