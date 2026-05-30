import type { DomainAvailabilityResult } from "@/lib/domain/types";

/**
 * Availability provider abstraction. The AI may *suggest* names, but only a
 * provider may decide whether a domain is actually available. Real providers
 * (Domainr, Namecheap, Cloudflare) implement this same interface so they can
 * be swapped via the DOMAIN_PROVIDER env var without touching the rest of the
 * app.
 */
export interface DomainAvailabilityProvider {
  /** Stable identifier surfaced in results + metadata. */
  readonly name: string;
  checkDomain(domain: string): Promise<DomainAvailabilityResult>;
  checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]>;
}

let cachedProvider: DomainAvailabilityProvider | null = null;

/**
 * Resolve the active availability provider from DOMAIN_PROVIDER. Defaults to
 * the RDAP provider, which returns real availability with no API key required.
 * Falls back to mock only when explicitly requested.
 */
export async function getAvailabilityProvider(): Promise<DomainAvailabilityProvider> {
  if (cachedProvider) return cachedProvider;

  const choice = (process.env.DOMAIN_PROVIDER ?? "rdap").toLowerCase();

  switch (choice) {
    case "rdap": {
      const { rdapProvider } = await import(
        "@/lib/domain/providers/rdap-provider"
      );
      cachedProvider = rdapProvider;
      break;
    }
    case "domainr": {
      const { DomainrProvider } = await import(
        "@/lib/domain/providers/domainr-provider"
      );
      const apiKey = process.env.DOMAINR_API_KEY;
      if (apiKey) {
        cachedProvider = new DomainrProvider(apiKey);
        break;
      }
      // Missing credentials — degrade gracefully to mock.
      cachedProvider = await loadMock();
      break;
    }
    case "namecheap": {
      const { NamecheapProvider } = await import(
        "@/lib/domain/providers/namecheap-provider"
      );
      const apiUser = process.env.NAMECHEAP_API_USER;
      const apiKey = process.env.NAMECHEAP_API_KEY;
      const username = process.env.NAMECHEAP_USERNAME;
      const clientIp = process.env.NAMECHEAP_CLIENT_IP;
      if (apiUser && apiKey && username && clientIp) {
        cachedProvider = new NamecheapProvider({
          apiUser,
          apiKey,
          username,
          clientIp,
        });
        break;
      }
      cachedProvider = await loadMock();
      break;
    }
    // TODO: add a "cloudflare" case backed by the Cloudflare Registrar API.
    case "mock":
    default:
      cachedProvider = await loadMock();
      break;
  }

  return cachedProvider;
}

async function loadMock(): Promise<DomainAvailabilityProvider> {
  const { mockProvider } = await import(
    "@/lib/domain/providers/mock-provider"
  );
  return mockProvider;
}

/** Test helper to reset the memoized provider. */
export function __resetProviderCache() {
  cachedProvider = null;
}
