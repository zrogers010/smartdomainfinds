import { NextResponse } from "next/server";

import { correctText } from "@/lib/domain/spellcheck";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const MAX_LENGTH = 600;

/** Spell-check free text for the "Did you mean?" hint under the idea field. */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "spellcheck", 120, 60_000);
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

  const text =
    typeof (body as { text?: unknown })?.text === "string"
      ? (body as { text: string }).text
      : "";

  if (!text || text.length > MAX_LENGTH) {
    return NextResponse.json({ corrected: text, corrections: [] });
  }

  const { corrected, corrections } = correctText(text);
  return NextResponse.json({ corrected, corrections });
}
