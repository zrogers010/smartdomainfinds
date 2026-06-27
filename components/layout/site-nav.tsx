"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/drops", label: "Drops" },
  { href: "/business-name-ideas", label: "Name Ideas" },
  { href: "/domains", label: "Domain Extensions" },
  { href: "/tools", label: "Free Tools" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground",
              isActive(pathname, item.href)
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            <SheetClose asChild>
              <Link
                href="/"
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === "/" ? "bg-accent text-foreground" : "text-muted-foreground"
                )}
              >
                Find a Domain
              </Link>
            </SheetClose>
            {NAV_ITEMS.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                    isActive(pathname, item.href)
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
