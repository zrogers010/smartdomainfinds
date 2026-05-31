import type { GeneratedName } from "@/schemas/domain";
import type { DomainStyle, GenerateRequest } from "@/lib/domain/types";
import { hashString } from "@/lib/domain/utils";
import { expandKeywords } from "@/lib/domain/thesaurus";

/**
 * Seeded, deterministic demo generator. Produces high-quality, varied name
 * candidates from the user's idea WITHOUT calling an LLM. Used as a fallback
 * whenever OPENAI_API_KEY is missing or the AI response can't be parsed, so the
 * UI is always demoable and testable.
 */

const STOPWORDS = new Set([
  "a","an","the","and","or","for","to","of","in","on","with","that","helps",
  "help","people","users","their","your","you","app","tool","tools","platform",
  "service","services","business","businesses","small","new","using","into",
  "from","about","is","are","it","its","be","this","they","them","who","which",
  "make","makes","made","want","wants","need","needs","build","building","get",
]);

const BRAND_SUFFIXES = [
  "Pulse","Pilot","Scout","Signal","Forge","Nest","Flow","Loop","Spark",
  "Beam","Wave","Radar","Muse","Sense","Grid","Stack","Lab","Hub","Base",
  "Works","Kit","Mind","Path","Peak","Drift","Cast",
];

const PREMIUM_SUFFIXES = ["Signal", "Forge", "IQ", "Labs", "Foundry", "Core", "Vault", "Atlas"];

const PREFIXES = ["Get", "Try", "Use", "Go", "My", "Hey", "Join"];

const COINED_STARTS = ["No","Bra","Dot","Lu","Vi","Ze","Qu","Ka","Mi","Ru","Ne","So"];
const COINED_ENDS = ["miva","nda","ly","va","ory","ova","ily","ano","ico","ela","ira"];

