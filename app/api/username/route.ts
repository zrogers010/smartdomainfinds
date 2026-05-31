import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UsernameRequestSchema } from "@/schemas/tools";
import { checkUsernames } from "@/lib/tools/username";
import { enforceRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "username", 40, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const { username } = UsernameRequestSchema.parse(body);
    const result = await checkUsernames(username);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Enter a valid username." },
        { status: 422 }
      );
    }
    console.error("[/api/username] failed", err);
    return NextResponse.json({ error: "Check failed." }, { status: 500 });
  }
}
