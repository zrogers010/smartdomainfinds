"use client";

import { Wand2 } from "lucide-react";
import { EXAMPLE_PROMPTS } from "@/lib/domain/ui-constants";
import { cn } from "@/lib/utils/cn";

export function ExamplePrompts({
  onSelect,
  className,
}: {
  onSelect: (prompt: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-1.5", className)}>
      {EXAMPLE_PROMPTS.map((prompt, i) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          title={prompt}
          className={cn(
            "inline-flex max-w-[11rem] items-center gap-1.5 rounded-full border border-border bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-accent hover:text-foreground sm:max-w-[16rem]",
            // Keep the mobile list short; reveal the rest on larger screens.
            i >= 3 && "hidden sm:inline-flex"
          )}
        >
          <Wand2 className="size-3 shrink-0 text-primary/70" />
          <span className="truncate">{prompt}</span>
        </button>
      ))}
    </div>
  );
}
