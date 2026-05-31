"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EnsResult } from "@/lib/tools/types";

export function EnsTool() {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<EnsResult | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error("Enter a .eth name to check.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "ENS lookup failed.");
      }
      setResult((await res.json()) as EnsResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ENS lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="yourbrand"
            className="h-11 pr-14 text-base"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
            .eth
          </span>
        </div>
        <Button type="submit" disabled={loading} size="lg" variant="gradient">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Check .eth
        </Button>
      </form>

      {result && !result.valid && (
        <p className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {result.reason}
        </p>
      )}

      {result && result.valid && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-lg font-semibold">
              {result.name}
            </span>
            {result.available === true && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> Available
              </span>
            )}
            {result.available === false && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-600 dark:text-rose-400">
                <X className="size-4" /> Registered
              </span>
            )}
            {result.available === null && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                Couldn&apos;t reach the network — try again
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={result.ensAppUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {result.available ? "Register on ENS" : "View on ENS"}
              <ExternalLink className="size-3.5" />
            </a>
            {result.available === false && (
              <a
                href={result.openseaUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                View on OpenSea
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
