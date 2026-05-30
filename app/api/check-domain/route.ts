import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { CheckDomainRequestSchema } from "@/schemas/domain";
import { checkAvailability } from "@/lib/domain/availability";
import { normalizeDomain } from "@/lib/domain/utils";
import type { CheckDomainResponse } from "@/lib/domain/types";

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
    const { domains } = CheckDomainRequestSchema.parse(body);
    const resolved = await checkAvailability(domains);

    // Preserve request order.
    const results = domains.map((d) => {
      const key = normalizeDomain(d);
      return (
        resolved.get(key) ?? {
          domain: key,
          status: "error" as const,
          source: "unknown",
        }
      );
    });

    const response: CheckDomainResponse = { results };
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Please check the domains you provided.",
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 422 }
      );
    }

    console.error("[/api/check-domain] failed", err);
    return NextResponse.json(
      { error: "Could not check domain availability. Please try again." },
      { status: 500 }
    );
  }
}
