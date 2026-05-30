"use client";

import * as React from "react";
import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Copy,
  ExternalLink,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import type { DomainResult } from "@/lib/domain/types";
import { useShortlistStore } from "@/lib/store/shortlist-store";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DomainAvailabilityBadge } from "./domain-availability-badge";
import { DomainScoreBadge } from "./domain-score-badge";
import { DomainStyleBadge } from "./domain-style-badge";
import { ScoreBreakdown } from "./score-breakdown";

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

export function DomainResultCard({
  result,
  onMoreLikeThis,
  isGeneratingMore = false,
}: {
  result: DomainResult;
  onMoreLikeThis?: (result: DomainResult) => void;
  isGeneratingMore?: boolean;
}) {
  const items = useShortlistStore((s) => s.items);
  const toggle = useShortlistStore((s) => s.toggle);
  const saved = items.some((i) => i.domain === result.domain);
  const [showDetails, setShowDetails] = React.useState(false);

  const isAvailable = result.availability === "available";
  const isPremium = result.availability === "premium";

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.domain);
      toast.success("Copied", { description: result.domain });
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }, [result.domain]);

  const handleSave = React.useCallback(() => {
    toggle(result);
    toast[saved ? "message" : "success"](
      saved ? "Removed from shortlist" : "Saved to shortlist",
      { description: result.domain }
    );
  }, [toggle, result, saved]);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md sm:p-5",
        isAvailable
          ? "border-success/35 ring-1 ring-success/10"
          : "border-border"
      )}
    >
      {isAvailable && (
        <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-success/70" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {result.baseName}
              <span className="text-muted-foreground">.{result.tld}</span>
            </h3>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DomainAvailabilityBadge status={result.availability} />
            <DomainStyleBadge style={result.style} />
            {isPremium && result.price && (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-300">
                {formatPrice(result.price.amount, result.price.currency)}/yr
              </span>
            )}
            {isAvailable && result.price && (
              <span className="text-xs text-muted-foreground">
                {formatPrice(result.price.amount, result.price.currency)}/yr
              </span>
            )}
          </div>
        </div>

        <DomainScoreBadge score={result.smartScore} size={52} showLabel />
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {result.rationale}
      </p>

      {result.alternatives.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>Also free:</span>
          {result.alternatives.map((alt) => (
            <span
              key={alt}
              className="rounded-md bg-secondary px-1.5 py-0.5 font-medium text-foreground"
            >
              {alt}
            </span>
          ))}
        </div>
      )}

      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleTrigger asChild>
          <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                showDetails && "rotate-180"
              )}
            />
            {showDetails ? "Hide details" : "Score breakdown & risks"}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="mt-3 space-y-4 rounded-lg border border-border/70 bg-muted/40 p-3">
            <ScoreBreakdown scores={result.scores} />
            {result.risks.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <TriangleAlert className="size-3.5 text-amber-500" />
                  Potential concerns
                </p>
                <ul className="space-y-1">
                  {result.risks.map((risk, i) => (
                    <li
                      key={i}
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <Button
          size="sm"
          variant={saved ? "secondary" : "default"}
          onClick={handleSave}
          className="gap-1.5"
        >
          {saved ? (
            <BookmarkCheck className="size-4" />
          ) : (
            <Bookmark className="size-4" />
          )}
          {saved ? "Saved" : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleCopy}>
          <Copy className="size-4" />
          Copy
        </Button>
        {onMoreLikeThis && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMoreLikeThis(result)}
            disabled={isGeneratingMore}
          >
            <Sparkles className="size-4" />
            More like this
          </Button>
        )}
        <Button asChild size="sm" variant="ghost" className="ml-auto">
          <a
            href={result.registrarUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check registrar
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
