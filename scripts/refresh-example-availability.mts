/**
 * Build-time precompute for the SEO landing pages.
 *
 * For every niche and TLD page we generate a large pool of curated, brandable
 * candidate names, check them against RDAP (the real provider), and keep the
 * available ones first. The ranked selection is written to a JSON cache that
 * the static pages read during `next build`, so visitors land on pages full of
 * genuinely registerable names. Run by deploy.sh before the build:
 *
 *   npm run availability:refresh
 *
 * It is best-effort: any failure still writes a valid (deterministically
 * ordered) file, and the pages fall back to the live generator if it's missing.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { NICHES } from "../lib/content/niches";
import { TLDS } from "../lib/content/tlds";
import {
  exampleNamePoolForNiche,
  exampleNamePoolForNicheCom,
  exampleNamePoolForTld,
} from "../lib/content/example-vocab";
import { rdapProvider } from "../lib/domain/providers/rdap-provider";
import { normalizeDomain } from "../lib/domain/utils";
import type { GeneratedName } from "../schemas/domain";
import type { DomainAvailabilityStatus } from "../lib/domain/types";

const NICHE_TARGET = 24;
const TLD_TARGET = 18;

const RANK: Record<string, number> = {
  available: 0,
  premium: 1,
  unknown: 2,
  error: 2,
  checking: 2,
  taken: 3,
};

async function checkPool(
  pool: GeneratedName[]
): Promise<Map<string, DomainAvailabilityStatus>> {
  if (pool.length === 0) return new Map();
  const domains = pool.map((n) => normalizeDomain(n.preferredDomain));
  try {
    const results = await rdapProvider.checkDomains(domains);
    return new Map(results.map((r) => [r.domain, r.status]));
  } catch {
    return new Map();
  }
}

function dedupeByBase(
  source: GeneratedName[],
  into: GeneratedName[],
  seen: Set<string>,
  target: number
) {
  for (const name of source) {
    if (into.length >= target) break;
    const key = name.baseName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    into.push(name);
  }
}

/**
 * Niche pages: search a large .com pool and lead with verified-available
 * names. Backfill with a themed-extension pool (for visual variety) only if we
 * couldn't find enough available .com names.
 */
async function selectNicheNames(
  slug: string,
  target: number
): Promise<{ names: GeneratedName[]; available: number }> {
  const comPool = exampleNamePoolForNicheCom(slug);
  const status = await checkPool(comPool);

  const availableCom = comPool.filter((n) => {
    const s = status.get(normalizeDomain(n.preferredDomain));
    return s === "available" || s === "premium";
  });

  const chosen: GeneratedName[] = [];
  const seen = new Set<string>();
  dedupeByBase(availableCom, chosen, seen, target);
  const available = chosen.length;

  if (chosen.length < target) {
    dedupeByBase(exampleNamePoolForNiche(slug), chosen, seen, target);
  }
  return { names: chosen.slice(0, target), available };
}

/** TLD pages: force the extension, rank verified-available first. */
async function rankTldNames(
  tld: string,
  target: number
): Promise<{ names: GeneratedName[]; available: number }> {
  const pool = exampleNamePoolForTld(tld);
  if (pool.length === 0) return { names: [], available: 0 };
  const status = await checkPool(pool);
  let available = 0;
  const names = pool
    .map((name, i) => {
      const s = status.get(normalizeDomain(name.preferredDomain)) ?? "unknown";
      if (s === "available" || s === "premium") available += 1;
      return { name, i, rank: RANK[s] ?? 2 };
    })
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .slice(0, target)
    .map((x) => x.name);
  return { names, available: Math.min(available, target) };
}

async function main() {
  const niches: Record<string, GeneratedName[]> = {};
  const tlds: Record<string, GeneratedName[]> = {};

  for (const niche of NICHES) {
    const { names, available } = await selectNicheNames(niche.slug, NICHE_TARGET);
    niches[niche.slug] = names;
    console.log(`  niche/${niche.slug}: ${names.length} names (${available} available)`);
  }

  for (const tld of TLDS) {
    const { names, available } = await rankTldNames(tld.tld, TLD_TARGET);
    tlds[tld.tld] = names;
    console.log(`  domains/${tld.tld}: ${names.length} names (${available} available)`);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    niches,
    tlds,
  };

  const path = join(
    process.cwd(),
    "lib",
    "content",
    "example-availability.generated.json"
  );
  writeFileSync(path, JSON.stringify(out));
  console.log(`\nWrote ${path}`);
}

main().catch((err) => {
  console.error("[refresh-example-availability] failed:", err);
  // Don't fail the deploy — pages fall back to the live generator.
  process.exit(0);
});
