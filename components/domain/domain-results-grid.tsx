"use client";

import type { DomainResult } from "@/lib/domain/types";
import { DomainResultCard } from "./domain-result-card";

export function DomainResultsGrid({
  results,
  onMoreLikeThis,
  generatingMoreFor,
}: {
  results: DomainResult[];
  onMoreLikeThis?: (result: DomainResult) => void;
  generatingMoreFor?: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {results.map((result) => (
        <div key={result.id} className="animate-in-up">
          <DomainResultCard
            result={result}
            onMoreLikeThis={onMoreLikeThis}
            isGeneratingMore={generatingMoreFor === result.domain}
          />
        </div>
      ))}
    </div>
  );
}
