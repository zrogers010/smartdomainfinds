import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { WalletRequestSchema } from "@/schemas/tools";
import { checkWallet } from "@/lib/tools/wallet";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "wallet", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { address, chain } = WalletRequestSchema.parse(body);
    const result = await checkWallet(address, chain);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ error: msg }, { status: 422 });
    }
    console.error("[/api/wallet] failed", err);
    return NextResponse.json({ error: "Wallet lookup failed." }, { status: 500 });
  }
}
