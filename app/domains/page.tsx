import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { TLDS } from "@/lib/content/tlds";
import { breadcrumbLd, itemListLd } from "@/lib/content/structured-data";

const TITLE = "Domain Extensions Guide (.com, .ai, .io & 25+ more)";
const DESCRIPTION =
  "Compare 30+ domain extensions — .com, .ai, .io, .app, .dev, .co, .studio, .design, .shop, .cloud and many more. See who each TLD is best for, the pros and cons, and example available names.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/domains" },
  openGraph: {
    title: `${TITLE} · SmartDomainFinds`,
    description: DESCRIPTION,
    url: "/domains",
    type: "website",
  },
};

export default function DomainsHub() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Domain extensions", path: "/domains" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={itemListLd(
          "Domain extensions guide",
          TLDS.map((t) => ({
            name: `.${t.tld} domains`,
            path: `/domains/${t.tld}`,
          }))
        )}
      />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Domain extensions guide
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">
              Not sure whether to go with a .com, .ai, .io, or something else?
              Compare the most popular domain extensions, learn who each one
              suits, and see example available names — then generate and check
              your own in real time.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" variant="gradient">
                <Link href="/">
                  <Sparkles className="size-4" />
                  Find an available domain
                </Link>
              </Button>
            </div>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TLDS.map((tld) => (
              <li key={tld.tld}>
                <Link
                  href={`/domains/${tld.tld}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-mono text-lg font-semibold">
                      .{tld.tld}
                    </h2>
                    <ArrowRight className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {tld.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
