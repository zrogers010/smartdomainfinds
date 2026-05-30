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
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {EXAMPLE_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-accent hover:text-foreground"
        >
          <Wand2 className="size-3 text-primary/70" />
          {prompt}
        </button>
      ))}
    </div>
  );
}
