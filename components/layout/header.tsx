import Link from "next/link";
import { Globe } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ShortlistDrawer } from "@/components/domain/shortlist-drawer";
import { SiteNav } from "@/components/layout/site-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shadow-primary/30">
              <Globe className="size-4.5" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              SmartDomainFinds
            </span>
          </Link>

          <SiteNav />
        </div>

        <div className="flex items-center gap-2">
          <ShortlistDrawer />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
