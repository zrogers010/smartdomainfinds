import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { extractTld, normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "rdap";
const REQUEST_TIMEOUT_MS = 7000;
const CONCURRENCY = 8;

/**
 * TLDs for which rdap.org resolves to an authoritative RDAP server that
 * reliably distinguishes registered (HTTP 200) from unregistered (HTTP 404).
 *
 * IMPORTANT: some TLDs (e.g. .io, .co) have no working RDAP via the IANA
 * bootstrap, so rdap.org returns 404 even for clearly-registered domains. For
 * those we must report "unknown" rather than risk a false "available", per the
 * product rule that we never claim availability we haven't actually verified.
 */
const TRUSTED_RDAP_TLDS = new Set(["com", "net", "ai", "app", "org", "dev"]);

/**
 * Resolve the RDAP endpoint for a domain. .com/.net go straight to Verisign's
 * authoritative RDAP service (fast, avoids rdap.org throttling under
 * concurrent load); other trusted TLDs use the rdap.org bootstrap redirector.
 */
function rdapEndpoint(tld: string, domain: string): string {
  const encoded = encodeURIComponent(domain);
  if (tld === "com") return `https://rdap.verisign.com/com/v1/domain/${encoded}`;
  if (tld === "net") return `https://rdap.verisign.com/net/v1/domain/${encoded}`;
  return `https://rdap.org/domain/${encoded}`;
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

    if (!tld || !TRUSTED_RDAP_TLDS.has(tld)) {
      return { domain: normalized, status: "unknown", source: SOURCE };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(rdapEndpoint(tld, normalized), {
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
