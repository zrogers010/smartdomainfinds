"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvailabilityPill } from "@/components/tools/availability-pill";
import type { WhoisResult } from "@/lib/tools/types";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function RecordList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item} className="break-all font-mono text-xs">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhoisTool() {
  const [domain, setDomain] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<WhoisResult | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = domain.trim();
    if (trimmed.length < 3) {
      toast.error("Enter a domain like example.com.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/whois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Lookup failed.");
      }
      setResult((await res.json()) as WhoisResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  const hasDns =
    result &&
    (result.dns.a.length ||
      result.dns.aaaa.length ||
      result.dns.mx.length ||
      result.dns.txt.length ||
      result.dns.cname.length ||
      result.nameservers.length);

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="h-11 flex-1 text-base"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button type="submit" disabled={loading} size="lg" variant="gradient">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Look up
        </Button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span className="font-mono text-sm font-semibold">
              {result.domain}
            </span>
            {result.rdapUnsupported ? (
              <span className="text-xs text-muted-foreground">
                Registration data unavailable for this TLD
              </span>
            ) : result.registered === false ? (
              <AvailabilityPill status="available" />
            ) : result.registered ? (
              <AvailabilityPill status="taken" />
            ) : (
              <AvailabilityPill status="unknown" />
            )}
            {result.ageYears !== null && (
              <span className="text-xs text-muted-foreground">
                {result.ageYears} year{result.ageYears === 1 ? "" : "s"} old
              </span>
            )}
          </div>

          {result.registered && (
            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-4">
              <Field label="Registrar" value={result.registrar ?? "—"} />
              <Field label="Registered" value={formatDate(result.createdDate)} />
              <Field label="Updated" value={formatDate(result.updatedDate)} />
              <Field label="Expires" value={formatDate(result.expiryDate)} />
            </dl>
          )}

          {hasDns ? (
            <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
              <RecordList label="A (IPv4)" items={result.dns.a} />
              <RecordList label="AAAA (IPv6)" items={result.dns.aaaa} />
              <RecordList label="MX (mail)" items={result.dns.mx} />
              <RecordList label="Nameservers" items={result.nameservers} />
              <RecordList label="TXT" items={result.dns.txt} />
              <RecordList label="CNAME" items={result.dns.cname} />
            </div>
          ) : (
            result.registered === false && (
              <p className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                No DNS records found — this domain looks unregistered and may be
                available.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
