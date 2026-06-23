import type { DomainAvailabilityProvider } from "@/lib/domain/provider";
import type {
  DomainAvailabilityResult,
  DomainAvailabilityStatus,
  DomainPrice,
} from "@/lib/domain/types";
import { normalizeDomain } from "@/lib/domain/utils";

const SOURCE = "domainr";
const FASTLY_STATUS_ENDPOINT =
  "https://api.fastly.com/domain-management/v1/tools/status";
const LEGACY_STATUS_ENDPOINT = "https://api.domainr.com/v2/status";
const REQUEST_TIMEOUT_MS = 5000;
const BATCH_SIZE = 25;

type FetchLike = typeof fetch;

type DomainrMode = "fastly" | "legacy";

type DomainrProviderOptions = {
  mode?: DomainrMode;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

type FastlyStatusResponse = {
  domain?: string;
  status?: string;
  offers?: Array<{ currency?: string; price?: string | number }>;
};

type LegacyStatusResponse = {
  status?: LegacyStatusItem[];
};

type LegacyStatusItem = {
  domain?: string;
  status?: string;
};

/**
 * Domainr/Fastly availability adapter.
 *
 * Fastly's Domain Research API is the current Domainr-backed API. It checks one
 * domain per request at `/domain-management/v1/tools/status` and authenticates
 * with the `Fastly-Key` header. The legacy Domainr v2 endpoint can still be
 * selected for older `client_id` credentials.
 */
export class DomainrProvider implements DomainAvailabilityProvider {
  readonly name = SOURCE;
  private readonly fetchImpl: FetchLike;
  private readonly mode: DomainrMode;
  private readonly timeoutMs: number;

  constructor(
    private readonly apiKey: string,
    options: DomainrProviderOptions = {}
  ) {
    this.mode = options.mode ?? "fastly";
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  }

  async checkDomain(domain: string): Promise<DomainAvailabilityResult> {
    const [result] = await this.checkDomains([domain]);
    return result;
  }

  async checkDomains(domains: string[]): Promise<DomainAvailabilityResult[]> {
    const normalized = domains.map((domain) => normalizeDomain(domain));
    const results = new Map<string, DomainAvailabilityResult>();

    for (const batch of chunk([...new Set(normalized)].filter(Boolean), BATCH_SIZE)) {
      const checked =
        this.mode === "legacy"
          ? await this.checkLegacyBatch(batch)
          : await Promise.all(batch.map((domain) => this.checkFastlyDomain(domain)));

      for (const result of checked) {
        results.set(result.domain, result);
      }
    }

    return normalized.map(
      (domain) =>
        results.get(domain) ?? {
          domain,
          status: "unknown",
          source: SOURCE,
        }
    );
  }

  private async checkFastlyDomain(
    domain: string
  ): Promise<DomainAvailabilityResult> {
    const url = new URL(FASTLY_STATUS_ENDPOINT);
    url.searchParams.set("domain", domain);

    const response = await this.fetchJson<FastlyStatusResponse>(url, {
      "Fastly-Key": this.apiKey,
    });

    return toAvailabilityResult(domain, response);
  }

  private async checkLegacyBatch(
    domains: string[]
  ): Promise<DomainAvailabilityResult[]> {
    if (domains.length === 0) return [];

    const url = new URL(LEGACY_STATUS_ENDPOINT);
    url.searchParams.set("client_id", this.apiKey);
    url.searchParams.set("domain", domains.join(","));

    const response = await this.fetchJson<LegacyStatusResponse>(url);
    const statuses = response?.status ?? [];
    const byDomain = new Map(
      statuses.map((item) => [normalizeDomain(item.domain ?? ""), item])
    );

    return domains.map((domain) =>
      toAvailabilityResult(domain, byDomain.get(domain))
    );
  }

  private async fetchJson<T>(
    url: URL,
    headers: Record<string, string> = {}
  ): Promise<T | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await this.fetchImpl(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "SmartDomainFinds/1.0 (+https://smartdomainfinds.com)",
          ...headers,
        },
        signal: controller.signal,
      });

      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function toAvailabilityResult(
  requestedDomain: string,
  statusObject?: FastlyStatusResponse | LegacyStatusItem | null
): DomainAvailabilityResult {
  const domain = normalizeDomain(statusObject?.domain ?? requestedDomain);
  const flags = parseStatusFlags(statusObject?.status);
  const status = mapStatus(flags);
  const price = parsePrice((statusObject as FastlyStatusResponse | undefined)?.offers);

  return {
    domain,
    status,
    source: SOURCE,
    ...(price && (status === "premium" || flags.has("priced"))
      ? { price }
      : {}),
  };
}

function parseStatusFlags(status?: string): Set<string> {
  return new Set(
    (status ?? "")
      .split(/\s+/)
      .map((flag) => flag.trim().toLowerCase())
      .filter(Boolean)
  );
}

function mapStatus(flags: Set<string>): DomainAvailabilityStatus {
  if (flags.size === 0 || flags.has("unknown") || flags.has("pending")) {
    return "unknown";
  }

  if (flags.has("premium") || flags.has("priced")) {
    return "premium";
  }

  if (flags.has("inactive")) {
    return "available";
  }

  if (
    [
      "active",
      "parked",
      "marketed",
      "transferable",
      "expiring",
      "deleting",
      "claimed",
      "reserved",
      "dpml",
      "disallowed",
      "invalid",
      "suffix",
      "zone",
      "tld",
    ].some((flag) => flags.has(flag))
  ) {
    return "taken";
  }

  return "unknown";
}

function parsePrice(
  offers?: Array<{ currency?: string; price?: string | number }>
): DomainPrice | undefined {
  const offer = offers?.find((item) => item.price != null);
  const amount =
    typeof offer?.price === "number"
      ? offer.price
      : Number(String(offer?.price ?? "").replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) return undefined;

  return {
    amount,
    currency: offer?.currency ?? "USD",
    period: "year",
  };
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
