import {
  DOMAIN_STYLES,
  DOMAIN_STYLE_LABELS,
  type GenerateRequest,
} from "@/lib/domain/types";

export const DOMAIN_GENERATION_SYSTEM_PROMPT = `You are an expert startup namer, domain investor, brand strategist, linguist, and SEO strategist.

Generate domain name candidates for the user's business idea.

Prioritize names that are:
- Memorable
- Easy to spell
- Easy to pronounce
- Brandable
- Relevant to the idea
- Not overly generic
- Not obviously trademark-infringing
- Suitable for a serious business
- Strong when spoken aloud
- Good as a .com when possible

Avoid:
- Hyphens unless specifically requested
- Numbers unless specifically requested
- Awkward spellings
- Overly long names
- Names too similar to major brands
- Names that sound spammy
- Names that sound like crypto scams unless the user asks for crypto
- Names that rely on obscure puns
- Names with unclear pronunciation
- Names that are hard to remember
- Names that feel cheap

Return structured JSON only.
Do not claim a domain is available.
Availability will be checked by a separate service.

Output a JSON object of this exact shape:
{
  "names": [
    {
      "baseName": "PromptPulse",
      "preferredDomain": "promptpulse.com",
      "style": "brandable",
      "rationale": "Short, memorable, clearly tied to AI/productivity.",
      "risks": ["The word 'prompt' anchors the brand to the current AI era."],
      "suggestedTlds": ["com", "ai"],
      "scoreInputs": {
        "brandability": 9,
        "clarity": 8,
        "memorability": 9,
        "pronunciation": 9,
        "spellingSimplicity": 9,
        "seoRelevance": 6,
        "premiumFeel": 8
      }
    }
  ]
}

- "style" must be one of: ${DOMAIN_STYLES.join(", ")}.
- All scoreInputs are integers from 0 to 10.
- "baseName" preserves nice display casing (e.g. "PromptPulse").
- Generate diverse candidates spanning the requested styles.
- Produce between 18 and 24 distinct candidates.`;

/** Build the user prompt from the validated request + preferences. */
export function buildDomainGenerationUserPrompt(
  request: GenerateRequest
): string {
  const lines: string[] = [];
  lines.push(`Business idea: ${request.idea}`);

  if (request.industry) lines.push(`Industry: ${request.industry}`);
  if (request.tone) lines.push(`Desired tone: ${request.tone}`);

  if (request.styles?.length) {
    const labels = request.styles
      .map((s) => DOMAIN_STYLE_LABELS[s] ?? s)
      .join(", ");
    lines.push(`Preferred name styles: ${labels}`);
    if (!request.styles.includes("domain_hack")) {
      lines.push("Do NOT use domain hacks (clever TLD spellings).");
    }
  } else {
    lines.push(
      "Preferred name styles: a healthy mix of brandable, descriptive, premium, and short. Avoid domain hacks unless they are clearly excellent."
    );
  }

  if (request.tlds?.length) {
    lines.push(`Preferred TLDs (prioritize .com): ${request.tlds.join(", ")}`);
  }

  if (typeof request.maxLength === "number") {
    lines.push(
      `Keep the base name at or under ${request.maxLength} characters.`
    );
  }

  if (request.mustInclude?.length) {
    lines.push(
      `Try to incorporate these words/themes where natural: ${request.mustInclude.join(
        ", "
      )}.`
    );
  }

  if (request.avoidWords?.length) {
    lines.push(`Avoid these words entirely: ${request.avoidWords.join(", ")}.`);
  }

  if (request.onlyAvailableDotCom) {
    lines.push(
      "The user strongly prefers .com domains. Favor base names likely to have an available .com."
    );
  }

  lines.push(
    "Return only the JSON object described in the system prompt. No prose, no markdown."
  );

  return lines.join("\n");
}
