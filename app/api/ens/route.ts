import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { EnsRequestSchema } from "@/schemas/tools";
import { checkEns } from "@/lib/tools/ens";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "ens", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { name } = EnsRequestSchema.parse(body);
    const result = await checkEns(name);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Enter a name." }, { status: 422 });
    }
    console.error("[/api/ens] failed", err);
    return NextResponse.json({ error: "ENS lookup failed." }, { status: 500 });
  }
}
