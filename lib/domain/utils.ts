import { SUPPORTED_TLDS } from "@/lib/domain/types";

/**
 * Deterministic, fast 32-bit string hash (FNV-1a variant). Used to make the
 * mock provider stable and to derive deterministic pseudo-random values for
 * UI testing.
 */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Force unsigned 32-bit.
  return hash >>> 0;
}

/** A stable [0,1) pseudo-random number seeded by a string. */
export function seededUnit(input: string): number {
  return hashString(input) / 0xffffffff;
}

const ILLEGAL_DOMAIN_CHARS = /[^a-z0-9-.]/g;

/**
 * Normalize a raw domain string for availability checks: lowercase, trim,
 * strip protocol/path, collapse spaces, and remove illegal characters.
 * Preserves a single trailing TLD.
 */
export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "");
  value = value.split("/")[0];
  // Spaces inside the label are removed (e.g. "my brand .com" -> "mybrand.com").
  value = value.replace(/\s+/g, "");
  value = value.replace(ILLEGAL_DOMAIN_CHARS, "");
  // Collapse repeated dots and trim stray dots/hyphens at the edges.
  value = value.replace(/\.{2,}/g, ".").replace(/^[.-]+|[.-]+$/g, "");
  return value;
}

/** Extract the TLD (last label) from a domain. Returns "" if none. */
export function extractTld(domain: string): string {
  const normalized = normalizeDomain(domain);
  const parts = normalized.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

/** The label portion (everything before the TLD). */
export function extractLabel(domain: string): string {
  const normalized = normalizeDomain(domain);
  const tld = extractTld(normalized);
  if (!tld) return normalized;
  return normalized.slice(0, normalized.length - tld.length - 1);
}

export function hasHyphen(value: string): boolean {
  return value.includes("-");
}

export function hasNumber(value: string): boolean {
  return /[0-9]/.test(value);
}

/**
 * Whether the label is "too long" for a memorable brand. Defaults to 15 chars,
 * which comfortably fits names like "smartdomainfinds" while flagging the
 * worst keyword-stuffed offenders.
 */
export function isTooLong(label: string, max = 15): boolean {
  return label.replace(/[^a-z0-9]/gi, "").length > max;
}

/**
 * Rough syllable estimate based on vowel groups. Not linguistically perfect,
 * but stable and good enough for scoring heuristics.
 */
export function countSyllableEstimate(label: string): number {
  const word = label.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const groups = word.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;
  // Silent trailing "e" rarely adds a syllable.
  if (word.endsWith("e") && count > 1) count -= 1;
  return Math.max(1, count);
}

const AWKWARD_PATTERNS: RegExp[] = [
  /(.)\1{2,}/, // 3+ repeated chars: "brrr"
  /[bcdfghjklmnpqrstvwxz]{5,}/i, // 5+ consonants in a row
  /(zz|xx|qq|kk|jj)/i, // doubled rare letters
  /[xz]{2,}/i,
];

/** Heuristic: does the label look hard to spell from hearing it? */
export function hasAwkwardSpelling(label: string): boolean {
  const word = label.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return false;
  return AWKWARD_PATTERNS.some((re) => re.test(word));
}

/**
 * The "radio test": could someone spell this correctly after only hearing it?
 * Penalizes awkward spelling, hyphens, numbers, excessive length, and too many
 * syllables.
 */
export function passesRadioTest(label: string): boolean {
  if (hasHyphen(label) || hasNumber(label)) return false;
  if (hasAwkwardSpelling(label)) return false;
  if (countSyllableEstimate(label) > 4) return false;
  if (isTooLong(label, 18)) return false;
  return true;
}

const SPAMMY_WORDS = [
  "best",
  "cheap",
  "free",
  "online",
  "deals",
  "discount",
  "buy",
  "shop247",
  "xxx",
  "crypto",
  "token",
  "coin",
];

export function hasSpammyWord(label: string): boolean {
  const lower = label.toLowerCase();
  return SPAMMY_WORDS.some((w) => lower.includes(w));
}

const GENERIC_WORDS = [
  "solutions",
  "services",
  "global",
  "world",
  "group",
  "company",
  "online",
  "web",
  "site",
];

export function looksOverlyGeneric(label: string): boolean {
  const lower = label.toLowerCase();
  return GENERIC_WORDS.some((w) => lower.includes(w));
}

const FAMOUS_BRANDS = [
  "google",
  "apple",
  "amazon",
  "facebook",
  "meta",
  "microsoft",
  "openai",
  "netflix",
  "twitter",
  "tesla",
  "nvidia",
  "youtube",
  "instagram",
  "tiktok",
  "spotify",
];

/** Flags names that embed a famous brand (likely trademark/confusion risk). */
export function looksTrademarkRisky(label: string): boolean {
  const lower = label.toLowerCase();
  return FAMOUS_BRANDS.some((brand) => lower.includes(brand));
}

/**
 * Deduplicate a list of domains by their normalized form, preserving the first
 * occurrence (and its original display casing).
 */
export function dedupeDomains<T extends string>(domains: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const d of domains) {
    const key = normalizeDomain(d);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }
  return out;
}

/**
 * Build an outbound registrar search URL. Defaults to Namecheap's search page.
 * Later this can be swapped for affiliate links per registrar.
 */
export function getRegistrarSearchUrl(domain: string): string {
  const normalized = normalizeDomain(domain);
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(
    normalized
  )}`;
}

/** Whether a TLD string is one we support generating/checking. */
export function isSupportedTld(tld: string): boolean {
  return (SUPPORTED_TLDS as readonly string[]).includes(tld.toLowerCase());
}
