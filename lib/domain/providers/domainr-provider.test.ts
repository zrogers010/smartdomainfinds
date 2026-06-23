import { describe, expect, it, vi } from "vitest";
import { DomainrProvider } from "./domainr-provider";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

describe("DomainrProvider", () => {
  it("checks the Fastly Domain Research status endpoint", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        domain: "freshbrand.com",
        status: "undelegated inactive",
      })
    );
    const provider = new DomainrProvider("fastly-token", { fetchImpl });

    const result = await provider.checkDomain("FreshBrand.com");

    expect(result).toEqual({
      domain: "freshbrand.com",
      status: "available",
      source: "domainr",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.fastly.com/domain-management/v1/tools/status?domain=freshbrand.com"
    );
    expect(init?.headers).toMatchObject({ "Fastly-Key": "fastly-token" });
  });

  it.each([
    ["undelegated inactive", "available"],
    ["active zone", "taken"],
    ["active parked marketed", "taken"],
    ["undelegated premium", "premium"],
    ["active priced", "premium"],
    ["reserved", "taken"],
    ["unknown", "unknown"],
    ["", "unknown"],
  ] as const)("maps %s to %s", async (domainrStatus, expectedStatus) => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ domain: "example.com", status: domainrStatus })
    );
    const provider = new DomainrProvider("fastly-token", { fetchImpl });

    const result = await provider.checkDomain("example.com");

    expect(result.status).toBe(expectedStatus);
  });

  it("attaches offer price data to premium results", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        domain: "ace.pizza",
        status: "undelegated premium",
        offers: [{ currency: "USD", price: "1200.00" }],
      })
    );
    const provider = new DomainrProvider("fastly-token", { fetchImpl });

    const result = await provider.checkDomain("ace.pizza");

    expect(result.price).toEqual({
      amount: 1200,
      currency: "USD",
      period: "year",
    });
  });

  it("returns unknown on provider errors", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, { status: 401 }));
    const provider = new DomainrProvider("bad-token", { fetchImpl });

    const result = await provider.checkDomain("example.com");

    expect(result).toEqual({
      domain: "example.com",
      status: "unknown",
      source: "domainr",
    });
  });

  it("preserves request order and dedupes Fastly checks", async () => {
    const fetchImpl = vi.fn(async (url: URL | RequestInfo) => {
      const domain = new URL(String(url)).searchParams.get("domain");
      return jsonResponse({
        domain,
        status: domain === "b.com" ? "active" : "inactive",
      });
    });
    const provider = new DomainrProvider("fastly-token", { fetchImpl });

    const results = await provider.checkDomains(["A.com", "b.com", "a.com"]);

    expect(results.map((r) => r.domain)).toEqual(["a.com", "b.com", "a.com"]);
    expect(results.map((r) => r.status)).toEqual([
      "available",
      "taken",
      "available",
    ]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("supports the legacy Domainr status endpoint", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        status: [
          { domain: "a.com", status: "inactive" },
          { domain: "b.com", status: "active" },
        ],
      })
    );
    const provider = new DomainrProvider("legacy-client-id", {
      mode: "legacy",
      fetchImpl,
    });

    const results = await provider.checkDomains(["a.com", "b.com"]);

    expect(results.map((r) => r.status)).toEqual(["available", "taken"]);
    const [url] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.domainr.com/v2/status?client_id=legacy-client-id&domain=a.com%2Cb.com"
    );
  });
});
