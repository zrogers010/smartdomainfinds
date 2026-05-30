"use client";

import * as React from "react";
import { ChevronDown, Loader2, Search, SlidersHorizontal } from "lucide-react";

import {
  DOMAIN_STYLES,
  DOMAIN_STYLE_LABELS,
  SUPPORTED_TLDS,
  type DomainStyle,
  type GenerateRequest,
} from "@/lib/domain/types";
import { STYLE_DESCRIPTIONS } from "@/lib/domain/ui-constants";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Preferences = {
  industry: string;
  tone: string;
  styles: DomainStyle[];
  tlds: string[];
  maxLength: number; // 30 == "any"
  mustInclude: string;
  avoidWords: string;
  onlyAvailableDotCom: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  industry: "",
  tone: "",
  styles: [],
  tlds: [],
  maxLength: 30,
  mustInclude: "",
  avoidWords: "",
  onlyAvailableDotCom: false,
};

function splitWords(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * Live spelling suggestion for the idea field. Debounces the input, asks the
 * server to spell-check it, and returns a corrected string when it differs
 * (and hasn't been dismissed). Non-destructive — the caller decides to apply it.
 */
function useSpellingSuggestion(idea: string): {
  suggestion: string | null;
  dismiss: () => void;
} {
  const debounced = useDebounced(idea, 500);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const dismissedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const text = debounced.trim();
    if (text.length < 8) {
      setSuggestion(null);
      return;
    }
    const controller = new AbortController();
    fetch("/api/spellcheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { corrected?: string; corrections?: unknown[] } | null) => {
        const corrected = data?.corrected;
        if (
          corrected &&
          data?.corrections?.length &&
          corrected !== text &&
          corrected !== dismissedRef.current
        ) {
          setSuggestion(corrected);
        } else {
          setSuggestion(null);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [debounced]);

  const dismiss = React.useCallback(() => {
    dismissedRef.current = suggestion;
    setSuggestion(null);
  }, [suggestion]);

  return { suggestion, dismiss };
}

export function buildRequest(
  idea: string,
  prefs: Preferences
): GenerateRequest {
  const mustInclude = splitWords(prefs.mustInclude);
  const avoidWords = splitWords(prefs.avoidWords);
  return {
    idea: idea.trim(),
    industry: prefs.industry.trim() || undefined,
    tone: prefs.tone.trim() || undefined,
    styles: prefs.styles.length ? prefs.styles : undefined,
    tlds: prefs.tlds.length ? prefs.tlds : undefined,
    maxLength: prefs.maxLength < 30 ? prefs.maxLength : undefined,
    mustInclude: mustInclude.length ? mustInclude : undefined,
    avoidWords: avoidWords.length ? avoidWords : undefined,
    onlyAvailableDotCom: prefs.onlyAvailableDotCom || undefined,
  };
}

function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function DomainSearchForm({
  idea,
  onIdeaChange,
  preferences,
  onPreferencesChange,
  onSubmit,
  isLoading = false,
  error,
}: {
  idea: string;
  onIdeaChange: (idea: string) => void;
  preferences: Preferences;
  onPreferencesChange: (prefs: Preferences) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  const [showPrefs, setShowPrefs] = React.useState(false);
  const prefs = preferences;
  const { suggestion, dismiss } = useSpellingSuggestion(idea);

  const setPref = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => onPreferencesChange({ ...prefs, [key]: value });

  const toggleStyle = (style: DomainStyle) =>
    setPref(
      "styles",
      prefs.styles.includes(style)
        ? prefs.styles.filter((s) => s !== style)
        : [...prefs.styles, style]
    );

  const toggleTld = (tld: string) =>
    setPref(
      "tlds",
      prefs.tlds.includes(tld)
        ? prefs.tlds.filter((t) => t !== tld)
        : [...prefs.tlds, tld]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) onSubmit();
  };

  const activePrefCount =
    (prefs.industry ? 1 : 0) +
    (prefs.tone ? 1 : 0) +
    prefs.styles.length +
    prefs.tlds.length +
    (prefs.maxLength < 30 ? 1 : 0) +
    (prefs.mustInclude ? 1 : 0) +
    (prefs.avoidWords ? 1 : 0) +
    (prefs.onlyAvailableDotCom ? 1 : 0);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-border bg-card/80 p-2 shadow-xl shadow-primary/5 backdrop-blur-sm">
        <Textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e);
          }}
          placeholder="Describe your startup, product, newsletter, app, or side project..."
          className="min-h-[112px] resize-none border-0 bg-transparent px-4 py-3 text-base shadow-none focus-visible:ring-0"
          aria-label="Describe your idea"
        />

        {suggestion && (
          <div className="px-4 pb-1 text-left text-sm text-muted-foreground">
            Did you mean{" "}
            <button
              type="button"
              onClick={() => {
                onIdeaChange(suggestion);
                dismiss();
              }}
              className="font-medium text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              {suggestion}
            </button>
            ?
            <button
              type="button"
              onClick={dismiss}
              className="ml-2 text-xs text-muted-foreground/70 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-1">
          <Collapsible open={showPrefs} onOpenChange={setShowPrefs}>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                <SlidersHorizontal className="size-4" />
                Preferences
                {activePrefCount > 0 && (
                  <span className="rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                    {activePrefCount}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    showPrefs && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                ⌘
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>
            </span>
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              disabled={isLoading || idea.trim().length < 8}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {isLoading ? "Generating..." : "Generate domains"}
            </Button>
          </div>
        </div>

        <Collapsible open={showPrefs} onOpenChange={setShowPrefs}>
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="mt-1 space-y-5 border-t border-border/60 px-3 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={prefs.industry}
                    onChange={(e) => setPref("industry", e.target.value)}
                    placeholder="e.g. SaaS, fintech, pets"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    value={prefs.tone}
                    onChange={(e) => setPref("tone", e.target.value)}
                    placeholder="e.g. playful, premium, technical"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Name styles</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DOMAIN_STYLES.map((style) => (
                    <Tooltip key={style}>
                      <TooltipTrigger asChild>
                        <span>
                          <Chip
                            active={prefs.styles.includes(style)}
                            onClick={() => toggleStyle(style)}
                          >
                            {DOMAIN_STYLE_LABELS[style]}
                          </Chip>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {STYLE_DESCRIPTIONS[style]}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred TLDs</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_TLDS.map((tld) => (
                    <Chip
                      key={tld}
                      active={prefs.tlds.includes(tld)}
                      onClick={() => toggleTld(tld)}
                    >
                      .{tld}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="mustInclude">Must include words</Label>
                  <Input
                    id="mustInclude"
                    value={prefs.mustInclude}
                    onChange={(e) => setPref("mustInclude", e.target.value)}
                    placeholder="comma separated"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="avoidWords">Words to avoid</Label>
                  <Input
                    id="avoidWords"
                    value={prefs.avoidWords}
                    onChange={(e) => setPref("avoidWords", e.target.value)}
                    placeholder="comma separated"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Max name length</Label>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {prefs.maxLength < 30 ? `${prefs.maxLength} chars` : "Any"}
                  </span>
                </div>
                <Slider
                  value={[prefs.maxLength]}
                  min={4}
                  max={30}
                  step={1}
                  onValueChange={([v]) => setPref("maxLength", v)}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Switch
                  checked={prefs.onlyAvailableDotCom}
                  onCheckedChange={(v) => setPref("onlyAvailableDotCom", v)}
                />
                Only show available .com domains
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}
    </form>
  );
}
