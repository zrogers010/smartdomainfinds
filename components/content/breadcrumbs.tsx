import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Visual breadcrumb trail. Pair with breadcrumbLd() for structured data. */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {isLast ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <ChevronRight className="size-3.5 opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
