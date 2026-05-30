import { describe, expect, it } from "vitest";
import { calculateSmartScore, scoreAvailability } from "./scoring";
import type { ScoreInputs } from "./scoring";

const strongInputs: ScoreInputs = {
  brandability: 9,
  clarity: 8,
  memorability: 9,
  pronunciation: 9,
  spellingSimplicity: 9,
  seoRelevance: 7,
  premiumFeel: 8,
};

describe("scoreAvailability", () => {
  it("rewards available .com the most", () => {
    expect(scoreAvailability("available", "com")).toBe(25);
    expect(scoreAvailability("available", "io")).toBeLessThan(25);
  });

  it("scores taken/error low", () => {
    expect(scoreAvailability("taken", "com")).toBeLessThan(5);
    expect(scoreAvailability("error", "com")).toBeLessThan(5);
  });

  it("discounts expensive premium domains", () => {
    const cheap = scoreAvailability("premium", "com", {
      amount: 200,
      currency: "USD",
      period: "year",
    });
    const pricey = scoreAvailability("premium", "com", {
      amount: 9000,
      currency: "USD",
      period: "year",
    });
    expect(pricey).toBeLessThan(cheap);
  });
});

describe("calculateSmartScore", () => {
  it("returns a 0-100 score and bumps available .com to the top", () => {
    const available = calculateSmartScore({
      domain: "promptpulse.com",
      status: "available",
      inputs: strongInputs,
      style: "brandable",
    });
    const taken = calculateSmartScore({
      domain: "promptpulse.com",
      status: "taken",
      inputs: strongInputs,
      style: "brandable",
    });

    expect(available.smartScore).toBeGreaterThan(taken.smartScore);
    expect(available.smartScore).toBeLessThanOrEqual(100);
    expect(available.smartScore).toBeGreaterThanOrEqual(0);
  });

  it("penalizes hyphens and numbers", () => {
    const clean = calculateSmartScore({
      domain: "brandnest.com",
      status: "available",
      inputs: strongInputs,
    });
    const hyphenated = calculateSmartScore({
      domain: "brand-nest1.com",
      status: "available",
      inputs: strongInputs,
    });

    expect(hyphenated.smartScore).toBeLessThan(clean.smartScore);
    expect(hyphenated.penalties.length).toBeGreaterThan(0);
  });

  it("flags trademark-looking names", () => {
    const result = calculateSmartScore({
      domain: "googleplus.com",
      status: "available",
      inputs: strongInputs,
    });
    expect(result.penalties.join(" ")).toMatch(/brand/i);
  });
});
