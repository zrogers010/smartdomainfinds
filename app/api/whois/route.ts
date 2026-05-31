import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { WhoisRequestSchema } from "@/schemas/tools";
import { lookupDomainInfo } from "@/lib/tools/whois";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "whois", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { domain } = WhoisRequestSchema.parse(body);
    const result = await lookupDomainInfo(domain);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Enter a valid domain (e.g. example.com)." },
        { status: 422 }
      );
    }
    console.error("[/api/whois] failed", err);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}
