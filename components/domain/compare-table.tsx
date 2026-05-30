"use client";

import { SCORE_WEIGHTS } from "@/lib/domain/scoring";
import type { DomainResult } from "@/lib/domain/types";
import { DOMAIN_STYLE_LABELS } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";
import { DomainAvailabilityBadge } from "./domain-availability-badge";

const METRIC_ROWS: Array<{
  label: string;
  get: (r: DomainResult) => string | number;
}> = [
  { label: "Smart score", get: (r) => r.smartScore },
  { label: "Availability", get: (r) => r.availability },
  { label: "Style", get: (r) => DOMAIN_STYLE_LABELS[r.style] },
  {
    label: "Brandability",
    get: (r) => Math.round((r.scores.brandability / SCORE_WEIGHTS.brandability) * 100),
  },
  {
    label: "Memorability",
    get: (r) => Math.round((r.scores.memorability / SCORE_WEIGHTS.memorability) * 100),
  },
  {
    label: "Clarity",
    get: (r) => Math.round((r.scores.clarity / SCORE_WEIGHTS.clarity) * 100),
  },
  {
    label: "SEO",
    get: (r) => Math.round((r.scores.seo / SCORE_WEIGHTS.seo) * 100),
  },
];

export function CompareTable({ items }: { items: DomainResult[] }) {
  if (items.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Save at least two domains to compare them side by side.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card p-2 text-left text-xs font-medium text-muted-foreground">
              Metric
            </th>
            {items.map((r) => (
              <th
                key={r.id}
                className="min-w-[130px] p-2 text-left align-bottom"
              >
                <div className="font-semibold">
                  {r.baseName}
                  <span className="text-muted-foreground">.{r.tld}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {METRIC_ROWS.map((row, i) => (
            <tr key={row.label} className={cn(i % 2 === 0 && "bg-muted/40")}>
              <td className="sticky left-0 z-10 bg-inherit p-2 text-xs font-medium text-muted-foreground">
                {row.label}
              </td>
              {items.map((r) => (
                <td key={r.id} className="p-2 tabular-nums">
                  {row.label === "Availability" ? (
                    <DomainAvailabilityBadge status={r.availability} />
                  ) : (
                    row.get(r)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
