import { describe, expect, it } from "vitest";
import {
  buildSearchCandidates,
  parseSearchQuery,
} from "./search-candidates";

describe("parseSearchQuery", () => {
  it("parses a bare keyword", () => {
    const q = parseSearchQuery("SmartDomainFinds");
    expect(q.label).toBe("smartdomainfinds");
    expect(q.requestedTld).toBeUndefined();
    expect(q.primaryDomain).toBe("smartdomainfinds.com");
  });

  it("parses a full domain with tld", () => {
    const q = parseSearchQuery("https://www.SmartDomainFinds.com/path");
    expect(q.label).toBe("smartdomainfinds");
    expect(q.requestedTld).toBe("com");
    expect(q.primaryDomain).toBe("smartdomainfinds.com");
  });

  it("respects a non-.com tld", () => {
    const q = parseSearchQuery("rank.ai");
    expect(q.label).toBe("rank");
    expect(q.requestedTld).toBe("ai");
    expect(q.primaryDomain).toBe("rank.ai");
  });
});

describe("buildSearchCandidates", () => {
  it("builds exact matches across supported TLDs with primary first", () => {
    const { exact } = buildSearchCandidates("brandnest");
    expect(exact[0]).toBe("brandnest.com");
    expect(exact).toContain("brandnest.ai");
    expect(exact).toContain("brandnest.io");
    expect(new Set(exact).size).toBe(exact.length); // no dupes
  });

  it("puts a requested non-.com tld first", () => {
    const { exact } = buildSearchCandidates("rank.ai");
    expect(exact[0]).toBe("rank.ai");
  });

  it("generates .com variations excluding the exact .com", () => {
    const { variations } = buildSearchCandidates("brandnest");
    expect(variations).toContain("getbrandnest.com");
    expect(variations).toContain("brandnesthq.com");
    expect(variations).not.toContain("brandnest.com");
    expect(variations.every((v) => v.endsWith(".com"))).toBe(true);
  });

  it("returns empty candidates for an empty query", () => {
    const { exact, variations } = buildSearchCandidates("   ");
    expect(exact).toEqual([]);
    expect(variations).toEqual([]);
  });
});
