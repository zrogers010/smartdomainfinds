"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilityPill } from "@/components/tools/availability-pill";
import type { BulkCheckResult } from "@/lib/tools/types";

const MAX_DOMAINS = 50;

function parseDomains(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((d) => d.trim())
    .filter(Boolean);
}

export function BulkDomainTool() {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<BulkCheckResult | null>(null);

  const parsed = parseDomains(input);

  async function run() {
    const domains = parsed.slice(0, MAX_DOMAINS);
    if (domains.length === 0) {
      toast.error("Enter at least one domain (one per line).");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/bulk-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Bulk check failed.");
      }
      setResult((await res.json()) as BulkCheckResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk check failed.");
    } finally {
      setLoading(false);
    }
  }

  const availableCount =
    result?.rows.filter((r) => r.status === "available").length ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"example.com\nmybrand.io\nstartup.ai"}
          rows={6}
          className="font-mono text-sm"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {parsed.length} domain{parsed.length === 1 ? "" : "s"}
            {parsed.length > MAX_DOMAINS && ` (only first ${MAX_DOMAINS} checked)`}
          </span>
          <span>One per line, or comma-separated</span>
        </div>
      </div>

      <Button onClick={run} disabled={loading} size="lg" variant="gradient">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Search className="size-4" />
        )}
        Check availability
      </Button>

      {result && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
            <span className="font-medium">
              Checked {result.checkedCount} domain
              {result.checkedCount === 1 ? "" : "s"}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {availableCount} available
            </span>
          </div>
          <ul className="divide-y divide-border">
            {result.rows.map((row) => (
              <li
                key={row.domain}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <span className="truncate font-mono text-sm">{row.domain}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <AvailabilityPill status={row.status} />
                  {(row.status === "available" || row.status === "premium") && (
                    <a
                      href={row.registrarUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Register →
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
