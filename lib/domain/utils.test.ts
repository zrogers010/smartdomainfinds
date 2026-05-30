import { describe, expect, it } from "vitest";
import {
  countSyllableEstimate,
  dedupeDomains,
  extractLabel,
  extractTld,
  getRegistrarSearchUrl,
  hasAwkwardSpelling,
  hasHyphen,
  hasNumber,
  isTooLong,
  normalizeDomain,
  passesRadioTest,
} from "./utils";

describe("normalizeDomain", () => {
  it("lowercases and strips protocol/www/path", () => {
    expect(normalizeDomain("HTTPS://www.PromptPulse.com/pricing")).toBe(
      "promptpulse.com"
    );
  });

  it("removes spaces and illegal characters", () => {
    expect(normalizeDomain("my brand!.com")).toBe("mybrand.com");
  });

  it("collapses duplicate dots and trims edges", () => {
    expect(normalizeDomain("..foo..com..")).toBe("foo.com");
  });
});

describe("extractTld / extractLabel", () => {
  it("extracts the tld", () => {
    expect(extractTld("promptpulse.com")).toBe("com");
    expect(extractTld("rank.ai")).toBe("ai");
  });

  it("extracts the label", () => {
    expect(extractLabel("promptpulse.com")).toBe("promptpulse");
  });

  it("returns empty tld when none present", () => {
    expect(extractTld("nodots")).toBe("");
  });
});

describe("dedupeDomains", () => {
  it("dedupes by normalized form, preserving first occurrence", () => {
    const input = ["PromptPulse.com", "promptpulse.com", "Other.io"];
    expect(dedupeDomains(input)).toEqual(["PromptPulse.com", "Other.io"]);
  });
});

describe("character heuristics", () => {
  it("detects hyphens and numbers", () => {
    expect(hasHyphen("my-brand")).toBe(true);
    expect(hasNumber("brand4u")).toBe(true);
    expect(hasHyphen("brand")).toBe(false);
  });

  it("flags too-long labels", () => {
    expect(isTooLong("superlongdomainnamehere")).toBe(true);
    expect(isTooLong("promptpulse")).toBe(false);
  });

  it("detects awkward spelling", () => {
    expect(hasAwkwardSpelling("brrr")).toBe(true);
    expect(hasAwkwardSpelling("xzqkk")).toBe(true);
    expect(hasAwkwardSpelling("pulse")).toBe(false);
  });
});

describe("countSyllableEstimate", () => {
  it("estimates syllables", () => {
    expect(countSyllableEstimate("pulse")).toBe(1);
    expect(countSyllableEstimate("memorable")).toBeGreaterThanOrEqual(3);
  });
});

describe("passesRadioTest", () => {
  it("passes clean names and fails awkward ones", () => {
    expect(passesRadioTest("promptpulse")).toBe(true);
    expect(passesRadioTest("my-brand")).toBe(false);
    expect(passesRadioTest("xzqkkbrand")).toBe(false);
  });
});

describe("getRegistrarSearchUrl", () => {
  it("builds an encoded registrar url", () => {
    const url = getRegistrarSearchUrl("PromptPulse.com");
    expect(url).toContain("domain=promptpulse.com");
    expect(url.startsWith("https://")).toBe(true);
  });
});
