import nspell from "nspell";
import enDictionary from "dictionary-en";

/**
 * Lightweight spelling correction for the "describe your idea" input. Runs
 * server-side with no external API:
 *
 *  1. nspell (Hunspell) flags non-words and suggests fixes — great for typical
 *     1-2 edit typos like "recieve" -> "receive" or "enterprize" -> "enterprise".
 *  2. A consonant-skeleton index handles vowel-confusion misspellings that
 *     nspell's suggester misses entirely, e.g. "miediavel" -> "medieval"
 *     (both reduce to the consonant skeleton "mdvl").
 *
 * We only accept a correction when it's within a length-proportional edit
 * distance, so we never "correct" deliberate brand coinages into noise.
 */

export type SpellingCorrection = { from: string; to: string };

type Engine = {
  spell: ReturnType<typeof nspell>;
  bySkeleton: Map<string, string[]>;
};

/** Minimum token length we bother correcting (skip "the", "app", etc.). */
const MIN_WORD_LENGTH = 4;

/** Strip vowels and collapse repeats to a consonant skeleton ("medieval" -> "mdvl"). */
function skeleton(word: string): string {
  return word.replace(/[aeiou]/g, "").replace(/(.)\1+/g, "$1");
}

let cache: Engine | null = null;

function getEngine(): Engine {
  if (cache) return cache;

  const dict = enDictionary as { aff: Uint8Array; dic: Uint8Array };
  const aff = Buffer.from(dict.aff);
  const dic = Buffer.from(dict.dic);
  const spell = nspell({ aff, dic });

  const dicText = dic.toString("utf8");
  const bySkeleton = new Map<string, string[]>();
  // First line of a Hunspell .dic is the entry count; the rest are "word/FLAGS".
  for (const line of dicText.split("\n").slice(1)) {
    const word = line.split("/")[0].trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) continue;
    const key = skeleton(word);
    if (!key) continue;
    const arr = bySkeleton.get(key);
    if (arr) arr.push(word);
    else bySkeleton.set(key, [word]);
  }

  cache = { spell, bySkeleton };
  return cache;
}

/** Bounded Levenshtein edit distance (returns max+1 once it provably exceeds max). */
function levenshtein(a: string, b: string, max = 8): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > max) return max + 1;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}

/** Correct a single lowercase word, or return it unchanged if it's fine / uncertain. */
function correctLowerWord(word: string, engine: Engine): string {
  if (word.length < MIN_WORD_LENGTH || engine.spell.correct(word)) return word;

  // Accept only confident corrections (looser for longer words).
  const threshold = Math.max(2, Math.floor(word.length / 3) + 1);

  // Closest word sharing the same consonant skeleton — a strong signal for
  // vowel-confusion typos ("miediavel"/"restaraunt" -> "medieval"/"restaurant").
  let skelBest: string | null = null;
  let skelDist = Infinity;
  for (const c of engine.bySkeleton.get(skeleton(word)) ?? []) {
    const d = levenshtein(word, c);
    if (d < skelDist) {
      skelDist = d;
      skelBest = c;
    }
  }

  // nspell's first in-threshold suggestion (respecting its ranking, which knows
  // common misspellings like "recieve" -> "receive" over "relieve").
  let nspellBest: string | null = null;
  let nspellDist = Infinity;
  for (const s of engine.spell.suggest(word).slice(0, 5)) {
    if (!/^[a-z]+$/.test(s)) continue;
    const d = levenshtein(word, s);
    if (d <= threshold) {
      nspellBest = s;
      nspellDist = d;
      break;
    }
  }

  // Prefer the skeleton match when it's at least as close; else trust nspell.
  if (skelBest && skelDist <= threshold && skelDist <= nspellDist) {
    return skelBest;
  }
  if (nspellBest) return nspellBest;
  if (skelBest && skelDist <= threshold) return skelBest;
  return word;
}

/** Re-apply the original token's casing to a corrected lowercase word. */
function matchCase(original: string, corrected: string): string {
  if (original === original.toUpperCase()) return corrected.toUpperCase();
  if (original[0] === original[0]?.toUpperCase()) {
    return corrected[0].toUpperCase() + corrected.slice(1);
  }
  return corrected;
}

/**
 * Correct the spelling of free text, preserving punctuation, spacing, and the
 * casing of each token. Returns the corrected text plus the list of changes.
 * Never throws — on any failure it returns the input untouched.
 */
export function correctText(text: string): {
  corrected: string;
  corrections: SpellingCorrection[];
} {
  let engine: Engine;
  try {
    engine = getEngine();
  } catch {
    return { corrected: text, corrections: [] };
  }

  const corrections: SpellingCorrection[] = [];
  const corrected = text.replace(/[A-Za-z]+/g, (token) => {
    const lower = token.toLowerCase();
    const fixedLower = correctLowerWord(lower, engine);
    if (fixedLower === lower) return token;
    const fixed = matchCase(token, fixedLower);
    corrections.push({ from: token, to: fixed });
    return fixed;
  });

  return { corrected, corrections };
}
