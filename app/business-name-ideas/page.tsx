import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Sparkles } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { NICHES } from "@/lib/content/niches";
import { breadcrumbLd, itemListLd } from "@/lib/content/structured-data";

const TITLE = "Business Name Ideas by Industry";
const DESCRIPTION =
  "Browse brandable business name ideas by industry — coffee shops, gyms, SaaS startups, agencies and more — each with available domains you can check in real time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/business-name-ideas" },
  openGraph: {
    title: `${TITLE} · SmartDomainFinds`,
    description: DESCRIPTION,
    url: "/business-name-ideas",
    type: "website",
  },
};

export default function BusinessNameIdeasHub() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Business name ideas", path: "/business-name-ideas" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={itemListLd(
          "Business name ideas by industry",
          NICHES.map((n) => ({
            name: `${n.name} name ideas`,
            path: `/business-name-ideas/${n.slug}`,
          }))
        )}
      />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Business name ideas by industry
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">
              Get inspired with brandable name ideas tailored to your industry.
              Pick a category to see examples with available domains — or
              describe your idea and let our generator do the work, complete with
              real-time availability and a Smart Score for every name.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gradient">
                <Link href="/">
                  <Sparkles className="size-4" />
                  Generate name ideas
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/domains">
                  <Globe className="size-4" />
                  Browse domain extensions
                </Link>
              </Button>
            </div>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NICHES.map((niche) => (
              <li key={niche.slug}>
                <Link
                  href={`/business-name-ideas/${niche.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">
                      {niche.name} name ideas
                    </h2>
                    <ArrowRight className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {niche.blurb}
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
