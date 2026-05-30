"use client";

import * as React from "react";
import {
  Bookmark,
  Columns3,
  Copy,
  Download,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  shortlistToCsv,
  useShortlistStore,
} from "@/lib/store/shortlist-store";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DomainAvailabilityBadge } from "./domain-availability-badge";
import { DomainScoreBadge } from "./domain-score-badge";
import { CompareTable } from "./compare-table";

export function ShortlistDrawer() {
  const items = useShortlistStore((s) => s.items);
  const remove = useShortlistStore((s) => s.remove);
  const clear = useShortlistStore((s) => s.clear);
  const hydrated = useHydrated();
  const [comparing, setComparing] = React.useState(false);

  const count = hydrated ? items.length : 0;

  const handleCopyAll = async () => {
    if (!items.length) return;
    const text = items.map((i) => i.domain).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${items.length} domains`);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const handleExportCsv = () => {
    if (!items.length) return;
    const csv = shortlistToCsv(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smartdomainfinds-shortlist.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported shortlist.csv");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <Bookmark className="size-4" />
          <span className="hidden sm:inline">Shortlist</span>
          {count > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bookmark className="size-4 text-primary" />
            Your shortlist
          </SheetTitle>
          <SheetDescription>
            {count > 0
              ? `${count} saved ${count === 1 ? "domain" : "domains"}`
              : "Domains you save will appear here."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-thin">
          {count === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <Bookmark className="size-6 text-muted-foreground" />
              </div>
              <p className="max-w-[14rem] text-sm text-muted-foreground">
                Save your favorite domains to compare and export them later.
              </p>
            </div>
          ) : comparing ? (
            <CompareTable items={items} />
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.domain}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <DomainScoreBadge score={item.smartScore} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.baseName}
                      <span className="text-muted-foreground">.{item.tld}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <DomainAvailabilityBadge status={item.availability} />
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button asChild variant="ghost" size="icon-sm">
                      <a
                        href={item.registrarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Check registrar"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove"
                      onClick={() => remove(item.domain)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 && (
          <SheetFooter>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="size-4" />
                Copy all
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                <Download className="size-4" />
                Export CSV
              </Button>
              <Button
                variant={comparing ? "secondary" : "outline"}
                size="sm"
                onClick={() => setComparing((c) => !c)}
                disabled={count < 2}
              >
                <Columns3 className="size-4" />
                {comparing ? "List view" : "Compare"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  clear();
                  setComparing(false);
                  toast.message("Shortlist cleared");
                }}
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
