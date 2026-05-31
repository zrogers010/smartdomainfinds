import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { GeneratedName } from "@/schemas/domain";

/**
 * Reads the build-time availability cache produced by
 * `scripts/refresh-example-availability.mts` (run before `next build` in
 * deploy.sh). The cache holds example names that have been checked against RDAP
 * and ranked available-first, so the static pages render registerable names.
 *
 * Everything here is best-effort: if the file is missing (e.g. local dev) or
 * unreadable, callers fall back to the live deterministic generator, and the
 * client-side check still refreshes availability either way.
 */

export type VerifiedAvailabilityCache = {
  generatedAt: string;
  niches: Record<string, GeneratedName[]>;
  tlds: Record<string, GeneratedName[]>;
};

const CACHE_FILE = "example-availability.generated.json";

let loaded = false;
let cache: VerifiedAvailabilityCache | null = null;

function load(): VerifiedAvailabilityCache | null {
  if (loaded) return cache;
  loaded = true;
  try {
    const path = join(process.cwd(), "lib", "content", CACHE_FILE);
    cache = JSON.parse(readFileSync(path, "utf8")) as VerifiedAvailabilityCache;
  } catch {
    cache = null;
  }
  return cache;
}

export function verifiedNicheNames(slug: string): GeneratedName[] | null {
  const entry = load()?.niches?.[slug];
  return entry && entry.length > 0 ? entry : null;
}

export function verifiedTldNames(tld: string): GeneratedName[] | null {
  const entry = load()?.tlds?.[tld];
  return entry && entry.length > 0 ? entry : null;
}
