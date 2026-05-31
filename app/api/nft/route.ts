import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { NftRequestSchema } from "@/schemas/tools";
import { lookupNft } from "@/lib/tools/nft";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "nft", 60, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { contract, tokenId, chain } = NftRequestSchema.parse(body);
    const result = await lookupNft(contract, tokenId, chain);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ error: msg }, { status: 422 });
    }
    console.error("[/api/nft] failed", err);
    return NextResponse.json({ error: "NFT lookup failed." }, { status: 500 });
  }
}
