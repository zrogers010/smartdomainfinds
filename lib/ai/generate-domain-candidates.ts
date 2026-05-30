import { chatCompletion, isAiConfigured } from "@/lib/ai/client";
import {
  DOMAIN_GENERATION_SYSTEM_PROMPT,
  buildDomainGenerationUserPrompt,
} from "@/lib/ai/domain-generation-prompt";
import { generateDemoNames } from "@/lib/ai/demo-data";
import { safeParseGeneratedNames, type GeneratedName } from "@/schemas/domain";
import type { GenerateRequest } from "@/lib/domain/types";

export type CandidateResult = {
  names: GeneratedName[];
  /** True when results came from the seeded demo generator. */
  usedFallback: boolean;
};

/** Attempt to extract a JSON object/array from a possibly-noisy string. */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // The model may have wrapped JSON in prose or markdown fences.
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1]);
      } catch {
        /* fall through */
      }
    }
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
      } catch {
        /* fall through */
      }
    }
    return null;
  }
}

/**
 * Generate domain name candidates for a request. Tries the configured LLM
 * first; on missing key, network/parse failure, or empty output, falls back to
 * the deterministic demo generator. Never throws — always returns usable names.
 */
export async function generateDomainCandidates(
  request: GenerateRequest,
  options: { signal?: AbortSignal } = {}
): Promise<CandidateResult> {
  if (!isAiConfigured()) {
    return { names: generateDemoNames(request), usedFallback: true };
  }

  try {
    const raw = await chatCompletion({
      messages: [
        { role: "system", content: DOMAIN_GENERATION_SYSTEM_PROMPT },
        { role: "user", content: buildDomainGenerationUserPrompt(request) },
      ],
      temperature: 0.85,
      jsonMode: true,
      signal: options.signal,
    });

    const parsed = extractJson(raw);
    const names = safeParseGeneratedNames(parsed);

    if (names.length === 0) {
      // Malformed or empty AI output — recover with demo data.
      return { names: generateDemoNames(request), usedFallback: true };
    }

    return { names, usedFallback: false };
  } catch {
    // Network error, rate limit, or any other failure — recover gracefully.
    return { names: generateDemoNames(request), usedFallback: true };
  }
}
