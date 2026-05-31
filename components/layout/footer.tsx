import Link from "next/link";
import { Globe } from "lucide-react";

const POPULAR_NICHES = [
  { slug: "coffee-shop", name: "Coffee shop" },
  { slug: "saas-startup", name: "SaaS startup" },
  { slug: "clothing-brand", name: "Clothing brand" },
  { slug: "restaurant", name: "Restaurant" },
];

const POPULAR_TLDS = ["com", "ai", "io", "co"];

const TOOL_LINKS = [
  { slug: "social-username-checker", name: "Username checker" },
  { slug: "whois-lookup", name: "WHOIS & DNS lookup" },
  { slug: "bulk-domain-checker", name: "Bulk domain checker" },
  { slug: "ens-checker", name: "ENS (.eth) checker" },
  { slug: "tx-checker", name: "Crypto tx checker" },
  { slug: "crypto-wallet-checker", name: "Wallet & stablecoin checker" },
  { slug: "nft-lookup", name: "NFT lookup" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <Globe className="size-4" />
              </span>
              <span className="text-sm font-semibold">SmartDomainFinds</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Find the smartest available domain for your next idea —
              availability is verified live, never guessed.
            </p>
          </div>

          <nav aria-label="Business name ideas">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name ideas
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {POPULAR_NICHES.map((niche) => (
                <li key={niche.slug}>
                  <Link
                    href={`/business-name-ideas/${niche.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {niche.name} names
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/business-name-ideas"
                  className="font-medium text-primary transition-colors hover:underline"
                >
                  All industries →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Domain extensions">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Domain extensions
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {POPULAR_TLDS.map((tld) => (
                <li key={tld}>
                  <Link
                    href={`/domains/${tld}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    .{tld} domains
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/domains"
                  className="font-medium text-primary transition-colors hover:underline"
                >
                  All extensions →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Free tools">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Free tools
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {TOOL_LINKS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="font-medium text-primary transition-colors hover:underline"
                >
                  All tools →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartDomainFinds. For research purposes
            — always confirm availability with a registrar before purchasing.
          </p>
        </div>
      </div>
    </footer>
  );
}
