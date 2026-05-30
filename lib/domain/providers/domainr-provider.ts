import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "domainr";

/**
 * Domainr availability adapter (STUB).
 *
 * Domainr exposes a status endpoint that returns availability summaries for a
 * domain. See https://domainr.com/docs/api/v2/status.
 *
 * TODO(real-provider): Implement the real HTTP calls:
 *   GET https://api.domainr.com/v2/status?domain=<domain>&client_id=<key>
 *   Map Domainr's `summary`/`status` strings to our DomainAvailabilityStatus:
 *     - "inactive" / "undelegated"      -> "available"
 *     - "active" / "parked" / "marketed"-> "taken"
 *     - "priced" / "premium"            -> "premium"
 *     - anything ambiguous              -> "unknown"
 *   Batch with the multi-domain form (comma-separated `domain` param) and add
 *   retry/backoff + a short in-process cache.
 */
export class DomainrProvider implements DomainAvailabilityProvider {
  readonly name = SOURCE;

  constructor(private readonly apiKey: string) {
    void this.apiKey;
  }

  async checkDomain(domain: string): Promise<DomainAvailabilityResult> {
    // TODO(real-provider): replace with a real Domainr status lookup.
    return {
      domain: normalizeDomain(domain),
      status: "unknown",
      source: SOURCE,
    };
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    return Promise.all(domains.map((d) => this.checkDomain(d)));
  }
}
