"use client";

import * as React from "react";
import { Check, Clock, ExternalLink, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainSelect } from "@/components/tools/chain-select";
import type { TxResult } from "@/lib/tools/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border py-2.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="break-all font-mono text-sm sm:text-right">{children}</span>
    </div>
  );
}

export function TxTool() {
  const [hash, setHash] = React.useState("");
  const [chain, setChain] = React.useState("ethereum");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<TxResult | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (!hash.trim()) {
      toast.error("Paste a transaction hash to look up.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: hash.trim(), chain }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Transaction lookup failed.");
      }
      setResult((await res.json()) as TxResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transaction lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="0x… transaction hash"
            className="h-11 flex-1 font-mono text-base"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <ChainSelect value={chain} onChange={setChain} disabled={loading} />
        </div>
        <Button type="submit" disabled={loading} size="lg" variant="gradient" className="sm:self-start">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Check transaction
        </Button>
      </form>

      {result && !result.found && (
        <p className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          No transaction found with that hash on {result.chainName}. Double-check the hash and
          make sure you picked the right chain.
        </p>
      )}

      {result && result.found && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {result.chainName} transaction
            </span>
            {result.status === "success" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> Success
              </span>
            )}
            {result.status === "failed" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-600 dark:text-rose-400">
                <X className="size-4" /> Failed
              </span>
            )}
            {result.status === "pending" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                <Clock className="size-4" /> Pending
              </span>
            )}
          </div>

          <div className="mt-3">
            <Row label="From">{result.from ?? "—"}</Row>
            <Row label={result.contractCreated ? "Contract created" : "To"}>
              {result.contractCreated ?? result.to ?? "—"}
            </Row>
            <Row label="Value">
              {result.value} {result.nativeSymbol}
            </Row>
            {result.fee && (
              <Row label="Fee">
                {result.fee} {result.nativeSymbol}
              </Row>
            )}
            {result.gasUsed && <Row label="Gas used">{Number(result.gasUsed).toLocaleString()}</Row>}
            {result.blockNumber !== null && (
              <Row label="Block">{result.blockNumber.toLocaleString()}</Row>
            )}
            {result.confirmations !== null && (
              <Row label="Confirmations">{result.confirmations.toLocaleString()}</Row>
            )}
          </div>

          <div className="mt-4">
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              View on explorer
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
