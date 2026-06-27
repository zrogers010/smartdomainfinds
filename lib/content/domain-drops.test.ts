import { describe, expect, it } from "vitest";

import {
  CURATED_DOMAINS,
  DOMAIN_DROPS,
  curatedCategories,
  curatedDomainToResult,
  curatedTlds,
} from "./domain-drops";

describe("domain drops content", () => {
  it("keeps drop domains connected to their parent slug", () => {
    for (const drop of DOMAIN_DROPS) {
      expect(drop.domains.length).toBeGreaterThan(0);
      expect(drop.domains.every((find) => find.dropSlug === drop.slug)).toBe(true);
    }
  });

  it("exposes stable category and tld filters", () => {
    expect(curatedCategories()).toEqual([
      "AI Governance",
      "Agent Permissions",
      "Agent Security",
      "Developer Tools",
      "Private AI",
      "Prompt Security",
      "Workflow Automation",
    ]);
    expect(curatedTlds()).toEqual(["ai", "com", "io"]);
  });

  it("converts curated finds into shortlist-compatible domain results", () => {
    const result = curatedDomainToResult(CURATED_DOMAINS[0]);

    expect(result.domain).toBe(CURATED_DOMAINS[0].domain);
    expect(result.availability).toBe("available");
    expect(result.registrarUrl).toContain(encodeURIComponent(result.domain));
    expect(result.risks).toHaveLength(2);
  });
});

