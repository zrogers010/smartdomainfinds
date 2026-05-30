import { describe, expect, it } from "vitest";
import { shortlistToCsv } from "./shortlist-store";
import type { DomainResult } from "@/lib/domain/types";

function makeResult(overrides: Partial<DomainResult> = {}): DomainResult {
  return {
    id: "1",
    baseName: "PromptPulse",
    domain: "promptpulse.com",
    tld: "com",
    style: "brandable",
    availability: "available",
    registrarUrl: "https://example.com/search?domain=promptpulse.com",
    smartScore: 92,
    scores: {
      availability: 25,
      brandability: 14,
      clarity: 12,
      memorability: 14,
      pronunciation: 9,
      spelling: 9,
      seo: 4,
      premiumFeel: 5,
    },
    rationale: "Short, memorable, AI-relevant.",
    risks: ["Anchors strongly to the AI era"],
    alternatives: [],
    ...overrides,
  };
}

describe("shortlistToCsv", () => {
  it("includes the expected header", () => {
    const csv = shortlistToCsv([makeResult()]);
    const [header] = csv.split("\n");
    expect(header).toBe(
      "domain,availability,smartScore,style,rationale,risks,registrarUrl"
    );
  });

  it("writes one row per item with joined risks", () => {
    const csv = shortlistToCsv([
      makeResult({ risks: ["risk one", "risk two"] }),
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("risk one; risk two");
    expect(lines[1]).toContain("promptpulse.com");
  });

  it("escapes fields containing commas and quotes", () => {
    const csv = shortlistToCsv([
      makeResult({ rationale: 'Great, "punchy" name' }),
    ]);
    expect(csv).toContain('"Great, ""punchy"" name"');
  });
});
