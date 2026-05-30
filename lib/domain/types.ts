/**
 * Core domain types shared across the generation, scoring, and availability
 * layers. Kept framework-agnostic so they can be reused on the server and the
 * client.
 */

export const DOMAIN_STYLES = [
  "brandable",
  "descriptive",
  "premium",
  "seo",
  "playful",
  "short",
  "domain_hack",
] as const;

export type DomainStyle = (typeof DOMAIN_STYLES)[number];

export const DOMAIN_STYLE_LABELS: Record<DomainStyle, string> = {
  brandable: "Brandable",
  descriptive: "Descriptive",
  premium: "Premium",
  seo: "SEO",
  playful: "Playful",
  short: "Short",
  domain_hack: "Domain hack",
};

/**
 * TLDs the generator tests + the instant search checks, in rough popularity
 * order (.com first). Most resolve to a trusted RDAP server; .io/.co have no
 * RDAP and will show as "unknown" (we never fake their availability).
 */
export const SUPPORTED_TLDS = [
  "com",
  "ai",
  "io",
  "app",
  "dev",
  "xyz",
  "co",
  "org",
  "tech",
  "net",
  "online",
  "store",
] as const;
export type SupportedTld = (typeof SUPPORTED_TLDS)[number];

export type DomainAvailabilityStatus =
  | "available"
  | "taken"
  | "premium"
  | "unknown"
  | "checking"
  | "error";

export type DomainPrice = {
  amount: number;
  currency: string;
  period: "year";
};

/** Raw result returned by an availability provider for a single domain. */
export type DomainAvailabilityResult = {
  domain: string;
  status: DomainAvailabilityStatus;
  price?: DomainPrice;
  /** Identifier of the provider that produced this result. */
  source: string;
};

export type DomainScoreBreakdown = {
  availability: number;
  brandability: number;
  clarity: number;
  memorability: number;
  pronunciation: number;
  spelling: number;
  seo: number;
  premiumFeel: number;
};

export type DomainResult = {
  id: string;
  baseName: string;
  domain: string;
  tld: string;
  style: DomainStyle;
  availability: DomainAvailabilityStatus;
  price?: DomainPrice;
  registrarUrl?: string;
  smartScore: number;
  scores: DomainScoreBreakdown;
  rationale: string;
  risks: string[];
  alternatives: string[];
};

/** A single spelling fix applied to the user's idea, e.g. miediavel -> medieval. */
export type SpellingCorrection = { from: string; to: string };

export type GenerateMetadata = {
  generatedCount: number;
  checkedCount: number;
  provider: string;
  /** True when results came from the seeded demo generator (no AI key). */
  usedFallback: boolean;
  /** The idea text after spelling correction, present only when something changed. */
  correctedIdea?: string;
  /** Individual spelling fixes applied to the idea. */
  corrections?: SpellingCorrection[];
};

export type GenerateResponse = {
  queryId: string;
  results: DomainResult[];
  metadata: GenerateMetadata;
};

export type CheckDomainResponse = {
  results: DomainAvailabilityResult[];
};

export type GenerateMoreResponse = {
  results: DomainResult[];
};

/** Normalized request used internally after Zod validation. */
export type GenerateRequest = {
  idea: string;
  industry?: string;
  tone?: string;
  styles?: DomainStyle[];
  tlds?: string[];
  maxLength?: number;
  mustInclude?: string[];
  avoidWords?: string[];
  onlyAvailableDotCom?: boolean;
};
