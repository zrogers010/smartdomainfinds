/**
 * Client-safe scoring constants + display helpers.
 *
 * This module intentionally contains NO scoring heuristics. The actual scoring
 * algorithm (penalties, spelling/pronunciation analysis, etc.) lives in
 * `scoring.ts`, which is imported only by server code so it never ships in the
 * browser bundle. UI components import the weights/formatter from here.
 */

/**
 * Maximum points per bucket. These sum to 100. Availability dominates because
 * an unavailable name — however clever — cannot be bought.
 */
export const SCORE_WEIGHTS = {
  availability: 25,
  brandability: 15,
  memorability: 15,
  clarity: 15,
  pronunciation: 10,
  spelling: 10,
  seo: 5,
  premiumFeel: 5,
} as const;

/** Rounded 0-100 display value for a bucket, normalized to its weight. */
export function scoreBucketPercent(
  value: number,
  bucketKey: keyof typeof SCORE_WEIGHTS
): number {
  const weight = SCORE_WEIGHTS[bucketKey];
  return Math.round((value / weight) * 100);
}
