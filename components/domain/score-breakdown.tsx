import { SCORE_WEIGHTS, scoreBucketPercent } from "@/lib/domain/scoring";
import type { DomainScoreBreakdown } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

// Availability is intentionally omitted: it's a property of the domain (shown
// as the status badge), not a quality dimension of the name itself.
const ROWS: Array<{ key: keyof typeof SCORE_WEIGHTS; label: string }> = [
  { key: "brandability", label: "Brandability" },
  { key: "memorability", label: "Memorability" },
  { key: "clarity", label: "Clarity" },
  { key: "pronunciation", label: "Pronunciation" },
  { key: "spelling", label: "Spelling" },
  { key: "seo", label: "SEO relevance" },
  { key: "premiumFeel", label: "Premium feel" },
];

export function ScoreBreakdown({
  scores,
  className,
}: {
  scores: DomainScoreBreakdown;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-2.5 sm:grid-cols-2", className)}>
      {ROWS.map(({ key, label }) => {
        const value = scores[key];
        const pct = scoreBucketPercent(value, key);
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium tabular-nums">
                {Math.round(value)}
                <span className="text-muted-foreground">
                  /{SCORE_WEIGHTS[key]}
                </span>
              </dd>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  pct >= 80
                    ? "bg-success"
                    : pct >= 50
                      ? "bg-primary"
                      : "bg-amber-500"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </dl>
  );
}
