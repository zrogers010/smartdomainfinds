"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { Dice5, Frown, Info, Search, Sparkles, SpellCheck2 } from "lucide-react";
import { toast } from "sonner";

import type {
  DomainResult,
  GenerateRequest,
  GenerateResponse,
  GenerateMoreResponse,
} from "@/lib/domain/types";
import {
  applyFiltersAndSort,
  DEFAULT_FILTERS,
  type DomainFilterState,
} from "@/lib/domain/filtering";
import { EXAMPLE_PROMPTS } from "@/lib/domain/ui-constants";
import { useRecentSearchesStore } from "@/lib/store/recent-searches-store";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import {
  DomainSearchForm,
  DEFAULT_PREFERENCES,
  buildRequest,
  type Preferences,
} from "./domain-search-form";
import { ExamplePrompts } from "./example-prompts";
import { InstantSearch } from "./instant-search";
import { DomainFilters } from "./domain-filters";
import { DomainResultsGrid } from "./domain-results-grid";
import { LoadingDomainGrid } from "./loading-domain-card";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { error?: string }).error ??
      "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return data as T;
}

function mergeResults(
  existing: DomainResult[],
  incoming: DomainResult[]
): DomainResult[] {
  const seen = new Set(existing.map((r) => r.domain));
  const fresh = incoming.filter((r) => !seen.has(r.domain));
  return [...existing, ...fresh];
}

type FinderMode = "search" | "idea";

