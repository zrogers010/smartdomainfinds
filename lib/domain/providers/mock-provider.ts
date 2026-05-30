import type {
  DomainAvailabilityProvider,
} from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { hashString, normalizeDomain, extractTld } from "@/lib/domain/utils";

const SOURCE = "mock";

/**
 * Deterministic mock availability provider.
 *
 * Results are derived from a hash of the normalized domain so the same domain
 * always returns the same status. This keeps UI/testing stable while still
 * producing a realistic spread of available / taken / premium / unknown
 * results, including fake price data for premium domains.
 *
 * NOTE: This is mock logic only. It does not perform real DNS/WHOIS/RDAP
 * lookups. Swap in a real provider (Domainr, Namecheap, Cloudflare) for
 * production via DOMAIN_PROVIDER.
 */
export class MockAvailabilityProvider implements DomainAvailabilityProvider {
  readonly name = SOURCE;

  async checkDomain(domain: string): Promise<DomainAvailabilityResult> {
    return this.resolve(domain);
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    // Dedupe within the batch so we never "check" the same domain twice.
    const unique = new Map<string, string>();
    for (const d of domains) {
      const key = normalizeDomain(d);
      if (key && !unique.has(key)) unique.set(key, d);
    }

    const resolved = new Map<string, DomainAvailabilityResult>();
    for (const [key, original] of unique) {
      resolved.set(key, this.resolve(original));
    }

    // Return results in the original request order.
    return domains.map((d) => {
      const key = normalizeDomain(d);
      return (
        resolved.get(key) ?? {
          domain: key,
          status: "error" as const,
          source: SOURCE,
        }
      );
    });
  }

  private resolve(domain: string): DomainAvailabilityResult {
    const normalized = normalizeDomain(domain);
    const tld = extractTld(normalized) || "com";
    const seed = hashString(normalized);

    // Distribute statuses across a 0-99 bucket. .com is intentionally a bit
    // scarcer than alt-TLDs to mirror reality.
    const bucket = seed % 100;
    const dotComScarcity = tld === "com" ? 12 : 0;

    let status: DomainAvailabilityResult["status"];
    if (bucket < 45 - dotComScarcity) {
      status = "available";
    } else if (bucket < 70 - dotComScarcity) {
      status = "taken";
    } else if (bucket < 85) {
      status = "premium";
    } else if (bucket < 95) {
      status = "taken";
    } else {
      status = "unknown";
    }

    const result: DomainAvailabilityResult = {
      domain: normalized,
      status,
      source: SOURCE,
    };

    if (status === "available") {
      // Standard registration price by TLD.
      result.price = {
        amount: standardPrice(tld),
        currency: "USD",
        period: "year",
      };
    }

    if (status === "premium") {
      // Deterministic but varied premium price between ~$450 and ~$9,450.
      const amount = 450 + (seed % 9000);
      result.price = {
        amount: Math.round(amount / 50) * 50,
        currency: "USD",
        period: "year",
      };
    }

    return result;
  }
}

function standardPrice(tld: string): number {
  switch (tld) {
    case "com":
      return 12;
    case "net":
      return 14;
    case "co":
      return 26;
    case "io":
      return 39;
    case "ai":
      return 70;
    case "app":
      return 16;
    default:
      return 18;
  }
}

export const mockProvider = new MockAvailabilityProvider();
