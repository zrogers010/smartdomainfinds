import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type { DomainAvailabilityResult } from "@/lib/domain/types";
import { normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "namecheap";

export type NamecheapConfig = {
  apiUser: string;
  apiKey: string;
  username: string;
  clientIp: string;
};

/**
 * Namecheap availability adapter (STUB).
 *
 * Namecheap's `namecheap.domains.check` command accepts a comma-separated list
 * of domains and returns XML with `Available` and `IsPremiumName` attributes.
 * See https://www.namecheap.com/support/api/methods/domains/check/.
 *
 * TODO(real-provider): Implement the real call:
 *   GET https://api.namecheap.com/xml.response
 *     ?ApiUser=<apiUser>&ApiKey=<apiKey>&UserName=<username>
 *     &ClientIp=<clientIp>&Command=namecheap.domains.check
 *     &DomainList=<comma,separated,domains>
 *   Parse the XML and map:
 *     - Available="true"                 -> "available"
 *     - Available="true" + IsPremium     -> "premium" (read PremiumRegistrationPrice)
 *     - Available="false"                -> "taken"
 *   Respect Namecheap's IP allowlist + rate limits, and batch up to the API's
 *   per-request domain cap.
 */
export class NamecheapProvider implements DomainAvailabilityProvider {
  readonly name = SOURCE;

  constructor(private readonly config: NamecheapConfig) {
    void this.config;
  }

  async checkDomain(domain: string): Promise<DomainAvailabilityResult> {
    const [result] = await this.checkDomains([domain]);
    return result;
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    // TODO(real-provider): replace with a real Namecheap domains.check call.
    return domains.map((d) => ({
      domain: normalizeDomain(d),
      status: "unknown" as const,
      source: SOURCE,
    }));
  }
}
