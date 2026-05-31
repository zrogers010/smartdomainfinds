import { hashString } from "@/lib/domain/utils";

/**
 * Deterministic, dependency-free slogan + acronym generators. These run in the
 * browser for instant results at zero cost — they're commodity word tools, not
 * the proprietary scoring engine, so there's nothing sensitive to hide here.
 */

function titleCase(input: string): string {
  const clean = input.trim();
  if (!clean) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function firstKeyword(input: string): string {
  const stop = new Set(["the", "a", "an", "and", "for", "of", "to", "my", "our"]);
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
  return words[0] ?? input.trim();
}

const SLOGAN_TEMPLATES: ((brand: string, kw: string) => string)[] = [
  (b) => `${b}. Simply better.`,
  (b, k) => `Where ${k} meets simplicity.`,
  (b) => `${b} — built for what's next.`,
  (b, k) => `Think ${k}. Think ${b}.`,
  (b) => `The smarter way to ${b.toLowerCase()}.`,
  (_b, k) => `${titleCase(k)}, reimagined.`,
  (b) => `${b}. Done right.`,
  (_b, k) => `Less hassle, more ${k}.`,
  (b) => `Your ${b.toLowerCase()}, elevated.`,
  (_b, k) => `Powering the future of ${k}.`,
  (b) => `${b}: it just works.`,
  (_b, k) => `${titleCase(k)} without the headaches.`,
  (b) => `Make every day a ${b.toLowerCase()} day.`,
  (_b, k) => `Big on ${k}. Light on effort.`,
  (b) => `${b}. Go further.`,
];

/** Generate a deterministic, varied set of slogan/tagline ideas. */
export function generateSlogans(input: string): string[] {
  const raw = input.trim();
  if (raw.length < 2) return [];
  const brand = titleCase(raw);
  const kw = firstKeyword(raw);
  const seed = hashString(raw.toLowerCase());

  // Rotate the template order by the seed so different inputs feel distinct.
  const rotated = SLOGAN_TEMPLATES.map(
    (_, i) => SLOGAN_TEMPLATES[(i + seed) % SLOGAN_TEMPLATES.length]
  );

  const seen = new Set<string>();
  const out: string[] = [];
  for (const template of rotated) {
    const slogan = template(brand, kw).replace(/\s+/g, " ").trim();
    if (!seen.has(slogan)) {
      seen.add(slogan);
      out.push(slogan);
    }
    if (out.length >= 12) break;
  }
  return out;
}

// Positive, business-friendly words for backronyms, keyed by first letter.
const WORD_BANK: Record<string, string[]> = {
  a: ["Agile", "Adaptive", "Authentic", "Advanced", "Ambitious"],
  b: ["Bold", "Brilliant", "Bright", "Balanced", "Brave"],
  c: ["Creative", "Clever", "Connected", "Confident", "Capable"],
  d: ["Dynamic", "Driven", "Dependable", "Daring", "Distinct"],
  e: ["Energetic", "Efficient", "Elegant", "Empowered", "Essential"],
  f: ["Fast", "Focused", "Friendly", "Fearless", "Fresh"],
  g: ["Genuine", "Growing", "Global", "Generous", "Grounded"],
  h: ["Honest", "Helpful", "Happy", "Healthy", "Hardy"],
  i: ["Innovative", "Inspired", "Intuitive", "Inclusive", "Intelligent"],
  j: ["Joyful", "Just", "Jovial", "Judicious", "Jumping"],
  k: ["Keen", "Kind", "Knowing", "Key", "Kinetic"],
  l: ["Limitless", "Lively", "Loyal", "Leading", "Logical"],
  m: ["Modern", "Mindful", "Mighty", "Magnetic", "Motivated"],
  n: ["Nimble", "Natural", "Notable", "Nurturing", "Novel"],
  o: ["Open", "Optimal", "Original", "Organized", "Outstanding"],
  p: ["Powerful", "Precise", "Polished", "Positive", "Proven"],
  q: ["Quick", "Quality", "Quirky", "Quiet", "Quenching"],
  r: ["Reliable", "Radiant", "Resilient", "Refined", "Ready"],
  s: ["Smart", "Strong", "Simple", "Swift", "Sincere"],
  t: ["Trusted", "Thoughtful", "Tenacious", "Tailored", "Timely"],
  u: ["Unique", "United", "Unstoppable", "Upbeat", "Useful"],
  v: ["Vibrant", "Versatile", "Valued", "Vivid", "Visionary"],
  w: ["Wise", "Welcoming", "Wholehearted", "Winning", "Warm"],
  x: ["eXcellent", "eXpert", "eXtra", "eXact", "eXpansive"],
  y: ["Youthful", "Yielding", "Yes-minded", "Yearning", "Zealous"],
  z: ["Zesty", "Zealous", "Zippy", "Zen", "Zonal"],
};

export type AcronymExpansion = { word: string; words: string[] };

/** Generate deterministic backronym expansions for a short word. */
export function generateAcronyms(input: string): AcronymExpansion[] {
  const letters = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("");
  if (letters.length < 2 || letters.length > 8) return [];

  const word = input.trim().toUpperCase().replace(/[^A-Z]/g, "");
  const seed = hashString(input.toLowerCase());

  // Three distinct variations by offsetting into each letter's word bank.
  return [0, 1, 2].map((variant) => ({
    word,
    words: letters.map((letter, i) => {
      const bank = WORD_BANK[letter] ?? [titleCase(letter)];
      const idx = (seed + variant * 7 + i * 3) % bank.length;
      return bank[idx];
    }),
  }));
}
