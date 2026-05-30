import {
  CircleCheck,
  CircleHelp,
  CircleX,
  Loader2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import type { DomainAvailabilityStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

const CONFIG: Record<
  DomainAvailabilityStatus,
  { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  available: {
    label: "Available",
    className: "bg-success/12 text-success",
    Icon: CircleCheck,
  },
  premium: {
    label: "Premium",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    Icon: Sparkles,
  },
  taken: {
    label: "Taken",
    className: "bg-muted text-muted-foreground",
    Icon: CircleX,
  },
  unknown: {
    label: "Unknown",
    className: "bg-muted text-muted-foreground",
    Icon: CircleHelp,
  },
  checking: {
    label: "Checking",
    className: "bg-muted text-muted-foreground",
    Icon: Loader2,
  },
  error: {
    label: "Check failed",
    className: "bg-destructive/12 text-destructive",
    Icon: TriangleAlert,
  },
};

export function DomainAvailabilityBadge({
  status,
  className,
}: {
  status: DomainAvailabilityStatus;
  className?: string;
}) {
  const { label, className: statusClass, Icon } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClass,
        className
      )}
    >
      <Icon
        className={cn("size-3.5", status === "checking" && "animate-spin")}
      />
      {label}
    </span>
  );
}
