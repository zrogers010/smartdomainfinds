import type { DomainResult, DomainStyle } from "@/lib/domain/types";
import { extractLabel, hasHyphen, hasNumber } from "@/lib/domain/utils";

export type AvailabilityFilter =
  | "all"
  | "available"
  | "premium"
  | "buyable" // available or premium
  | "hide_taken";

export type SortKey =
  | "smartScore"
  | "availability"
  | "shortest"
  | "brandability"
  | "seo"
  | "premiumFeel"
  | "memorability";

export type DomainFilterState = {
  availability: AvailabilityFilter;
  tld: string; // "all" or a specific tld
  style: DomainStyle | "all";
  minScore: number;
  maxLength: number | null; // null = any
  hideHyphens: boolean;
  hideNumbers: boolean;
  onlyDotCom: boolean;
  sort: SortKey;
};

export const DEFAULT_FILTERS: DomainFilterState = {
  availability: "all",
  tld: "all",
  style: "all",
  minScore: 0,
  maxLength: null,
  hideHyphens: false,
  hideNumbers: false,
  onlyDotCom: false,
  sort: "smartScore",
};

const AVAILABILITY_RANK: Record<DomainResult["availability"], number> = {
  available: 5,
  premium: 4,
  unknown: 3,
  checking: 2,
  error: 1,
  taken: 0,
};

function matchesAvailability(
  result: DomainResult,
  filter: AvailabilityFilter
): boolean {
  switch (filter) {
    case "available":
      return result.availability === "available";
    case "premium":
      return result.availability === "premium";
    case "buyable":
      return (
        result.availability === "available" ||
        result.availability === "premium"
      );
    case "hide_taken":
      return result.availability !== "taken";
    case "all":
    default:
      return true;
  }
}

export function applyFiltersAndSort(
  results: DomainResult[],
  filters: DomainFilterState
): DomainResult[] {
  const filtered = results.filter((r) => {
    const label = extractLabel(r.domain);
    if (!matchesAvailability(r, filters.availability)) return false;
    if (filters.onlyDotCom && r.tld !== "com") return false;
    if (filters.tld !== "all" && r.tld !== filters.tld) return false;
    if (filters.style !== "all" && r.style !== filters.style) return false;
    if (r.smartScore < filters.minScore) return false;
    if (filters.maxLength && label.length > filters.maxLength) return false;
    if (filters.hideHyphens && hasHyphen(label)) return false;
    if (filters.hideNumbers && hasNumber(label)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "availability": {
        const diff =
          AVAILABILITY_RANK[b.availability] - AVAILABILITY_RANK[a.availability];
        return diff !== 0 ? diff : b.smartScore - a.smartScore;
      }
      case "shortest":
        return extractLabel(a.domain).length - extractLabel(b.domain).length;
      case "brandability":
        return b.scores.brandability - a.scores.brandability;
      case "seo":
        return b.scores.seo - a.scores.seo;
      case "premiumFeel":
        return b.scores.premiumFeel - a.scores.premiumFeel;
      case "memorability":
        return b.scores.memorability - a.scores.memorability;
      case "smartScore":
      default:
        return b.smartScore - a.smartScore;
    }
  });

  return sorted;
}

/** TLDs present in the current result set, for populating the TLD filter. */
export function availableTlds(results: DomainResult[]): string[] {
  return Array.from(new Set(results.map((r) => r.tld))).sort();
}

/** Styles present in the current result set. */
export function availableStyles(results: DomainResult[]): DomainStyle[] {
  return Array.from(new Set(results.map((r) => r.style)));
}
