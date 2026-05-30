/**
 * A small, curated thesaurus of brandable synonyms for common startup / product
 * vocabulary. This is intentionally lightweight (no network, no LLM) so it can
 * run in the deterministic demo generator and the instant search to widen the
 * pool of candidate names. It favors short, brandable words over exhaustive
 * dictionary coverage.
 */
const SYNONYMS: Record<string, string[]> = {
  // Speed / performance
  fast: ["swift", "rapid", "turbo", "quick", "zip", "snap"],
  quick: ["swift", "rapid", "snap", "flash"],
  speed: ["velocity", "pace", "turbo", "boost"],

  // Intelligence
  smart: ["clever", "bright", "genius", "wise", "sharp"],
  brain: ["mind", "cortex", "neuron", "synapse"],
  ai: ["neural", "cortex", "synth", "mind"],

  // Money / finance
  money: ["cash", "coin", "fund", "capital", "mint", "ledger"],
  pay: ["pay", "settle", "remit", "tender"],
  payment: ["checkout", "billing", "ledger", "remit"],
  invoice: ["bill", "ledger", "receipt", "statement"],
  finance: ["capital", "fund", "ledger", "treasury", "fiscal"],
  budget: ["ledger", "plan", "allowance"],
  bank: ["vault", "reserve", "treasury"],

  // Data / analytics
  data: ["signal", "metric", "insight", "stream", "datum"],
  chart: ["graph", "plot", "metric", "dash", "trend"],
  charts: ["graph", "plot", "metric", "dash", "trend"],
  analytics: ["insight", "metric", "signal", "pulse"],
  report: ["digest", "brief", "recap", "summary"],

  // Build / dev
  build: ["forge", "craft", "make", "assemble"],
  code: ["script", "syntax", "logic", "dev"],
  dev: ["build", "forge", "craft", "stack"],
  tool: ["kit", "forge", "works", "utility"],
  app: ["lab", "hub", "studio", "works"],

  // Growth / marketing
  grow: ["scale", "bloom", "rise", "boost"],
  growth: ["scale", "boost", "rise", "ascend"],
  market: ["reach", "promote", "amplify", "broadcast"],
  launch: ["liftoff", "ignite", "boost", "rise"],
  scale: ["grow", "expand", "amplify"],
  boost: ["amplify", "lift", "surge", "spark"],

  // Health / fitness
  health: ["vital", "wellness", "thrive", "care"],
  fit: ["fitness", "vital", "active", "strong"],
  fitness: ["vital", "thrive", "active", "pulse"],
  care: ["nurture", "tend", "wellness", "guard"],
  wellness: ["vital", "thrive", "balance", "calm"],

  // Food / pets
  food: ["fork", "feast", "plate", "table", "kitchen"],
  dog: ["pup", "hound", "paw", "fetch", "bark"],
  pet: ["paw", "companion", "buddy", "critter"],
  cook: ["chef", "kitchen", "simmer", "recipe"],

  // Travel
  travel: ["voyage", "journey", "trek", "roam", "wander"],
  trip: ["voyage", "journey", "trek", "jaunt"],
  map: ["atlas", "compass", "route", "path"],

  // Learning
  learn: ["study", "grasp", "master", "academy"],
  teach: ["mentor", "coach", "guide", "tutor"],
  book: ["read", "library", "page", "chapter"],
  course: ["academy", "path", "track", "lesson"],

  // Generic brandy roots
  flow: ["stream", "current", "drift", "glide"],
  link: ["connect", "join", "bridge", "relay"],
  cloud: ["nimbus", "sky", "vapor", "drift"],
  team: ["squad", "crew", "guild", "tribe"],
  work: ["labor", "craft", "task", "hustle"],
  shop: ["store", "market", "cart", "bazaar"],
  store: ["shop", "market", "depot", "vault"],
  home: ["nest", "hearth", "abode", "haven"],
  time: ["clock", "tempo", "moment", "tick"],
  power: ["energy", "charge", "force", "surge"],
  secure: ["guard", "shield", "vault", "fortress"],
  safe: ["guard", "shield", "vault", "haven"],
};

/**
 * Return brandable synonyms for a single word (lowercased), excluding the word
 * itself. Returns an empty array when the word isn't in the curated thesaurus.
 */
export function synonymsFor(word: string): string[] {
  const key = word.trim().toLowerCase();
  const list = SYNONYMS[key];
  if (!list) return [];
  return list.filter((s) => s !== key);
}

/**
 * Given a list of keywords, return a flat, deduped list of synonym words across
 * all of them (capped), suitable for seeding extra name candidates.
 */
export function expandKeywords(keywords: string[], limit = 8): string[] {
  const seen = new Set(keywords.map((k) => k.toLowerCase()));
  const out: string[] = [];
  for (const kw of keywords) {
    for (const syn of synonymsFor(kw)) {
      if (seen.has(syn)) continue;
      seen.add(syn);
      out.push(syn);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
