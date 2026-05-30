import type {
  DomainAvailabilityStatus,
  DomainPrice,
  DomainScoreBreakdown,
  DomainStyle,
} from "@/lib/domain/types";
import {
  countSyllableEstimate,
  extractLabel,
  extractTld,
  hasAwkwardSpelling,
  hasHyphen,
  hasNumber,
  hasSpammyWord,
  isTooLong,
  looksOverlyGeneric,
  looksTrademarkRisky,
} from "@/lib/domain/utils";
import { SCORE_WEIGHTS } from "@/lib/domain/score-display";

/** AI-supplied 0-10 inputs that feed the deterministic score. */
export type ScoreInputs = {
  brandability: number;
  clarity: number;
  memorability: number;
  pronunciation: number;
  spellingSimplicity: number;
  seoRelevance: number;
  premiumFeel: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/**
 * Availability sub-score (0-25). A .com that is genuinely available is the
 * gold standard; everything else is discounted.
 */
export function scoreAvailability(
  status: DomainAvailabilityStatus,
  tld: string,
  price?: DomainPrice
): number {
  const isDotCom = tld === "com";
  switch (status) {
    case "available":
      return isDotCom ? 25 : 18;
    case "premium": {
      // Premium domains are buyable but pricey — discount with price.
      const amount = price?.amount ?? 0;
      let base = isDotCom ? 16 : 12;
      if (amount > 5000) base -= 6;
      else if (amount > 1000) base -= 3;
      return clamp(base, 4, 25);
    }
    case "unknown":
      return 10;
    case "checking":
      return 8;
    case "taken":
      return 3;
    case "error":
      return 2;
    default:
      return 5;
  }
}

/** Convert a 0-10 AI input into a weighted bucket value. */
function bucket(value010: number, weight: number): number {
  return (clamp(value010, 0, 10) / 10) * weight;
}

/**
 * How easy a name is to spell (0-10), computed from the letters themselves.
 * Spelling is an objective property, so we derive it deterministically instead
 * of trusting the model's (or demo generator's) self-reported number.
 */
export function computeSpellingSimplicity(label: string): number {
  const letters = label.replace(/[^a-z0-9]/gi, "");
  let score = 10;
  if (hasHyphen(label)) score -= 2;
  if (hasNumber(label)) score -= 3;
  if (hasAwkwardSpelling(label)) score -= 4;
  // Letters people commonly second-guess when typing from memory.
  const trickyLetters = (letters.match(/[qxzjkv]/gi) ?? []).length;
  score -= Math.min(2, Math.floor(trickyLetters / 2));
  if (letters.length > 16) score -= 2;
  else if (letters.length > 12) score -= 1;
  return clamp(score, 1, 10);
}

/**
 * How easy a name is to say out loud (0-10), driven by syllable count and
 * consonant clustering rather than a model guess.
 */
export function computePronunciation(label: string): number {
  let score = 10;
  const syllables = countSyllableEstimate(label);
  if (syllables >= 6) score -= 3;
  else if (syllables >= 5) score -= 2;
  else if (syllables >= 4) score -= 1;
  if (hasAwkwardSpelling(label)) score -= 3;
  // A long run of consonants is a mouthful even without being "awkward".
  if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(label)) score -= 1;
  if (hasHyphen(label)) score -= 1;
  return clamp(score, 1, 10);
}

export type SmartScoreResult = {
  smartScore: number;
  scores: DomainScoreBreakdown;
  /** Human-readable penalty reasons applied, for transparency in the UI. */
  penalties: string[];
};

/**
 * Deterministic smart score. Combines availability (checked by a provider)
 * with AI-suggested quality inputs, then applies code-side penalties so the
 * final number never relies solely on the model's self-assessment.
 */
export function calculateSmartScore(params: {
  domain: string;
  status: DomainAvailabilityStatus;
  price?: DomainPrice;
  inputs: ScoreInputs;
  style?: DomainStyle;
  maxLength?: number;
}): SmartScoreResult {
  const { domain, status, price, inputs, maxLength } = params;
  const label = extractLabel(domain);
  const tld = extractTld(domain);

  const availability = scoreAvailability(status, tld, price);

  // Code adjusts the AI inputs based on observable properties of the name.
  const syllables = countSyllableEstimate(label);
  const longLabel = isTooLong(label, maxLength ?? 15);

  // Spelling and pronunciation are objective, so compute them from the letters
  // instead of trusting the model's (or demo generator's) self-reported number.
  const spelling010 = computeSpellingSimplicity(label);
  const pronunciation010 = computePronunciation(label);
  let memorability010 = inputs.memorability;
  let brandability010 = inputs.brandability;
  let clarity010 = inputs.clarity;

  const penalties: string[] = [];

  if (hasHyphen(label)) {
    brandability010 -= 2;
    penalties.push("Contains a hyphen");
  }
  if (hasNumber(label)) {
    brandability010 -= 2;
    penalties.push("Contains a number");
  }
  if (hasAwkwardSpelling(label)) {
    penalties.push("Awkward letter combination");
  }
  if (syllables > 4) {
    memorability010 -= 2;
    penalties.push("Many syllables");
  }
  if (longLabel) {
    memorability010 -= 2;
    brandability010 -= 1;
    penalties.push("Longer than ideal");
  }
  if (looksTrademarkRisky(label)) {
    brandability010 -= 4;
    clarity010 -= 1;
    penalties.push("Resembles a well-known brand");
  }
  if (hasSpammyWord(label)) {
    brandability010 -= 3;
    penalties.push("Contains a spammy keyword");
  }
  if (looksOverlyGeneric(label)) {
    brandability010 -= 2;
    memorability010 -= 1;
    penalties.push("Feels generic");
  }

  const scores: DomainScoreBreakdown = {
    availability,
    brandability: bucket(brandability010, SCORE_WEIGHTS.brandability),
    clarity: bucket(clarity010, SCORE_WEIGHTS.clarity),
    memorability: bucket(memorability010, SCORE_WEIGHTS.memorability),
    pronunciation: bucket(pronunciation010, SCORE_WEIGHTS.pronunciation),
    spelling: bucket(spelling010, SCORE_WEIGHTS.spelling),
    seo: bucket(inputs.seoRelevance, SCORE_WEIGHTS.seo),
    premiumFeel: bucket(inputs.premiumFeel, SCORE_WEIGHTS.premiumFeel),
  };

  const total =
    scores.availability +
    scores.brandability +
    scores.clarity +
    scores.memorability +
    scores.pronunciation +
    scores.spelling +
    scores.seo +
    scores.premiumFeel;

  return {
    smartScore: Math.round(clamp(total, 0, 100)),
    scores,
    penalties,
  };
}
