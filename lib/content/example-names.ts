import type { GeneratedName } from "@/schemas/domain";
import type { DomainStyle } from "@/lib/domain/types";
import { hashString, passesRadioTest } from "@/lib/domain/utils";

/**
 * Curated, deterministic example-name generator for the SEO landing pages.
 *
 * Unlike the homepage demo generator (which extracts ~2 keywords from a single
 * idea and permutes them — producing repetitive output), this draws from a rich
 * per-niche / per-extension vocabulary of brandable roots, modifiers, and
 * suffixes, then enforces variety caps so no single root or pattern dominates.
 * The result is a wide spread of genuinely registerable name ideas, stable at
 * build time.
 */

const DEFAULT_SUFFIXES = [
  "Co", "Lab", "Labs", "Studio", "Works", "Hub", "Collective", "Club", "House",
  "Yard", "Room", "Society", "Supply", "Craft", "Circle", "Forge", "Nest",
  "Pulse", "Flow", "Loop", "Wave", "Peak", "Base", "Co.",
].filter((s) => /^[a-z]+$/i.test(s));

const DEFAULT_MODIFIERS = [
  "Modern", "Prime", "True", "North", "Peak", "Bright", "Nova", "Apex", "Bold",
];

function titleCase(word: string): string {
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word;
}

function defaultScoreInputs(): GeneratedName["scoreInputs"] {
  return {
    brandability: 7,
    clarity: 6,
    memorability: 7,
    pronunciation: 7,
    spellingSimplicity: 7,
    seoRelevance: 5,
    premiumFeel: 7,
  };
}

type RawCandidate = {
  baseName: string;
  style: DomainStyle;
  root: string;
  tag: string;
};

export type ExampleOptions = {
  /** Stable key so each page's output is deterministic but distinct. */
  seedKey: string;
  roots: string[];
  modifiers?: string[];
  extraSuffixes?: string[];
  count?: number;
  /** TLD pages: force every example onto this extension. */
  forceTld?: string;
  /** Niche pages: themed extensions to mix in alongside .com. */
  themedTlds?: string[];
  /** Max times one root may appear (default 2). Raise to build a larger pool. */
  rootCap?: number;
  /** Max times one pattern tag may appear (default 3). */
  tagCap?: number;
};

export function buildExampleNames(opts: ExampleOptions): GeneratedName[] {
  const roots = opts.roots.map(titleCase);
  const modifiers = (
    opts.modifiers?.length ? opts.modifiers : DEFAULT_MODIFIERS
  ).map(titleCase);
  const suffixes = [...(opts.extraSuffixes ?? []), ...DEFAULT_SUFFIXES].map(
    titleCase
  );
  const count = opts.count ?? 24;

  const raw: RawCandidate[] = [];
  const push = (
    baseName: string,
    style: DomainStyle,
    root: string,
    tag: string
  ) => {
    const label = baseName.toLowerCase();
    if (baseName.length < 4 || baseName.length > 16) return;
    if (!passesRadioTest(label)) return;
    raw.push({ baseName, style, root, tag });
  };

  // Pattern 1: root + brandable suffix (BeanForge, RoastWorks).
  for (const root of roots) {
    for (const suffix of suffixes) {
      if (root.toLowerCase() === suffix.toLowerCase()) continue;
      push(`${root}${suffix}`, "brandable", root, `suffix:${suffix}`);
    }
  }

  // Pattern 2: modifier + root (UrbanBean, GoldenRoast).
  for (const mod of modifiers) {
    for (const root of roots) {
      if (mod.toLowerCase() === root.toLowerCase()) continue;
      push(`${mod}${root}`, "brandable", root, `mod:${mod}`);
    }
  }

  // Pattern 3: punchy single-word coined names from longer roots.
  for (const root of roots) {
    if (root.length >= 5) push(root, "short", root, "solo");
  }

  // Pattern 4: two distinct roots compounded (EmberLarder, SpoonHarvest).
  // These are strongly brandable AND far more likely to be unregistered than
  // a word + a common suffix, which is key to surfacing available names.
  for (const a of roots) {
    for (const b of roots) {
      if (a === b) continue;
      push(`${a}${b}`, "brandable", a, `pair:${b}`);
    }
  }

  // Dedupe by name.
  const byName = new Map<string, RawCandidate>();
  for (const c of raw) {
    const key = c.baseName.toLowerCase();
    if (!byName.has(key)) byName.set(key, c);
  }
  const unique = [...byName.values()];

  // Deterministic shuffle by hashing name + seed.
  unique.sort(
    (a, b) =>
      hashString(a.baseName.toLowerCase() + opts.seedKey) -
      hashString(b.baseName.toLowerCase() + opts.seedKey)
  );

  // Variety caps: no root more than twice, no pattern-tag more than 3x.
  const ROOT_CAP = opts.rootCap ?? 2;
  const TAG_CAP = opts.tagCap ?? 3;
  const rootUses = new Map<string, number>();
  const tagUses = new Map<string, number>();
  const chosen: RawCandidate[] = [];
  for (const c of unique) {
    if ((rootUses.get(c.root) ?? 0) >= ROOT_CAP) continue;
    if ((tagUses.get(c.tag) ?? 0) >= TAG_CAP) continue;
    rootUses.set(c.root, (rootUses.get(c.root) ?? 0) + 1);
    tagUses.set(c.tag, (tagUses.get(c.tag) ?? 0) + 1);
    chosen.push(c);
    if (chosen.length >= count) break;
  }
  // Relax caps if the pool was small.
  if (chosen.length < count) {
    const picked = new Set(chosen.map((c) => c.baseName));
    for (const c of unique) {
      if (picked.has(c.baseName)) continue;
      chosen.push(c);
      if (chosen.length >= count) break;
    }
  }

  const themed = (opts.themedTlds ?? []).filter(Boolean);
  return chosen.map((c) => {
    let tld: string;
    if (opts.forceTld) {
      tld = opts.forceTld;
    } else {
      const h = hashString(c.baseName.toLowerCase());
      // ~65% .com (credible + RDAP-verifiable), rest across themed extensions.
      tld = themed.length === 0 || h % 20 < 13 ? "com" : themed[h % themed.length];
    }
    return {
      baseName: c.baseName,
      preferredDomain: `${c.baseName.toLowerCase()}.${tld}`,
      style: c.style,
      rationale: "",
      risks: [],
      suggestedTlds: [tld],
      scoreInputs: defaultScoreInputs(),
    } satisfies GeneratedName;
  });
}
