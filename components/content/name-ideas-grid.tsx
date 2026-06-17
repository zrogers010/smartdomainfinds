"use client";

import * as React from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

import type { GeneratedName } from "@/schemas/domain";
import type { DomainAvailabilityStatus } from "@/lib/domain/types";
import { AvailabilityPill } from "@/components/tools/availability-pill";
import { getRegistrarSearchUrl } from "@/lib/domain/utils";
import type { BulkCheckResult } from "@/lib/tools/types";

/**
 * Grid of seeded example names. The names render on the server (crawlable SEO
 * content, instant paint); availability is then checked progressively in the
 * browser via /api/bulk-check — one batched, server-cached request — so the
 * page stays static and fast while still showing live status like the search.
 */
// Lower rank sorts first: available names lead, taken trail.
const STATUS_RANK: Record<string, number> = {
  available: 0,
  premium: 1,
  unknown: 2,
  checking: 2,
  error: 2,
  taken: 3,
};

export function NameIdeasGrid({ names }: { names: GeneratedName[] }) {
  const [statuses, setStatuses] = React.useState<
    Record<string, DomainAvailabilityStatus>
  >({});
  const [checkedDomainsKey, setCheckedDomainsKey] = React.useState("");

  const domains = React.useMemo(
    () => names.map((n) => n.preferredDomain.toLowerCase()),
    [names]
  );
  const domainsKey = React.useMemo(() => domains.join("|"), [domains]);
  const activeStatuses = React.useMemo(
    () => (checkedDomainsKey === domainsKey ? statuses : {}),
    [checkedDomainsKey, domainsKey, statuses]
  );
  const checking = domains.length > 0 && checkedDomainsKey !== domainsKey;

  // Float available/premium names to the top once availability resolves, while
  // keeping the server-rendered order stable for crawlers (this runs only after
  // the client check completes).
  const orderedNames = React.useMemo(() => {
    if (Object.keys(activeStatuses).length === 0) return names;
    return names
      .map((name, i) => ({ name, i }))
      .sort((a, b) => {
        const ra =
          STATUS_RANK[
            activeStatuses[a.name.preferredDomain.toLowerCase()] ?? "unknown"
          ] ?? 2;
        const rb =
          STATUS_RANK[
            activeStatuses[b.name.preferredDomain.toLowerCase()] ?? "unknown"
          ] ?? 2;
        return ra - rb || a.i - b.i;
      })
      .map((x) => x.name);
  }, [activeStatuses, names]);

  React.useEffect(() => {
    if (domains.length === 0) return;
    const controller = new AbortController();
    fetch("/api/bulk-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains: domains.slice(0, 50) }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: BulkCheckResult) => {
        const next: Record<string, DomainAvailabilityStatus> = {};
        for (const row of data.rows) next[row.domain] = row.status;
        setStatuses(next);
      })
      .catch(() => {
        /* Leave names without pills if the check fails. */
      })
      .finally(() => setCheckedDomainsKey(domainsKey));
    return () => controller.abort();
  }, [domains, domainsKey]);

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {orderedNames.map((name) => {
        const status = activeStatuses[name.preferredDomain.toLowerCase()];
        const showPill =
          status === "available" || status === "premium" || status === "taken";
        return (
          <li key={name.baseName}>
            <a
              href={getRegistrarSearchUrl(name.preferredDomain)}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {name.baseName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {name.preferredDomain}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {showPill ? (
                  <AvailabilityPill status={status} />
                ) : checking ? (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground/50" />
                ) : null}
                <ArrowUpRight className="size-4 text-muted-foreground/60 transition-colors group-hover:text-primary" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
