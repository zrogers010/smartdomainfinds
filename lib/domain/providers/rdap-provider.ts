import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { extractTld, normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "rdap";
const REQUEST_TIMEOUT_MS = 5000;
const CONCURRENCY = 16;

/**
 * Authoritative RDAP base URLs per TLD, taken from the IANA bootstrap registry
 * (https://data.iana.org/rdap/dns.json). We hit each registry's RDAP server
 * DIRECTLY instead of going through the rdap.org redirector — this is both
 * faster and avoids rdap.org's aggressive throttling under concurrent load.
 *
 * A TLD is "trusted" iff it appears here. For trusted TLDs the registry
 * reliably distinguishes registered (HTTP 200) from unregistered (HTTP 404).
 *
 * IMPORTANT: some popular ccTLDs (e.g. .io, .co, .me) have NO RDAP server in
 * the bootstrap registry, so they're intentionally absent and always resolve
 * to "unknown" — we never claim availability we can't actually verify.
 */
const RDAP_ENDPOINTS: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1/",
  net: "https://rdap.verisign.com/net/v1/",
  org: "https://rdap.publicinterestregistry.org/rdap/",
  ai: "https://rdap.identitydigital.services/rdap/",
  info: "https://rdap.identitydigital.services/rdap/",
  dog: "https://rdap.identitydigital.services/rdap/",
  app: "https://pubapi.registry.google/rdap/",
  dev: "https://pubapi.registry.google/rdap/",
  page: "https://pubapi.registry.google/rdap/",
  xyz: "https://rdap.centralnic.com/xyz/",
  tech: "https://rdap.radix.host/rdap/",
  store: "https://rdap.radix.host/rdap/",
  online: "https://rdap.radix.host/rdap/",
  site: "https://rdap.radix.host/rdap/",
};

/** Resolve the authoritative RDAP request URL for a domain, or null if its TLD has no trusted RDAP server. */
function rdapEndpoint(tld: string, domain: string): string | null {
  const base = RDAP_ENDPOINTS[tld];
  if (!base) return null;
  return `${base}domain/${encodeURIComponent(domain)}`;
}

/**
 * Real availability provider backed by RDAP (the modern, authoritative WHOIS
 * replacement). Requires no API key. Uses the rdap.org bootstrap which
 * redirects to the correct registry RDAP service.
 *
 * Status mapping for trusted TLDs:
 *   - HTTP 200  -> "taken"      (a registration record exists)
 *   - HTTP 404  -> "available"  (no registration record)
 *   - otherwise -> "unknown"    (rate limit, timeout, network error, etc.)
 *
 * Untrusted TLDs always return "unknown".
 */
export class RdapProvider implements DomainAvailabilityProvider {
  readonly name = SOURCE;

  async checkDomain(domain: string): Promise<DomainAvailabilityResult> {
    const normalized = normalizeDomain(domain);
    const tld = extractTld(normalized);
    const endpoint = tld ? rdapEndpoint(tld, normalized) : null;

    if (!endpoint) {
      return { domain: normalized, status: "unknown", source: SOURCE };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/rdap+json" },
        redirect: "follow",
        signal: controller.signal,
      });

      if (res.status === 200) {
        return { domain: normalized, status: "taken", source: SOURCE };
      }
      if (res.status === 404) {
        return { domain: normalized, status: "available", source: SOURCE };
      }
      // 429 (rate limited), 5xx, 400, etc. — we genuinely don't know.
      return { domain: normalized, status: "unknown", source: SOURCE };
    } catch {
      // Timeout / network error — never assume available.
      return { domain: normalized, status: "unknown", source: SOURCE };
    } finally {
      clearTimeout(timeout);
    }
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    return mapWithConcurrency(domains, CONCURRENCY, (d) => this.checkDomain(d));
  }
}

/** Run an async mapper over items with a fixed concurrency limit. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    worker
  );
  await Promise.all(workers);
  return results;
}

export const rdapProvider = new RdapProvider();
