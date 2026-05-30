import { DOMAIN_STYLE_LABELS, type DomainStyle } from "@/lib/domain/types";
import { STYLE_BADGE_CLASSES } from "@/lib/domain/ui-constants";
import { cn } from "@/lib/utils/cn";

export function DomainStyleBadge({
  style,
  className,
}: {
  style: DomainStyle;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STYLE_BADGE_CLASSES[style],
        className
      )}
    >
      {DOMAIN_STYLE_LABELS[style]}
    </span>
  );
}
