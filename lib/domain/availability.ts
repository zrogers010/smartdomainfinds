import { getAvailabilityProvider } from "@/lib/domain/provider";
import { calculateSmartScore, type ScoreInputs } from "@/lib/domain/scoring";
import type {
  DomainAvailabilityResult,
  DomainResult,
  GenerateRequest,
} from "@/lib/domain/types";
import { SUPPORTED_TLDS } from "@/lib/domain/types";
import {
  dedupeDomains,
  extractLabel,
  extractTld,
  getRegistrarSearchUrl,
  hashString,
  isSupportedTld,
  normalizeDomain,
} from "@/lib/domain/utils";
import type { GeneratedName } from "@/schemas/domain";

const MAX_CANDIDATES = 50;
const MAX_TLDS_PER_NAME = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Tiny in-memory availability cache. Avoids re-checking the same domain across
 * requests within a single server instance.
 *
 * TODO(cache): replace with a shared cache (Redis / Upstash) so results are
 * consistent across serverless instances and survive cold starts.
 */
const availabilityCache = new Map<
  string,
  { result: DomainAvailabilityResult; expires: number }
>();

function readCache(domain: string): DomainAvailabilityResult | undefined {
  const hit = availabilityCache.get(domain);
  if (!hit) return undefined;
  if (hit.expires < Date.now()) {
    availabilityCache.delete(domain);
    return undefined;
  }
  return hit.result;
}

