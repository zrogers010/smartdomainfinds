import { describe, expect, it } from "vitest";
import { mockProvider } from "./mock-provider";

describe("MockAvailabilityProvider", () => {
  it("is deterministic for the same domain", async () => {
    const a = await mockProvider.checkDomain("promptpulse.com");
    const b = await mockProvider.checkDomain("PromptPulse.com");
    expect(a.status).toBe(b.status);
    expect(a.domain).toBe("promptpulse.com");
    expect(a.source).toBe("mock");
  });

  it("attaches price data to available and premium domains", async () => {
    const results = await mockProvider.checkDomains(
      Array.from({ length: 60 }, (_, i) => `seedname${i}.com`)
    );
    const buyable = results.filter(
      (r) => r.status === "available" || r.status === "premium"
    );
    expect(buyable.length).toBeGreaterThan(0);
    for (const r of buyable) {
      expect(r.price?.amount).toBeGreaterThan(0);
      expect(r.price?.currency).toBe("USD");
    }
  });

  it("produces a realistic spread of statuses", async () => {
    const results = await mockProvider.checkDomains(
      Array.from({ length: 100 }, (_, i) => `variety${i}.com`)
    );
    const statuses = new Set(results.map((r) => r.status));
    expect(statuses.has("available")).toBe(true);
    expect(statuses.has("taken")).toBe(true);
  });

  it("preserves request order and handles duplicates", async () => {
    const input = ["a.com", "b.com", "a.com"];
    const results = await mockProvider.checkDomains(input);
    expect(results).toHaveLength(3);
    expect(results[0].status).toBe(results[2].status);
  });
});
