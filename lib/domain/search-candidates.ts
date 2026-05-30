import { SUPPORTED_TLDS } from "@/lib/domain/types";
import { normalizeDomain } from "@/lib/domain/utils";

/**
 * Prefixes/suffixes used to generate brandable variations of a searched name,
 * in the spirit of an instant domain search ("trymybrand.com", "mybrandhq.com").
 */
const PREFIXES = [
  "get",
  "try",
  "use",
  "my",
  "go",
  "join",
  "the",
  "meet",
  "hey",
  "we",
];

const SUFFIXES = [
  "app",
  "hq",
  "hub",
  "labs",
  "studio",
  "cloud",
  "tech",
  "team",
  "site",
  "group",
  "now",
  "io",
];

const MAX_VARIATIONS = 12;

export type ParsedQuery = {
  /** Sanitized label (no dots/spaces), e.g. "smartdomainfinds". */
  label: string;
  /** TLD the user explicitly typed, if any (may be unsupported). */
  requestedTld?: string;
  /** The exact domain the user is searching for, e.g. "smartdomainfinds.com". */
  primaryDomain: string;
};

/** Parse a raw query into a label + the primary domain to feature. */
export function parseSearchQuery(raw: string): ParsedQuery {
  const normalized = normalizeDomain(raw);
  let label = normalized;
  let requestedTld: string | undefined;

  if (normalized.includes(".")) {
    const parts = normalized.split(".");
    requestedTld = parts[parts.length - 1] || undefined;
    // Collapse any subdomains into a single label.
    label = parts.slice(0, -1).join("");
  }

  label = label.replace(/[^a-z0-9-]/g, "");
  const primaryDomain = label ? `${label}.${requestedTld ?? "com"}` : "";

  return { label, requestedTld, primaryDomain };
}

export type SearchCandidates = {
  query: ParsedQuery;
  /** The exact name across supported TLDs (primary/requested TLD first). */
  exact: string[];
  /** Brandable variations, all .com. */
  variations: string[];
};

/** Build exact-match + variation domain candidates for a raw search query. */
export function buildSearchCandidates(raw: string): SearchCandidates {
  const query = parseSearchQuery(raw);
  const { label, requestedTld } = query;

  if (!label) {
    return { query, exact: [], variations: [] };
  }

  // Exact match across TLDs, with the requested/primary TLD first.
  const tlds = [...SUPPORTED_TLDS] as string[];
  const exactSet: string[] = [];
  const primaryTld = requestedTld ?? "com";
  if (!tlds.includes(primaryTld)) exactSet.push(`${label}.${primaryTld}`);
  if (tlds.includes(primaryTld)) {
    exactSet.push(`${label}.${primaryTld}`);
  }
  for (const t of tlds) {
    const domain = `${label}.${t}`;
    if (!exactSet.includes(domain)) exactSet.push(domain);
  }

  // Variations (.com), excluding the exact .com itself.
  const variationSet = new Set<string>();
  for (const p of PREFIXES) variationSet.add(`${p}${label}.com`);
  for (const s of SUFFIXES) variationSet.add(`${label}${s}.com`);
  variationSet.delete(`${label}.com`);

  const variations = [...variationSet].slice(0, MAX_VARIATIONS);

  return { query, exact: exactSet, variations };
}