function writeCache(result: DomainAvailabilityResult) {
  availabilityCache.set(result.domain, {
    result,
    expires: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Check a batch of domains via the active provider, using the in-memory cache
 * and deduplicating so we never check the same domain twice in one request.
 */
export async function checkAvailability(
  domains: string[]
): Promise<Map<string, DomainAvailabilityResult>> {
  const provider = await getAvailabilityProvider();
  const normalized = dedupeDomains(domains.map(normalizeDomain).filter(Boolean));

  const resolved = new Map<string, DomainAvailabilityResult>();
  const toCheck: string[] = [];

  for (const domain of normalized) {
    const cached = readCache(domain);
    if (cached) resolved.set(domain, cached);
    else toCheck.push(domain);
  }

  if (toCheck.length > 0) {
    const results = await provider.checkDomains(toCheck);
    for (const result of results) {
      writeCache(result);
      resolved.set(result.domain, result);
    }
  }

  return resolved;
}

/**
 * Build a DomainResult from a raw availability result (used by the instant
 * domain search, which has no AI quality inputs). Scores use neutral inputs so
 * the deterministic scorer still reflects availability + name heuristics, and
 * the item is compatible with the shared shortlist + CSV export.
 */
export function buildResultFromAvailability(
  avail: DomainAvailabilityResult,
  opts: { style?: DomainResult["style"] } = {}
): DomainResult {
  const domain = normalizeDomain(avail.domain);
  const tld = extractTld(domain) || "com";
  const label = extractLabel(domain);
  const style = opts.style ?? "brandable";

  const { smartScore, scores } = calculateSmartScore({
    domain,
    status: avail.status,
    price: avail.price,
    inputs: {
      brandability: 6,
      clarity: 6,
      memorability: 6,
      pronunciation: 6,
      spellingSimplicity: 6,
      seoRelevance: 5,
      premiumFeel: 6,
    },
    style,
  });

  return {
    id: hashString(domain).toString(36),
    baseName: label,
    domain,
    tld,
    style,
    availability: avail.status,
    price: avail.price,
    registrarUrl: getRegistrarSearchUrl(domain),
    smartScore,
    scores,
    rationale: "Direct domain search result.",
    risks: [],
    alternatives: [],
  };
}

function chooseTlds(name: GeneratedName, request: GenerateRequest): string[] {
  const requested = (request.tlds ?? [])
    .map((t) => t.toLowerCase())
    .filter(isSupportedTld);

  const suggested = name.suggestedTlds
    .map((t) => t.toLowerCase().replace(/^\./, ""))
    .filter(isSupportedTld);

  const pool = requested.length ? requested : suggested.length ? suggested : [];

  // Always consider .com unless the user restricted TLDs and excluded it.
  const set = new Set<string>(pool);
  if (!requested.length || requested.includes("com")) set.add("com");

  // Fall back to supported defaults if we still have nothing.
  if (set.size === 0) SUPPORTED_TLDS.forEach((t) => set.add(t));

  // Order with .com first, then by SUPPORTED_TLDS priority.
  const ordered = [...set].sort((a, b) => {
    if (a === "com") return -1;
    if (b === "com") return 1;
    return SUPPORTED_TLDS.indexOf(a as never) - SUPPORTED_TLDS.indexOf(b as never);
  });

  return ordered.slice(0, MAX_TLDS_PER_NAME);
}

function toScoreInputs(name: GeneratedName): ScoreInputs {
  return {
    brandability: name.scoreInputs.brandability,
    clarity: name.scoreInputs.clarity,
    memorability: name.scoreInputs.memorability,
    pronunciation: name.scoreInputs.pronunciation,
    spellingSimplicity: name.scoreInputs.spellingSimplicity,
    seoRelevance: name.scoreInputs.seoRelevance,
    premiumFeel: name.scoreInputs.premiumFeel,
  };
}

type Candidate = {
  name: GeneratedName;
  label: string;
  tld: string;
  domain: string; // normalized
  displayName: string; // preserves casing, e.g. "PromptPulse"
};

/**
 * Expand generated names into concrete domain candidates, check availability,
 * score them deterministically, and return the best results.
 */
export async function assembleDomainResults(
  names: GeneratedName[],
  request: GenerateRequest,
  options: { limit?: number } = {}
): Promise<{ results: DomainResult[]; checkedCount: number }> {
  const limit = options.limit ?? 18;

  // 1. Expand candidates across TLDs.
  const candidates: Candidate[] = [];
  for (const name of names) {
    const label = extractLabel(normalizeDomain(`${name.baseName}.com`));
    if (!label) continue;
    const displayName = name.baseName.trim() || label;
    for (const tld of chooseTlds(name, request)) {
      const domain = `${label}.${tld}`;
      candidates.push({ name, label, tld, domain, displayName });
    }
  }

  // 2. Dedupe by normalized domain, cap the total checked.
  const seen = new Set<string>();
  const unique: Candidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.domain)) continue;
    seen.add(c.domain);
    unique.push(c);
    if (unique.length >= MAX_CANDIDATES) break;
  }

  // 3. Batch availability check (cached + deduped).
  const availability = await checkAvailability(unique.map((c) => c.domain));

  // 4. Score + assemble.
  const byLabel = new Map<string, Candidate[]>();
  for (const c of unique) {
    const arr = byLabel.get(c.label) ?? [];
    arr.push(c);
    byLabel.set(c.label, arr);
  }

  const results: DomainResult[] = [];
  for (const c of unique) {
    const avail: DomainAvailabilityResult = availability.get(c.domain) ?? {
      domain: c.domain,
      status: "unknown",
      source: "unknown",
    };

    const { smartScore, scores } = calculateSmartScore({
      domain: c.domain,
      status: avail.status,
      price: avail.price,
      inputs: toScoreInputs(c.name),
      style: c.name.style,
      maxLength: request.maxLength,
    });

    // Alternatives: sibling TLDs of the same label that are buyable.
    const alternatives = (byLabel.get(c.label) ?? [])
      .filter((s) => s.domain !== c.domain)
      .filter((s) => {
        const sa = availability.get(s.domain);
        return sa?.status === "available" || sa?.status === "premium";
      })
      .map((s) => s.domain)
      .slice(0, 3);

    results.push({
      id: hashString(c.domain).toString(36),
      baseName: c.displayName,
      domain: c.domain,
      tld: c.tld,
      style: c.name.style,
      availability: avail.status,
      price: avail.price,
      registrarUrl: getRegistrarSearchUrl(c.domain),
      smartScore,
      scores,
      rationale: c.name.rationale,
      risks: c.name.risks,
      alternatives,
    });
  }

  // 5. Optional .com-only filter.
  let filtered = results;
  if (request.onlyAvailableDotCom) {
    filtered = results.filter(
      (r) => r.tld === "com" && r.availability === "available"
    );
    // If filtering wiped everything out, fall back to all available .coms,
    // then to the unfiltered set so the user is never left empty-handed.
    if (filtered.length === 0) {
      filtered = results.filter((r) => r.tld === "com");
    }
    if (filtered.length === 0) filtered = results;
  }

  // 6. Rank: smart score desc, then available .com first, then shorter label.
  filtered.sort((a, b) => {
    if (b.smartScore !== a.smartScore) return b.smartScore - a.smartScore;
    const aDotCom = a.tld === "com" && a.availability === "available" ? 1 : 0;
    const bDotCom = b.tld === "com" && b.availability === "available" ? 1 : 0;
    if (aDotCom !== bDotCom) return bDotCom - aDotCom;
    return a.domain.length - b.domain.length;
  });

  return {
    results: filtered.slice(0, limit),
    checkedCount: unique.length,
  };
}
