"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UsernamePlatform, UsernameResult } from "@/lib/tools/types";

function StatusCell({ platform }: { platform: UsernamePlatform }) {
  if (platform.status === "available") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <Check className="size-4" /> Available
      </span>
    );
  }
  if (platform.status === "taken") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
        <X className="size-4" /> Taken
      </span>
    );
  }
  return (
    <a
      href={platform.profileUrl}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
    >
      Check <ExternalLink className="size-3.5" />
    </a>
  );
}

export function UsernameTool() {
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<UsernameResult | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = username.trim().replace(/^@+/, "");
    if (!trimmed) {
      toast.error("Enter a username to check.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Check failed.");
      }
      setResult((await res.json()) as UsernameResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground">
            @
          </span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourbrand"
            className="h-11 pl-7 text-base"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
        <Button type="submit" disabled={loading} size="lg" variant="gradient">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Check handle
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border">
            {result.platforms.map((platform) => (
              <li
                key={platform.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="block text-sm font-medium">
                    {platform.name}
                  </span>
                  <a
                    href={platform.profileUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block truncate text-xs text-muted-foreground hover:text-foreground"
                  >
                    {platform.profileUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
                <StatusCell platform={platform} />
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            GitHub is verified live. Social platforms block automated checks, so
            we link you straight to each profile to confirm in one click.
          </p>
        </div>
      )}
    </div>
  );
}
