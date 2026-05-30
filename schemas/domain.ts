import { z } from "zod";
import { DOMAIN_STYLES } from "@/lib/domain/types";

/** Zod enum mirroring the canonical DomainStyle union. */
export const domainStyleSchema = z.enum(DOMAIN_STYLES);

/**
 * Schema for a single name candidate produced by the AI model. Defaults are
 * generous so partial/imperfect model output still validates instead of being
 * discarded.
 */
export const GeneratedNameSchema = z.object({
  baseName: z.string().min(1),
  preferredDomain: z.string().min(1),
  style: domainStyleSchema.catch("brandable"),
  rationale: z.string().default(""),
  risks: z.array(z.string()).default([]),
  suggestedTlds: z.array(z.string()).default(["com"]),
  scoreInputs: z
    .object({
      brandability: z.number().min(0).max(10).catch(5),
      clarity: z.number().min(0).max(10).catch(5),
      memorability: z.number().min(0).max(10).catch(5),
      pronunciation: z.number().min(0).max(10).catch(5),
      spellingSimplicity: z.number().min(0).max(10).catch(5),
      seoRelevance: z.number().min(0).max(10).catch(5),
      premiumFeel: z.number().min(0).max(10).catch(5),
    })
    .default({
      brandability: 5,
      clarity: 5,
      memorability: 5,
      pronunciation: 5,
      spellingSimplicity: 5,
      seoRelevance: 5,
      premiumFeel: 5,
    }),
});

export type GeneratedName = z.infer<typeof GeneratedNameSchema>;

/** Wrapper schema for the full AI payload. */
export const GenerationPayloadSchema = z.object({
  names: z.array(GeneratedNameSchema).default([]),
});

/** POST /api/generate input. */
export const GenerateRequestSchema = z.object({
  idea: z
    .string({ message: "Please describe your idea." })
    .trim()
    .min(8, "Tell us a little more about your idea (at least 8 characters)."),
  industry: z.string().trim().max(80).optional(),
  tone: z.string().trim().max(80).optional(),
  styles: z.array(domainStyleSchema).optional(),
  tlds: z.array(z.string().trim().toLowerCase()).optional(),
  maxLength: z.number().int().min(3).max(40).optional(),
  mustInclude: z.array(z.string().trim()).optional(),
  avoidWords: z.array(z.string().trim()).optional(),
  onlyAvailableDotCom: z.boolean().optional(),
});

export type GenerateRequestInput = z.infer<typeof GenerateRequestSchema>;

/** POST /api/check-domain input. */
export const CheckDomainRequestSchema = z.object({
  domains: z
    .array(z.string().trim().min(1))
    .min(1, "Provide at least one domain to check.")
    .max(100, "Too many domains in a single request."),
});

export type CheckDomainRequestInput = z.infer<typeof CheckDomainRequestSchema>;

/** POST /api/generate-more-like-this input. */
export const GenerateMoreRequestSchema = z.object({
  originalDomain: z.string().trim().min(1),
  idea: z.string().trim().min(1),
  style: domainStyleSchema,
});

export type GenerateMoreRequestInput = z.infer<
  typeof GenerateMoreRequestSchema
>;

/**
 * Safely parse arbitrary AI output into validated candidate names. Never
 * throws: returns an empty list when the payload is unusable so callers can
 * fall back to demo data.
 */
export function safeParseGeneratedNames(raw: unknown): GeneratedName[] {
  // Accept either { names: [...] } or a bare array.
  const candidate = Array.isArray(raw) ? { names: raw } : raw;
  const parsed = GenerationPayloadSchema.safeParse(candidate);
  if (!parsed.success) return [];

  // Drop any individual entries that still fail validation.
  return parsed.data.names.filter((n): n is GeneratedName => Boolean(n));
}