function titleCase(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function extractKeywords(idea: string): string[] {
  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  // Preserve order, dedupe, prefer shorter/punchier words first as primary.
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const w of words) {
    if (!seen.has(w)) {
      seen.add(w);
      unique.push(w);
    }
  }
  // Sort by length so concise keywords (good for brands) come first.
  unique.sort((a, b) => a.length - b.length);
  return unique.slice(0, 6);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function jitter(base: number, seed: number, spread = 2): number {
  const delta = (seed % (spread * 2 + 1)) - spread;
  return Math.max(2, Math.min(10, base + delta));
}

type Candidate = { baseName: string; style: DomainStyle };

function buildCandidates(idea: string, request: GenerateRequest): Candidate[] {
  const keywords = extractKeywords(idea);
  const primary = keywords[0] ?? "brand";
  const secondary = keywords[1] ?? keywords[0] ?? "studio";
  const seed = hashString(idea.toLowerCase());

  const out: Candidate[] = [];
  const push = (baseName: string, style: DomainStyle) => {
    if (baseName.length >= 3) out.push({ baseName, style });
  };

  const Primary = titleCase(primary);
  const Secondary = titleCase(secondary);

  // Thesaurus: brandable synonyms of the keywords widen the pool with on-theme
  // but distinct roots (e.g. "charts" -> "graph", "trend").
  const synonyms = expandKeywords(keywords, 8);
  const SynonymRoots = synonyms.map(titleCase);

  // Brandable: keyword + evocative suffix. Alternate primary/secondary roots
  // across a wide set of suffixes for plenty of distinct options.
  BRAND_SUFFIXES.slice(0, 16).forEach((suffix, i) => {
    const root = i % 2 === 0 ? Primary : Secondary;
    push(`${root}${suffix}`, "brandable");
  });

  // Brandable from synonyms: synonym root + evocative suffix.
  SynonymRoots.forEach((root, i) => {
    push(`${root}${pick(BRAND_SUFFIXES, seed + i * 5)}`, "brandable");
  });

  // Hyphenated descriptive variants (only a couple — hyphens are penalized but
  // some users specifically want them, and the exact .com is often free).
  push(`${primary}-${secondary}`, "descriptive");
  if (SynonymRoots[0]) push(`${primary}-${synonyms[0]}`, "descriptive");

  // Premium: keyword + serious suffix.
  PREMIUM_SUFFIXES.forEach((suffix, i) => {
    push(`${titleCase(keywords[i % keywords.length] ?? primary)}${suffix}`, "premium");
  });

  // Descriptive: combine two keywords or keyword + descriptive noun.
  push(`${Primary}${Secondary}`, "descriptive");
  push(`${Secondary}${Primary}`, "descriptive");
  push(`${Primary}Studio`, "descriptive");
  push(`Smart${Primary}`, "descriptive");
  push(`${Primary}HQ`, "descriptive");

  // SEO: prefix + keyword.
  push(`${Primary}Finder`, "seo");
  push(`${Primary}Generator`, "seo");
  push(`Best${Primary}`, "seo");
  push(`${Primary}App`, "seo");

  // Short / coined: deterministic invented names.
  for (let i = 0; i < 4; i++) {
    const start = pick(COINED_STARTS, seed + i * 7);
    const end = pick(COINED_ENDS, seed + i * 13);
    push(titleCase(start + end), "short");
  }

  // Playful: prefix + keyword.
  push(`${pick(PREFIXES, seed)}${Primary}`, "playful");
  push(`${pick(PREFIXES, seed + 3)}${Secondary}`, "playful");
  push(`${Primary}ly`, "playful");
  push(`${Secondary}ly`, "playful");

  // Domain hacks only when requested.
  if (request.styles?.includes("domain_hack")) {
    push(`${Primary}`, "domain_hack");
  }

  // If specific styles were requested, bias toward them but keep some variety.
  let candidates = out;
  if (request.styles?.length) {
    const requested = new Set(request.styles);
    const preferred = out.filter((c) => requested.has(c.style));
    const rest = out.filter((c) => !requested.has(c.style));
    candidates = [...preferred, ...rest];
  }

  // Honor mustInclude by injecting a name built from the required word.
  if (request.mustInclude?.length) {
    const must = titleCase(request.mustInclude[0].replace(/[^a-z0-9]/gi, ""));
    if (must.length >= 2) {
      candidates.unshift({ baseName: `${must}${pick(BRAND_SUFFIXES, seed)}`, style: "brandable" });
    }
  }

  // Dedupe by baseName, drop avoided words, respect maxLength.
  const avoid = (request.avoidWords ?? []).map((w) => w.toLowerCase());
  const seen = new Set<string>();
  const filtered: Candidate[] = [];
  for (const c of candidates) {
    const key = c.baseName.toLowerCase();
    if (seen.has(key)) continue;
    if (avoid.some((w) => w && key.includes(w))) continue;
    if (request.maxLength && c.baseName.length > request.maxLength) continue;
    seen.add(key);
    filtered.push(c);
  }

  return filtered.slice(0, 40);
}

const STYLE_RATIONALE: Record<DomainStyle, string> = {
  brandable: "Short and brandable, with a modern startup feel that works well as a logo and product name.",
  descriptive: "Clearly communicates what the product does, which lowers the cost of explaining the brand.",
  premium: "Reads as serious and investor-friendly, suitable for an enterprise or funded company.",
  seo: "Includes a high-intent keyword that can help with discoverability and paid search relevance.",
  playful: "Memorable and approachable, with a friendly tone that stands out in a crowded market.",
  short: "Concise and easy to recall, type, and say out loud — strong for a consumer-facing brand.",
  domain_hack: "Creatively uses the TLD as part of the word for a distinctive, compact brand.",
};

const STYLE_RISK: Record<DomainStyle, string[]> = {
  brandable: ["Coined names need a little marketing to build meaning."],
  descriptive: ["Descriptive names can feel generic and may be harder to trademark."],
  premium: ["Premium-feeling names sometimes come with premium registration pricing."],
  seo: ["Keyword-heavy names can age poorly and feel less brandable over time."],
  playful: ["Playful tone may not suit a serious or enterprise audience."],
  short: ["Very short names are scarce, so the exact .com may be taken."],
  domain_hack: ["Non-.com hacks can confuse users who default to typing .com."],
};

function scoreInputsFor(style: DomainStyle, seed: number): GeneratedName["scoreInputs"] {
  const base: Record<DomainStyle, GeneratedName["scoreInputs"]> = {
    brandable: { brandability: 9, clarity: 7, memorability: 9, pronunciation: 8, spellingSimplicity: 8, seoRelevance: 6, premiumFeel: 8 },
    descriptive: { brandability: 6, clarity: 9, memorability: 7, pronunciation: 8, spellingSimplicity: 8, seoRelevance: 8, premiumFeel: 6 },
    premium: { brandability: 8, clarity: 7, memorability: 8, pronunciation: 8, spellingSimplicity: 7, seoRelevance: 6, premiumFeel: 9 },
    seo: { brandability: 5, clarity: 9, memorability: 6, pronunciation: 8, spellingSimplicity: 8, seoRelevance: 9, premiumFeel: 5 },
    playful: { brandability: 8, clarity: 6, memorability: 9, pronunciation: 8, spellingSimplicity: 7, seoRelevance: 5, premiumFeel: 6 },
    short: { brandability: 9, clarity: 6, memorability: 9, pronunciation: 9, spellingSimplicity: 9, seoRelevance: 4, premiumFeel: 8 },
    domain_hack: { brandability: 7, clarity: 5, memorability: 8, pronunciation: 7, spellingSimplicity: 6, seoRelevance: 5, premiumFeel: 7 },
  };
  const b = base[style];
  return {
    brandability: jitter(b.brandability, seed + 1),
    clarity: jitter(b.clarity, seed + 2),
    memorability: jitter(b.memorability, seed + 3),
    pronunciation: jitter(b.pronunciation, seed + 4),
    spellingSimplicity: jitter(b.spellingSimplicity, seed + 5),
    seoRelevance: jitter(b.seoRelevance, seed + 6),
    premiumFeel: jitter(b.premiumFeel, seed + 7),
  };
}

/** Generate deterministic demo candidates for an idea + preferences. */
export function generateDemoNames(request: GenerateRequest): GeneratedName[] {
  const candidates = buildCandidates(request.idea, request);
  const tlds = request.tlds?.length ? request.tlds : undefined;

  // Per-style TLD bias toward extensions that read well for that style.
  const STYLE_TLDS: Record<DomainStyle, string[]> = {
    brandable: ["com", "ai", "app", "xyz", "studio", "co"],
    descriptive: ["com", "org", "net", "online", "site", "media"],
    premium: ["com", "ai", "io", "co", "vip", "studio"],
    seo: ["com", "tech", "online", "store", "shop", "digital"],
    playful: ["com", "xyz", "app", "fun", "club", "space"],
    short: ["com", "io", "ai", "co", "link", "live"],
    domain_hack: ["ai", "io", "dev", "app", "design", "studio"],
  };

  return candidates.map(({ baseName, style }) => {
    const seed = hashString(baseName.toLowerCase());
    const suggestedTlds =
      style === "domain_hack" ? STYLE_TLDS.domain_hack : tlds ?? STYLE_TLDS[style];

    return {
      baseName,
      preferredDomain: `${baseName.toLowerCase()}.${suggestedTlds[0] ?? "com"}`,
      style,
      rationale: STYLE_RATIONALE[style],
      risks: STYLE_RISK[style],
      suggestedTlds,
      scoreInputs: scoreInputsFor(style, seed),
    } satisfies GeneratedName;
  });
}
