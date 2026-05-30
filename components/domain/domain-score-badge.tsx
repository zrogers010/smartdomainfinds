import { cn } from "@/lib/utils/cn";

function tier(score: number) {
  if (score >= 85)
    return {
      ring: "text-success",
      track: "text-success/15",
      label: "Excellent",
    };
  if (score >= 70)
    return {
      ring: "text-primary",
      track: "text-primary/15",
      label: "Strong",
    };
  if (score >= 50)
    return {
      ring: "text-amber-500",
      track: "text-amber-500/15",
      label: "Fair",
    };
  return {
    ring: "text-muted-foreground",
    track: "text-muted-foreground/15",
    label: "Weak",
  };
}

export function DomainScoreBadge({
  score,
  size = 56,
  showLabel = false,
  className,
}: {
  score: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const { ring, track, label } = tier(score);
  const stroke = size >= 56 ? 5 : 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, score) / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Smart score ${score} out of 100`}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            className={cn("fill-none stroke-current", track)}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("fill-none stroke-current transition-all", ring)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-semibold tabular-nums leading-none",
              size >= 56 ? "text-lg" : "text-sm"
            )}
          >
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", ring)}>{label}</span>
      )}
    </div>
  );
}
