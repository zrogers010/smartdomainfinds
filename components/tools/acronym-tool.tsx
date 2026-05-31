"use client";

import * as React from "react";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAcronyms } from "@/lib/tools/wordtools";

export function AcronymTool() {
  const [input, setInput] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");

  const expansions = React.useMemo(
    () => (submitted ? generateAcronyms(submitted) : []),
    [submitted]
  );

  function run(e?: React.FormEvent) {
    e?.preventDefault();
    const letters = input.trim().replace(/[^a-zA-Z]/g, "");
    if (letters.length < 2) {
      toast.error("Enter a word with 2–8 letters.");
      return;
    }
    if (letters.length > 8) {
      toast.error("Keep it to 8 letters or fewer.");
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
          placeholder="A word to expand (e.g. NOVA, TEAM)"
          className="h-11 flex-1 text-base uppercase"
          maxLength={8}
        />
        <Button type="submit" size="lg" variant="gradient">
          <Sparkles className="size-4" />
          Generate acronyms
        </Button>
      </form>

      {expansions.length > 0 && (
        <ul className="space-y-3">
          {expansions.map((expansion, i) => {
            const phrase = expansion.words.join(" ");
            return (
              <li
                key={i}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-wrap gap-x-1.5 gap-y-1">
                  {expansion.words.map((word, j) => (
                    <span key={j} className="text-sm">
                      <span className="font-bold text-primary">
                        {word.charAt(0)}
                      </span>
                      {word.slice(1)}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => copy(`${expansion.word}: ${phrase}`)}
                  className="shrink-0 text-muted-foreground/60 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                  aria-label="Copy acronym"
                >
                  <Copy className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
