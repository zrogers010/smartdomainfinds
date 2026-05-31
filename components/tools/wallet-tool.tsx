"use client";

import * as React from "react";
import { ExternalLink, Loader2, Search, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainSelect } from "@/components/tools/chain-select";
import type { WalletResult } from "@/lib/tools/types";

export function WalletTool() {
  const [address, setAddress] = React.useState("");
  const [chain, setChain] = React.useState("ethereum");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<WalletResult | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (!address.trim()) {
      toast.error("Enter a wallet address or ENS name.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim(), chain }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Wallet lookup failed.");
      }
      setResult((await res.json()) as WalletResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wallet lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x… address or vitalik.eth"
            className="h-11 flex-1 font-mono text-base"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <ChainSelect value={chain} onChange={setChain} disabled={loading} />
        </div>
        <Button type="submit" disabled={loading} size="lg" variant="gradient" className="sm:self-start">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Check balances
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-muted-foreground" />
              <div>
                {result.ensName && (
                  <span className="block font-medium">{result.ensName}</span>
                )}
                <span className="block break-all font-mono text-xs text-muted-foreground">
                  {result.address}
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{result.chainName}</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <span className="text-xs text-muted-foreground">Native balance</span>
              <span className="mt-1 block text-lg font-semibold">
                {result.nativeBalance} {result.nativeSymbol}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <span className="text-xs text-muted-foreground">Stablecoins (≈ USD)</span>
              <span className="mt-1 block text-lg font-semibold">
                ${result.stablecoinTotal}
              </span>
            </div>
          </div>

          {result.stablecoins.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.stablecoins.map((coin) => (
                <span
                  key={coin.symbol}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm"
                >
                  <span className="font-medium">{coin.symbol}</span>
                  <span className="font-mono text-muted-foreground">{coin.amount}</span>
                </span>
              ))}
            </div>
          )}

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
