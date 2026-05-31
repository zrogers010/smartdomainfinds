import { Check, HelpCircle, Star, X } from "lucide-react";

import type { DomainAvailabilityStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

const META: Record<
  DomainAvailabilityStatus,
  { label: string; className: string; Icon: typeof Check }
> = {
  available: {
    label: "Available",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Icon: Check,
  },
  premium: {
    label: "Premium",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Icon: Star,
  },
  taken: {
    label: "Taken",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    Icon: X,
  },
  unknown: {
    label: "Unknown",
    className: "bg-muted text-muted-foreground",
    Icon: HelpCircle,
  },
  checking: {
    label: "Checking…",
    className: "bg-muted text-muted-foreground",
    Icon: HelpCircle,
  },
  error: {
    label: "Error",
    className: "bg-muted text-muted-foreground",
    Icon: HelpCircle,
  },
};

export function AvailabilityPill({
  status,
  className,
}: {
  status: DomainAvailabilityStatus;
  className?: string;
}) {
  const meta = META[status];
  const { Icon } = meta;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        meta.className,
        className
      )}
    >
      <Icon className="size-3.5" />
      {meta.label}
    </span>
  );
}
