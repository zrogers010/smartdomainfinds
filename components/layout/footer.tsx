import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <Globe className="size-4" />
          </span>
          <span className="text-sm font-semibold">SmartDomainFinds</span>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Find the smartest available domain for your next idea. Availability is
          verified by a domain provider — AI suggestions are never treated as
          confirmation that a domain is free.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SmartDomainFinds. For research purposes —
          always confirm availability with a registrar before purchasing.
        </p>
      </div>
    </footer>
  );
}
