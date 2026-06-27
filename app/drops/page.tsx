import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, DatabaseZap, Sparkles } from "lucide-react";

import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { DomainDropsBrowser } from "@/components/drops/domain-drops-browser";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { DOMAIN_DROPS, CURATED_DOMAINS } from "@/lib/content/domain-drops";
import { breadcrumbLd, itemListLd } from "@/lib/content/structured-data";

const TITLE = "Curated Domain Drops";
const DESCRIPTION =
  "Browse hand-curated domain drops with scoring, buyer angles, use cases, and registrar confirmation links.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/drops" },
  openGraph: {
    title: `${TITLE} · SmartDomainFinds`,
    description: DESCRIPTION,
    url: "/drops",
    type: "website",
  },
};

export default function DropsPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Domain drops", path: "/drops" },
  ];
  const topScore = Math.max(...CURATED_DOMAINS.map((find) => find.score));
  const availableish = CURATED_DOMAINS.filter(
    (find) => find.availability === "availableish"
  ).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={itemListLd(
          "Curated domain drops",
          DOMAIN_DROPS.map((drop) => ({
            name: drop.title,
            path: `/drops#${drop.slug}`,
          }))
        )}
      />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/70 bg-muted/25">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <Breadcrumbs items={crumbs} />
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <div className="max-w-3xl">
                <Badge variant="success">
                  <Sparkles className="size-3.5" />
                  Curated research feed
                </Badge>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Curated domain drops with buyer logic.
                </h1>
                <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
                  Browse ranked finds with market rationale, likely buyers,
                  scoring, use cases, and registrar links. Availability is a
                  signal, not a purchase guarantee.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <Stat
                  Icon={DatabaseZap}
                  label="Curated finds"
                  value={String(CURATED_DOMAINS.length)}
                />
                <Stat
                  Icon={CheckCircle2}
                  label="Available-ish"
                  value={String(availableish)}
                />
                <Stat Icon={CalendarDays} label="Top score" value={String(topScore)} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {DOMAIN_DROPS.map((drop) => (
              <div
                key={drop.slug}
                id={drop.slug}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{drop.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {drop.description}
                    </p>
                  </div>
                  <Badge variant="muted">{drop.domains.length} names</Badge>
                </div>
              </div>
            ))}
          </div>

          <DomainDropsBrowser />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  Icon,
  label,
  value,
}: {
  Icon: typeof DatabaseZap;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-xl font-bold tabular-nums">{value}</p>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

