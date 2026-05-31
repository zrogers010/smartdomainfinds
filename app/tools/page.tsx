import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Coins,
  Globe,
  Image as ImageIcon,
  Layers,
  Quote,
  Receipt,
  Type,
  Wallet,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { TOOLS } from "@/lib/content/tools";
import { breadcrumbLd, itemListLd } from "@/lib/content/structured-data";

const TITLE = "Free Domain & Branding Tools";
const DESCRIPTION =
  "A free toolkit for naming and launching your brand and exploring web3: username availability checker, WHOIS & DNS lookup, bulk domain checker, ENS (.eth) checker, multi-chain crypto transaction checker, wallet & stablecoin balance checker, NFT lookup, slogan generator, and acronym generator.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `${TITLE} · SmartDomainFinds`,
    description: DESCRIPTION,
    url: "/tools",
    type: "website",
  },
};

const ICONS: Record<string, typeof Globe> = {
  "social-username-checker": AtSign,
  "whois-lookup": Globe,
  "bulk-domain-checker": Layers,
  "ens-checker": Wallet,
  "tx-checker": Receipt,
  "crypto-wallet-checker": Coins,
  "nft-lookup": ImageIcon,
  "slogan-generator": Quote,
  "acronym-generator": Type,
};

export default function ToolsHub() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Free tools", path: "/tools" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={itemListLd(
          "Free domain and branding tools",
          TOOLS.map((t) => ({ name: t.name, path: `/tools/${t.slug}` }))
        )}
      />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Free domain &amp; branding tools
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">
              A free toolkit to help you name, claim, and launch your brand — no
              account required. Check handles and domains, look up DNS, and spin
              up slogans in seconds.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = ICONS[tool.slug] ?? Globe;
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold">{tool.name}</h2>
                      <ArrowRight className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {tool.tagline}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
