import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { extractTld, normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "rdap";
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Per-registry concurrency caps. Several extensions share one RDAP server
 * (e.g. Identity Digital serves .studio/.agency/.media/...), so firing many
 * requests at once trips that registry's rate limit and we get 429/403 →
 * "unknown". Capping concurrency PER HOST keeps us polite and reliable while
 * still parallelizing across the different registries. Robust registries
 * (Verisign, Google, Radix, CentralNic, PIR) tolerate more; smaller or
 * stricter ones (Identity Digital, per-registry nic.* servers) get less.
 */
const DEFAULT_HOST_CONCURRENCY = 6;
const HOST_CONCURRENCY: { match: string; limit: number }[] = [
  { match: "verisign.com", limit: 16 },
  { match: "publicinterestregistry.org", limit: 12 },
  { match: "registry.google", limit: 12 },
  { match: "radix.host", limit: 10 },
  { match: "centralnic.com", limit: 10 },
  { match: "identitydigital.services", limit: 4 },
];

function hostConcurrency(base: string): number {
  for (const { match, limit } of HOST_CONCURRENCY) {
    if (base.includes(match)) return limit;
  }
  return DEFAULT_HOST_CONCURRENCY;
}

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
  // Verisign
  com: "https://rdap.verisign.com/com/v1/",
  net: "https://rdap.verisign.com/net/v1/",
  // Public Interest Registry
  org: "https://rdap.publicinterestregistry.org/rdap/",
  // Identity Digital (Donuts) — one RDAP server serves a large gTLD portfolio.
  ai: "https://rdap.identitydigital.services/rdap/",
  info: "https://rdap.identitydigital.services/rdap/",
  dog: "https://rdap.identitydigital.services/rdap/",
  studio: "https://rdap.identitydigital.services/rdap/",
  agency: "https://rdap.identitydigital.services/rdap/",
  media: "https://rdap.identitydigital.services/rdap/",
  digital: "https://rdap.identitydigital.services/rdap/",
  world: "https://rdap.identitydigital.services/rdap/",
  life: "https://rdap.identitydigital.services/rdap/",
  live: "https://rdap.identitydigital.services/rdap/",
  // Google Registry
  app: "https://pubapi.registry.google/rdap/",
  dev: "https://pubapi.registry.google/rdap/",
  page: "https://pubapi.registry.google/rdap/",
  // CentralNic
  xyz: "https://rdap.centralnic.com/xyz/",
  // Radix
  tech: "https://rdap.radix.host/rdap/",
  store: "https://rdap.radix.host/rdap/",
  online: "https://rdap.radix.host/rdap/",
  site: "https://rdap.radix.host/rdap/",
  space: "https://rdap.radix.host/rdap/",
  fun: "https://rdap.radix.host/rdap/",
  // Per-registry RDAP servers from the IANA bootstrap.
  design: "https://rdap.nic.design/",
  cloud: "https://rdap.registry.cloud/rdap/",
  shop: "https://rdap.gmoregistry.net/rdap/",
  club: "https://rdap.nic.club/",
  vip: "https://rdap.nic.vip/",
  blog: "https://rdap.blog.fury.ca/rdap/",
  link: "https://rdap.tucowsregistry.net/rdap/",
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

    // One retry on a rate-limit response, after a short backoff.
    for (let attempt = 0; attempt < 2; attempt++) {
      const status = await this.fetchStatus(endpoint);
      if (status === 200) return { domain: normalized, status: "taken", source: SOURCE };
      if (status === 404) return { domain: normalized, status: "available", source: SOURCE };
      if (status === 429 && attempt === 0) {
        await delay(400);
        continue;
      }
      break;
    }
    // 429 (still rate limited), 403, 5xx, 400, etc. — we genuinely don't know.
    return { domain: normalized, status: "unknown", source: SOURCE };
  }

  /** Fetch the RDAP endpoint and return the HTTP status (0 on network error). */
  private async fetchStatus(endpoint: string): Promise<number> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/rdap+json",
          // Some registries block requests with no User-Agent outright, so
          // always identify ourselves.
          "User-Agent": "SmartDomainFinds/1.0 (+https://smartdomainfinds.com)",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      return res.status;
    } catch {
      return 0;
    } finally {
      clearTimeout(timeout);
    }
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    const results = new Array<DomainAvailabilityResult>(domains.length);

    // Group by RDAP host so we can cap concurrency per registry. Domains whose
    // TLD has no RDAP server resolve to "unknown" without a request.
    const groups = new Map<string, { domain: string; idx: number }[]>();
    domains.forEach((domain, idx) => {
      const tld = extractTld(normalizeDomain(domain));
      const base = tld ? RDAP_ENDPOINTS[tld] : undefined;
      if (!base) {
        results[idx] = { domain: normalizeDomain(domain), status: "unknown", source: SOURCE };
        return;
      }
      const list = groups.get(base) ?? [];
      list.push({ domain, idx });
      groups.set(base, list);
    });

    // Process each registry's bucket in parallel, but cap concurrency within it.
    await Promise.all(
      [...groups.entries()].map(([base, items]) =>
        mapWithConcurrency(items, hostConcurrency(base), async ({ domain, idx }) => {
          results[idx] = await this.checkDomain(domain);
        })
      )
    );

    return results;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
