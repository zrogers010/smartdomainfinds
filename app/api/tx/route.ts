import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { TxRequestSchema } from "@/schemas/tools";
import { checkTx } from "@/lib/tools/tx";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "tx", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { hash, chain } = TxRequestSchema.parse(body);
    const result = await checkTx(hash, chain);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ error: msg }, { status: 422 });
    }
    console.error("[/api/tx] failed", err);
    return NextResponse.json({ error: "Transaction lookup failed." }, { status: 500 });
  }
}
