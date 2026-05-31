"use client";

import * as React from "react";
import { ExternalLink, ImageOff, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainSelect } from "@/components/tools/chain-select";
import type { NftResult } from "@/lib/tools/types";

export function NftTool() {
  const [contract, setContract] = React.useState("");
  const [tokenId, setTokenId] = React.useState("");
  const [chain, setChain] = React.useState("ethereum");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<NftResult | null>(null);
  const [imgError, setImgError] = React.useState(false);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (!contract.trim() || !tokenId.trim()) {
      toast.error("Enter a contract address and token ID.");
      return;
    }
    setLoading(true);
    setResult(null);
    setImgError(false);
    try {
      const res = await fetch("/api/nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract: contract.trim(), tokenId: tokenId.trim(), chain }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "NFT lookup failed.");
      }
      setResult((await res.json()) as NftResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "NFT lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            placeholder="0x… NFT contract address"
            className="h-11 flex-1 font-mono text-base"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <ChainSelect value={chain} onChange={setChain} disabled={loading} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Token ID (e.g. 1234)"
            inputMode="numeric"
            className="h-11 flex-1 font-mono text-base"
            autoComplete="off"
          />
          <Button type="submit" disabled={loading} size="lg" variant="gradient" className="sm:w-44">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Look up NFT
          </Button>
        </div>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="sm:w-48 sm:shrink-0">
              {result.imageUrl && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.imageUrl}
                  alt={result.metadataName ?? "NFT artwork"}
                  className="aspect-square w-full rounded-lg border border-border object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
                  <ImageOff className="size-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {result.metadataName ?? `${result.collectionName ?? "Token"} #${result.tokenId}`}
                </h3>
                {result.tokenStandard && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {result.tokenStandard}
                  </span>
                )}
              </div>
              {result.collectionName && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {result.collectionName}
                  {result.symbol ? ` (${result.symbol})` : ""} · {result.chainName}
                </p>
              )}
              {result.description && (
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {result.description}
                </p>
              )}
              {result.owner && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Owner: </span>
                  <span className="break-all font-mono text-xs">{result.owner}</span>
                </p>
              )}

              {result.attributes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {result.attributes.map((attr, i) => (
                    <span
                      key={`${attr.trait}-${i}`}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <span className="text-muted-foreground">{attr.trait}: </span>
                      <span className="font-medium">{attr.value}</span>
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  View on explorer
                  <ExternalLink className="size-3.5" />
                </a>
                {result.openseaUrl && (
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
          </div>
        </div>
      )}
    </div>
  );
}
