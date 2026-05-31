"use client";

import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  SUPPORTED_TLDS,
  type DomainAvailabilityStatus,
  type DomainResult,
  type SearchResponse,
} from "@/lib/domain/types";
import { getRegistrarSearchUrl } from "@/lib/domain/utils";
import { useShortlistStore } from "@/lib/store/shortlist-store";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type StatusFilter = "all" | "available" | "premium" | "taken";

const DOT_CLASSES: Record<DomainAvailabilityStatus, string> = {
  available: "bg-success",
  premium: "bg-amber-500",
  taken: "bg-destructive",
  unknown: "bg-muted-foreground/50",
  checking: "bg-muted-foreground/50",
  error: "bg-destructive",
};

const STATUS_LABEL: Record<DomainAvailabilityStatus, string> = {
  available: "Available",
  premium: "Premium",
  taken: "Taken",
  unknown: "Unknown",
  checking: "Checking",
  error: "Unavailable",
};

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

/**
 * Run the instant search on the server. Candidate generation + scoring happen
 * in /api/search; we only send the raw query and render the results.
 */
async function fetchSearch(
  query: string,
  part: "primary" | "rest"
): Promise<SearchResponse> {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, part }),
  });
  if (!res.ok) throw new Error("Could not check availability.");
  return res.json();
}

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function InstantSearch() {
  const [raw, setRaw] = React.useState("");
  const debounced = useDebounced(raw, 350);
  const normalizedQuery = debounced.trim().toLowerCase();
  const enabled = normalizedQuery.replace(/[^a-z0-9]/g, "").length >= 3;

  // Headline domain: its own fast query so it renders almost immediately,
  // independent of the slower batch of TLDs + variations.
  const primaryQuery = useQuery({
    queryKey: ["domain-search-primary", normalizedQuery],
    queryFn: () => fetchSearch(normalizedQuery, "primary"),
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  // Everything else loads in parallel and fills in when ready. keepPreviousData
  // keeps the last results on screen while a new query resolves (no flicker).
  const restQuery = useQuery({
    queryKey: ["domain-search-rest", normalizedQuery],
    queryFn: () => fetchSearch(normalizedQuery, "rest"),
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  const primary = primaryQuery.data?.primary ?? undefined;
  const exact = React.useMemo(() => {
    const list = restQuery.data?.exact ?? [];
    // Present fairly: .com always leads, then available/premium float up, with
    // the original (TLD-priority) order preserved as the tiebreaker.
    const availRank = (s: DomainAvailabilityStatus) =>
      s === "available" ? 0 : s === "premium" ? 1 : 2;
    return list
      .map((r, i) => ({ r, i }))
      .sort((a, b) => {
        const aCom = a.r.tld === "com" ? 0 : 1;
        const bCom = b.r.tld === "com" ? 0 : 1;
        if (aCom !== bCom) return aCom - bCom;
        const ar = availRank(a.r.availability);
        const br = availRank(b.r.availability);
        if (ar !== br) return ar - br;
        return a.i - b.i;
      })
      .map((x) => x.r);
  }, [restQuery.data]);
  const variations = React.useMemo(
    () => restQuery.data?.variations ?? [],
    [restQuery.data]
  );
  const isFetching = primaryQuery.isFetching || restQuery.isFetching;
  const isError = primaryQuery.isError || restQuery.isError;
  const hasData = Boolean(primary) || exact.length > 0;

  const counts = React.useMemo(() => {
    const all = [...(primary ? [primary] : []), ...exact, ...variations];
    return {
      available: all.filter((r) => r.availability === "available").length,
      premium: all.filter((r) => r.availability === "premium").length,
      taken: all.filter((r) => r.availability === "taken").length,
    };
  }, [primary, exact, variations]);

  const matches = (r: DomainResult) => {
    switch (statusFilter) {
      case "available":
        return r.availability === "available";
      case "premium":
        return r.availability === "premium";
      case "taken":
        return r.availability === "taken";
      default:
        return true;
    }
  };

  const anyMatch =
    (primary && matches(primary)) ||
    exact.some(matches) ||
    variations.some(matches);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          autoFocus
          placeholder="Search a domain, e.g. smartdomainfinds.com"
          className="h-14 rounded-2xl border-border bg-card/80 pl-12 pr-12 text-base shadow-xl shadow-primary/5 backdrop-blur-sm focus-visible:ring-2"
          aria-label="Search a domain or name"
        />
        {isFetching && (
          <Loader2 className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Empty prompt */}
      {!enabled && !hasData && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Type a name to instantly check availability across .com, .ai, .io and
          30+ more extensions — plus brandable variations.
        </p>
      )}

      {/* Results */}
      {enabled && (
        <div className="mt-6 space-y-6 text-left">
          {/* Primary exact match */}
          {primary ? (
            <PrimaryResult result={primary} />
          ) : (
            <Skeleton className="h-20 w-full rounded-2xl" />
          )}

          {isError && (
            <p className="text-center text-sm text-destructive">
              Could not check availability. Please try again.
            </p>
          )}

          {/* Status filter + counts */}
          {hasData && (
            <div className="flex flex-wrap items-center gap-2">
              <FilterChip
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
                label="All"
              />
              <FilterChip
                active={statusFilter === "available"}
                onClick={() => setStatusFilter("available")}
                label="Available"
                count={counts.available}
                dot="bg-success"
              />
              <FilterChip
                active={statusFilter === "premium"}
                onClick={() => setStatusFilter("premium")}
                label="Premium"
                count={counts.premium}
                dot="bg-amber-500"
              />
              <FilterChip
                active={statusFilter === "taken"}
                onClick={() => setStatusFilter("taken")}
                label="Taken"
                count={counts.taken}
                dot="bg-destructive"
              />
            </div>
          )}

          {/* Extensions */}
          <Section title="All extensions">
            {exact.length > 0 ? (
              <ResultGrid results={exact.filter(matches)} />
            ) : (
              <GridSkeleton rows={SUPPORTED_TLDS.length - 1} />
            )}
          </Section>

          {/* Variations */}
          {(variations.length > 0 || restQuery.isFetching) && (
            <Section title="Name variations">
              {variations.length > 0 ? (
                <ResultGrid results={variations.filter(matches)} />
              ) : (
                <GridSkeleton rows={6} />
              )}
            </Section>
          )}

          {hasData && !anyMatch && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results match this filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GridSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-[58px] w-full rounded-xl" />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dot)} />}
      {label}
      {typeof count === "number" && (
        <span className="tabular-nums opacity-70">{count}</span>
      )}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ResultGrid({ results }: { results: DomainResult[] }) {
  if (results.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {results.map((r) => (
        <SearchResultRow key={r.domain} result={r} />
      ))}
    </div>
  );
}

function useSaveToggle(result: DomainResult) {
  const items = useShortlistStore((s) => s.items);
  const toggle = useShortlistStore((s) => s.toggle);
  const saved = items.some((i) => i.domain === result.domain);
  const onToggle = () => {
    toggle(result);
    toast[saved ? "message" : "success"](
      saved ? "Removed from shortlist" : "Saved to shortlist",
      { description: result.domain }
    );
  };
  return { saved, onToggle };
}

function PrimaryResult({ result }: { result: DomainResult }) {
  const { saved, onToggle } = useSaveToggle(result);
  const buyable =
    result.availability === "available" || result.availability === "premium";
  const [label, tld] = splitDomain(result.domain);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.domain).catch(() => {});
    toast.success("Copied", { description: result.domain });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between",
        result.availability === "available"
          ? "border-success/40 bg-success/5"
          : result.availability === "premium"
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border bg-card"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              DOT_CLASSES[result.availability]
            )}
          />
          <span className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {label}
            <span className="text-muted-foreground">.{tld}</span>
          </span>
        </div>
        <p className="mt-1 pl-5 text-sm text-muted-foreground">
          {STATUS_LABEL[result.availability]}
          {result.price &&
            ` · ${formatPrice(result.price.amount, result.price.currency)}/yr`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy">
          <Copy className="size-4" />
        </Button>
        <Button
          variant={saved ? "secondary" : "outline"}
          size="icon"
          onClick={onToggle}
          aria-label={saved ? "Saved" : "Save"}
        >
          {saved ? (
            <BookmarkCheck className="size-4" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </Button>
        <Button asChild variant={buyable ? "gradient" : "outline"} size="lg">
          <a href={getRegistrarSearchUrl(result.domain)} target="_blank" rel="noopener noreferrer">
            {buyable ? "Get it" : "Look up"}
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function SearchResultRow({ result }: { result: DomainResult }) {
  const { saved, onToggle } = useSaveToggle(result);
  const buyable =
    result.availability === "available" || result.availability === "premium";
  const [label, tld] = splitDomain(result.domain);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.domain).catch(() => {});
    toast.success("Copied", { description: result.domain });
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/30">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          DOT_CLASSES[result.availability]
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {label}
          <span className="text-muted-foreground">.{tld}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {STATUS_LABEL[result.availability]}
          {result.price &&
            ` · ${formatPrice(result.price.amount, result.price.currency)}/yr`}
        </p>
      </div>
      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        <Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Copy">
          <Copy className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={saved ? "Saved" : "Save"}
        >
          {saved ? (
            <BookmarkCheck className="size-4 text-primary" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </Button>
      </div>
      <Button
        asChild
        size="sm"
        variant={buyable ? "default" : "ghost"}
        className="shrink-0"
      >
        <a href={getRegistrarSearchUrl(result.domain)} target="_blank" rel="noopener noreferrer">
          {buyable ? "Get" : "Look up"}
        </a>
      </Button>
    </div>
  );
}

function splitDomain(domain: string): [string, string] {
  const idx = domain.lastIndexOf(".");
  if (idx === -1) return [domain, ""];
  return [domain.slice(0, idx), domain.slice(idx + 1)];
}
