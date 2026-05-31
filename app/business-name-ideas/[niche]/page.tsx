import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { NameIdeasGrid } from "@/components/content/name-ideas-grid";
import { NICHES, getNiche } from "@/lib/content/niches";
import { TLDS } from "@/lib/content/tlds";
import { breadcrumbLd, faqLd } from "@/lib/content/structured-data";
import { exampleNamesForNiche } from "@/lib/content/example-vocab";
import { verifiedNicheNames } from "@/lib/content/verified-names";

type Params = { niche: string };

export function generateStaticParams(): Params[] {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { niche: slug } = await params;
  const niche = getNiche(slug);
  if (!niche) return {};

  const title = `${niche.name} Name Ideas`;
  const description = `${niche.blurb} Generate more with real-time availability checks and a Smart Score for every name.`;
  const path = `/business-name-ideas/${niche.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · SmartDomainFinds`,
      description,
      url: path,
      type: "article",
    },
  };
}

const POPULAR_TLDS = ["com", "ai", "io", "co"];

export default async function NichePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { niche: slug } = await params;
  const niche = getNiche(slug);
  if (!niche) notFound();

  const names =
    verifiedNicheNames(niche.slug) ?? exampleNamesForNiche(niche.slug, 24);
  const queryHref = `/?q=${encodeURIComponent(niche.seedIdea)}`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Business name ideas", path: "/business-name-ideas" },
    { name: niche.name, path: `/business-name-ideas/${niche.slug}` },
  ];

  const relatedNiches = niche.related
    .map((s) => getNiche(s))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));
  const popularTlds = POPULAR_TLDS.map((t) =>
    TLDS.find((tld) => tld.tld === t)
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(niche.faqs)} />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {niche.name} name ideas
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
            {niche.intro}
          </p>
          <div className="mt-6">
            {/* Full navigation (plain <a>, not next/link) so the generator
                runs the same reliable path as a fresh page load. */}
            <Button asChild size="lg" variant="gradient">
              <a href={queryHref}>
                <Sparkles className="size-4" />
                Generate {niche.name.toLowerCase()} names with availability
              </a>
            </Button>
          </div>

          <h2 className="mt-12 text-xl font-semibold tracking-tight">
            {names.length} {niche.name.toLowerCase()} name ideas
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tap any name to look up its availability at a registrar. These are
            starting points — generate a fresh batch tuned to your idea anytime.
          </p>
          <div className="mt-5">
            <NameIdeasGrid names={names} />
          </div>

          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Want names matched to your exact idea, checked live across .com,
              .ai, .io and more?
            </p>
            <Button asChild className="mt-3" variant="default">
              <a href={queryHref}>
                Generate more {niche.name.toLowerCase()} names
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>

          <h2 className="mt-12 flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Lightbulb className="size-5 text-primary" />
            Tips for naming your {niche.name.toLowerCase()}
          </h2>
          <ul className="mt-4 space-y-3">
            {niche.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed shadow-sm"
              >
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl font-semibold tracking-tight">
            {niche.name} naming FAQ
          </h2>
          <dl className="mt-4 space-y-3">
            {niche.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <dt className="text-base font-semibold">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>

          {relatedNiches.length > 0 && (
            <>
              <h2 className="mt-12 text-xl font-semibold tracking-tight">
                More name ideas
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedNiches.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/business-name-ideas/${rel.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {rel.name} names
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Choosing a domain extension
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularTlds.map((tld) => (
              <Link
                key={tld.tld}
                href={`/domains/${tld.tld}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
              >
                .{tld.tld} domains
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
