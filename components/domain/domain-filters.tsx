"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

import {
  DOMAIN_STYLE_LABELS,
  type DomainResult,
  type DomainStyle,
} from "@/lib/domain/types";
import {
  DEFAULT_FILTERS,
  availableStyles,
  availableTlds,
  type AvailabilityFilter,
  type DomainFilterState,
  type SortKey,
} from "@/lib/domain/filtering";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All results" },
  { value: "available", label: "Available only" },
  { value: "buyable", label: "Available + premium" },
  { value: "premium", label: "Premium only" },
  { value: "hide_taken", label: "Hide taken" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "smartScore", label: "Smart score" },
  { value: "availability", label: "Availability" },
  { value: "shortest", label: "Shortest" },
  { value: "brandability", label: "Brandability" },
  { value: "seo", label: "SEO relevance" },
  { value: "premiumFeel", label: "Premium feel" },
  { value: "memorability", label: "Memorability" },
];

export function DomainFilters({
  results,
  filters,
  onChange,
}: {
  results: DomainResult[];
  filters: DomainFilterState;
  onChange: (next: DomainFilterState) => void;
}) {
  const set = <K extends keyof DomainFilterState>(
    key: K,
    value: DomainFilterState[K]
  ) => onChange({ ...filters, [key]: value });

  const tlds = availableTlds(results);
  const styles = availableStyles(results);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          Filters &amp; sort
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sort by</Label>
          <Select
            value={filters.sort}
            onValueChange={(v) => set("sort", v as SortKey)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Availability</Label>
          <Select
            value={filters.availability}
            onValueChange={(v) => set("availability", v as AvailabilityFilter)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Style</Label>
          <Select
            value={filters.style}
            onValueChange={(v) => set("style", v as DomainStyle | "all")}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All styles</SelectItem>
              {styles.map((s) => (
                <SelectItem key={s} value={s}>
                  {DOMAIN_STYLE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">TLD</Label>
          <Select value={filters.tld} onValueChange={(v) => set("tld", v)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All TLDs</SelectItem>
              {tlds.map((t) => (
                <SelectItem key={t} value={t}>
                  .{t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Min smart score
            </Label>
            <span className="text-xs font-medium tabular-nums">
              {filters.minScore}
            </span>
          </div>
          <Slider
            value={[filters.minScore]}
            min={0}
            max={100}
            step={5}
            onValueChange={([v]) => set("minScore", v)}
            className="py-1.5"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Max length</Label>
            <span className="text-xs font-medium tabular-nums">
              {filters.maxLength ?? "Any"}
            </span>
          </div>
          <Slider
            value={[filters.maxLength ?? 30]}
            min={4}
            max={30}
            step={1}
            onValueChange={([v]) => set("maxLength", v >= 30 ? null : v)}
            className="py-1.5"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch
            checked={filters.onlyDotCom}
            onCheckedChange={(v) => set("onlyDotCom", v)}
          />
          Only .com
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch
            checked={filters.hideHyphens}
            onCheckedChange={(v) => set("hideHyphens", v)}
          />
          Hide hyphens
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch
            checked={filters.hideNumbers}
            onCheckedChange={(v) => set("hideNumbers", v)}
          />
          Hide numbers
        </label>
      </div>
    </div>
  );
}
