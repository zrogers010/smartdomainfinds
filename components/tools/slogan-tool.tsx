"use client";

import * as React from "react";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSlogans } from "@/lib/tools/wordtools";

export function SloganTool() {
  const [input, setInput] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");

  const slogans = React.useMemo(
    () => (submitted ? generateSlogans(submitted) : []),
    [submitted]
  );

  function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (input.trim().length < 2) {
      toast.error("Enter a brand name or keyword.");
      return;
    }
    setSubmitted(input.trim());
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your brand or keyword (e.g. BrewPulse, coffee)"
          className="h-11 flex-1 text-base"
        />
        <Button type="submit" size="lg" variant="gradient">
          <Sparkles className="size-4" />
          Generate slogans
        </Button>
      </form>

      {slogans.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {slogans.map((slogan) => (
            <li
              key={slogan}
              className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
            >
              <span className="text-sm">{slogan}</span>
              <button
                type="button"
                onClick={() => copy(slogan)}
                className="shrink-0 text-muted-foreground/60 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                aria-label="Copy slogan"
              >
                <Copy className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
