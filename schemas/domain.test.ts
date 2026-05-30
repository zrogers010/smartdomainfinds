import { describe, expect, it } from "vitest";
import {
  GenerateRequestSchema,
  safeParseGeneratedNames,
} from "./domain";

describe("GenerateRequestSchema", () => {
  it("accepts a valid request", () => {
    const parsed = GenerateRequestSchema.safeParse({
      idea: "An AI tool for tracking brand visibility",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects ideas that are too short", () => {
    const parsed = GenerateRequestSchema.safeParse({ idea: "hi" });
    expect(parsed.success).toBe(false);
  });

  it("lowercases preferred tlds", () => {
    const parsed = GenerateRequestSchema.parse({
      idea: "A premium dog food brand",
      tlds: ["COM", "AI"],
    });
    expect(parsed.tlds).toEqual(["com", "ai"]);
  });
});

describe("safeParseGeneratedNames", () => {
  it("parses a valid payload", () => {
    const names = safeParseGeneratedNames({
      names: [
        {
          baseName: "PromptPulse",
          preferredDomain: "promptpulse.com",
          style: "brandable",
          rationale: "Short and brandable.",
          risks: [],
          suggestedTlds: ["com"],
          scoreInputs: {
            brandability: 9,
            clarity: 8,
            memorability: 9,
            pronunciation: 9,
            spellingSimplicity: 9,
            seoRelevance: 6,
            premiumFeel: 8,
          },
        },
      ],
    });
    expect(names).toHaveLength(1);
    expect(names[0].baseName).toBe("PromptPulse");
  });

  it("accepts a bare array", () => {
    const names = safeParseGeneratedNames([
      { baseName: "Foo", preferredDomain: "foo.com" },
    ]);
    expect(names).toHaveLength(1);
    // Missing scoreInputs/style fall back to safe defaults.
    expect(names[0].style).toBe("brandable");
    expect(names[0].scoreInputs.brandability).toBe(5);
  });

  it("returns an empty array for unusable input", () => {
    expect(safeParseGeneratedNames("not json")).toEqual([]);
    expect(safeParseGeneratedNames(null)).toEqual([]);
    expect(safeParseGeneratedNames(42)).toEqual([]);
  });
});
