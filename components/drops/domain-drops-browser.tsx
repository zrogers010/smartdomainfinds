"use client";

import * as React from "react";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  ExternalLink,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import {
  CURATED_DOMAINS,
  curatedCategories,
  curatedDomainToResult,
  curatedTlds,
  type CuratedDomainFind,
} from "@/lib/content/domain-drops";
import { getRegistrarSearchUrl } from "@/lib/domain/utils";
import { useShortlistStore } from "@/lib/store/shortlist-store";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "score" | "newest" | "shortest";

const CATEGORIES = curatedCategories();
const TLDS = curatedTlds();

function getTld(domain: string): string {
  return domain.split(".").pop() ?? "";
}

function getLabel(domain: string): string {
  return domain.split(".").slice(0, -1).join(".");
}

function availabilityLabel(status: CuratedDomainFind["availability"]): string {
  if (status === "availableish") return "Available-ish";
  if (status === "registered") return "Registered";
  return "Unknown";
}

function checkedDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function scoreTone(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 70) return "text-primary";
  return "text-amber-500";
}

function matchesQuery(find: CuratedDomainFind, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    find.domain,
    find.category,
    find.tone,
    find.summary,
    find.buyerType,
    ...find.useCases,
  ].some((value) => value.toLowerCase().includes(normalized));
}

export function DomainDropsBrowser() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [tld, setTld] = React.useState("all");
  const [minScore, setMinScore] = React.useState("all");
  const [sort, setSort] = React.useState<SortKey>("score");
  const items = useShortlistStore((s) => s.items);
  const toggle = useShortlistStore((s) => s.toggle);

  const visible = React.useMemo(() => {
    const min = minScore === "all" ? 0 : Number(minScore);
    const filtered = CURATED_DOMAINS.filter((find) => {
      if (!matchesQuery(find, query)) return false;
      if (category !== "all" && find.category !== category) return false;
      if (tld !== "all" && getTld(find.domain) !== tld) return false;
      if (find.score < min) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "shortest") {
        return getLabel(a.domain).length - getLabel(b.domain).length;
      }
      if (sort === "newest") {
        return b.checkedAt.localeCompare(a.checkedAt) || b.score - a.score;
      }
      return b.score - a.score;
    });
  }, [category, minScore, query, sort, tld]);

  const savedDomains = React.useMemo(
    () => new Set(items.map((item) => item.domain)),
    [items]
  );

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setTld("all");
    setMinScore("all");
    setSort("score");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_8rem_8rem_9rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search domains, buyers, categories..."
              className="pl-9"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tld} onValueChange={setTld}>
            <SelectTrigger>
              <SelectValue placeholder="TLD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All TLDs</SelectItem>
              {TLDS.map((item) => (
                <SelectItem key={item} value={item}>
                  .{item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={minScore} onValueChange={setMinScore}>
            <SelectTrigger>
              <SelectValue placeholder="Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any score</SelectItem>
              <SelectItem value="80">80+</SelectItem>
              <SelectItem value="75">75+</SelectItem>
              <SelectItem value="70">70+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Top score</SelectItem>
              <SelectItem value="newest">Newest check</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Filter className="size-3.5" />
            Showing {visible.length} of {CURATED_DOMAINS.length} curated finds
          </span>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <SlidersHorizontal className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((find) => (
            <DropDomainCard
              key={find.domain}
              find={find}
              saved={savedDomains.has(find.domain)}
              onToggle={() => {
                toggle(curatedDomainToResult(find));
                toast[savedDomains.has(find.domain) ? "message" : "success"](
                  savedDomains.has(find.domain)
                    ? "Removed from shortlist"
                    : "Saved to shortlist",
                  { description: find.domain }
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No curated domains match.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader category or lower score threshold.
          </p>
        </div>
      )}
    </div>
  );
}

function DropDomainCard({
  find,
  saved,
  onToggle,
}: {
  find: CuratedDomainFind;
  saved: boolean;
  onToggle: () => void;
}) {
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(find.domain);
      toast.success("Copied", { description: find.domain });
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }, [find.domain]);

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-mono text-lg font-semibold tracking-tight sm:text-xl">
              {find.domain}
            </h2>
            <Badge variant="secondary">{find.category}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold",
                find.availability === "availableish"
                  ? "bg-success/12 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {availabilityLabel(find.availability)}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
              {find.tone}
            </span>
            <span>Checked {checkedDate(find.checkedAt)}</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className={cn("text-2xl font-bold tabular-nums", scoreTone(find.score))}>
            {find.score}
          </div>
          <div className="text-xs font-medium text-muted-foreground">Score</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {find.summary}
      </p>

      <div className="mt-4 rounded-lg border border-border/70 bg-muted/35 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Likely buyer
        </p>
        <p className="mt-1 text-sm font-medium">{find.buyerType}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.entries(find.scores).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="capitalize text-muted-foreground">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="font-medium tabular-nums">{value}/10</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full",
                  value >= 8 ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {find.useCases.map((useCase) => (
          <span
            key={useCase}
            className="rounded-md bg-secondary px-2 py-1 text-xs font-medium"
          >
            {useCase}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
        <Button
          type="button"
          size="sm"
          variant={saved ? "secondary" : "default"}
          onClick={onToggle}
        >
          {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          {saved ? "Saved" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
          <Copy className="size-4" />
          Copy
        </Button>
        <Button asChild size="sm" variant="ghost" className="ml-auto">
          <a
            href={getRegistrarSearchUrl(find.domain)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Registrar
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </article>
  );
}