export function DomainFinder() {
  const [mode, setMode] = React.useState<FinderMode>("search");
  const [idea, setIdea] = React.useState("");
  const [preferences, setPreferences] =
    React.useState<Preferences>(DEFAULT_PREFERENCES);
  const [filters, setFilters] =
    React.useState<DomainFilterState>(DEFAULT_FILTERS);
  const [results, setResults] = React.useState<DomainResult[] | null>(null);
  const [metadata, setMetadata] =
    React.useState<GenerateResponse["metadata"] | null>(null);
  const [generatingMoreFor, setGeneratingMoreFor] = React.useState<
    string | null
  >(null);

  const addRecent = useRecentSearchesStore((s) => s.add);
  const recent = useRecentSearchesStore((s) => s.searches);
  const mounted = useHydrated();
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const didInitFromUrl = React.useRef(false);

  const generate = useMutation({
    mutationFn: (request: GenerateRequest) =>
      postJson<GenerateResponse>("/api/generate", request),
    onSuccess: (data, request) => {
      setResults(data.results);
      setMetadata(data.metadata);
      setFilters(DEFAULT_FILTERS);
      addRecent(request.idea);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("q", request.idea);
        window.history.replaceState({}, "", url.toString());
      }
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const moreLikeThis = useMutation({
    mutationFn: (result: DomainResult) =>
      postJson<GenerateMoreResponse>("/api/generate-more-like-this", {
        originalDomain: result.domain,
        idea: idea || result.baseName,
        style: result.style,
      }),
    onMutate: (result) => setGeneratingMoreFor(result.domain),
    onSuccess: (data) => {
      if (data.results.length === 0) {
        toast.message("No new names found", {
          description: "Try adjusting your idea or preferences.",
        });
        return;
      }
      setResults((prev) => (prev ? mergeResults(prev, data.results) : data.results));
      toast.success(`Added ${data.results.length} similar names`);
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setGeneratingMoreFor(null),
  });

  const runSearch = React.useCallback(
    (ideaValue: string, prefs: Preferences) => {
      const trimmed = ideaValue.trim();
      if (trimmed.length < 8) {
        toast.error("Tell us a bit more about your idea (at least 8 characters).");
        return;
      }
      generate.mutate(buildRequest(trimmed, prefs));
    },
    [generate]
  );

  // Hydrate idea from a shareable URL (?q=) and auto-run once. This is a
  // one-time synchronization with an external system (the URL), so a single
  // synchronous setState here is intentional.
  React.useEffect(() => {
    if (didInitFromUrl.current) return;
    didInitFromUrl.current = true;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && q.trim().length >= 8) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("idea");
      setIdea(q);
      runSearch(q, DEFAULT_PREFERENCES);
    }
  }, [runSearch]);

  const handleExample = (prompt: string) => {
    setIdea(prompt);
    runSearch(prompt, preferences);
  };

  const handleRandomExample = () => {
    const pick =
      EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    handleExample(pick);
  };

  const visibleResults = React.useMemo(
    () => (results ? applyFiltersAndSort(results, filters) : []),
    [results, filters]
  );

  const isLoading = generate.isPending;
  const errorMessage = generate.isError
    ? (generate.error as Error).message
    : null;

  return (
    <div className="w-full">
      {/* Hero + search */}
      <section className="relative overflow-hidden bg-aurora">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" />
            AI-powered domain research assistant
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            {mode === "search"
              ? "Is your domain available? Find out instantly."
              : "Find the smartest available domain for your next idea."}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            {mode === "search"
              ? "Search any name to check availability across .com, .ai, .io, .co, .app, and .net — with brandable variations and prices."
              : "Describe your startup, product, newsletter, app, or side project. SmartDomainFinds generates brandable names, checks availability, scores each option, and helps you pick the best one."}
          </p>

          <ModeToggle mode={mode} onChange={setMode} />

          {mode === "search" ? (
            <div className="mt-6">
              <InstantSearch />
            </div>
          ) : (
            <>
              <div className="mx-auto mt-6 max-w-2xl">
                <DomainSearchForm
                  idea={idea}
                  onIdeaChange={setIdea}
                  preferences={preferences}
                  onPreferencesChange={setPreferences}
                  onSubmit={() => runSearch(idea, preferences)}
                  isLoading={isLoading}
                  error={errorMessage}
                />
              </div>

              <div className="mt-5 flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRandomExample}
                  disabled={isLoading}
                  className="text-muted-foreground"
                >
                  <Dice5 className="size-4" />
                  Try an example
                </Button>
                <ExamplePrompts onSelect={handleExample} />

                {mounted && recent.length > 0 && !results && (
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="text-muted-foreground">Recent:</span>
                    {recent.slice(0, 4).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleExample(r)}
                        className="max-w-[12rem] truncate rounded-md bg-secondary px-2 py-1 text-secondary-foreground transition-colors hover:bg-accent"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* AI generator results (idea mode only) */}
      <section
        ref={resultsRef}
        className={`mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6 ${
          mode === "idea" ? "" : "hidden"
        }`}
      >
        {isLoading && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generating and checking domains...
            </p>
            <LoadingDomainGrid count={6} />
          </div>
        )}

        {!isLoading && results && (
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  {visibleResults.length} of {results.length}{" "}
                  {results.length === 1 ? "domain" : "domains"}
                </h2>
                {metadata && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info className="size-3.5" />
                    Checked {metadata.checkedCount} via {metadata.provider}
                    {metadata.usedFallback && " · demo suggestions"}
                  </p>
                )}
              </div>

              {metadata?.corrections && metadata.corrections.length > 0 && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <SpellCheck2 className="size-4 shrink-0 text-primary" />
                  <span>
                    Showing results for{" "}
                    <span className="font-medium text-foreground">
                      {metadata.correctedIdea}
                    </span>
                    {" — corrected "}
                    {metadata.corrections.map((c, i) => (
                      <React.Fragment key={`${c.from}-${i}`}>
                        {i > 0 && ", "}
                        <span className="line-through">{c.from}</span>
                        {" → "}
                        <span className="font-medium text-foreground">
                          {c.to}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </p>
              )}
            </div>

            <DomainFilters
              results={results}
              filters={filters}
              onChange={setFilters}
            />

            {visibleResults.length > 0 ? (
              <DomainResultsGrid
                results={visibleResults}
                onMoreLikeThis={(r) => moreLikeThis.mutate(r)}
                generatingMoreFor={generatingMoreFor}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
                <Frown className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  No domains match these filters
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        )}

        {!isLoading && !results && (
          <EmptyState onExample={handleRandomExample} />
        )}
      </section>
    </div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: FinderMode;
  onChange: (mode: FinderMode) => void;
}) {
  const options: { value: FinderMode; label: string; Icon: typeof Search }[] = [
    { value: "search", label: "Search a name", Icon: Search },
    { value: "idea", label: "Describe an idea", Icon: Sparkles },
  ];
  return (
    <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 shadow-sm backdrop-blur-sm">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onExample }: { onExample: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 py-14 text-center">
      <div className="rounded-2xl bg-primary/10 p-4">
        <Search className="size-7 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Your domains will appear here</h2>
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
          Describe an idea above and we&apos;ll generate a ranked shortlist of
          available, brandable domains.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onExample}>
        <Dice5 className="size-4" />
        Try an example
      </Button>
    </div>
  );
}
