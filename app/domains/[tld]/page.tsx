import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { NameIdeasGrid } from "@/components/content/name-ideas-grid";
import { TLDS, getTld } from "@/lib/content/tlds";
import { breadcrumbLd, faqLd } from "@/lib/content/structured-data";
import { exampleNamesForTld } from "@/lib/content/example-vocab";
import { verifiedTldNames } from "@/lib/content/verified-names";

type Params = { tld: string };

export function generateStaticParams(): Params[] {
  return TLDS.map((t) => ({ tld: t.tld }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tld: slug } = await params;
  const tld = getTld(slug);
  if (!tld) return {};

  const title = `.${tld.tld} Domains — ${tld.label}`;
  const description = `${tld.tagline} See who .${tld.tld} is best for, its pros and cons, and example available .${tld.tld} names you can register.`;
  const path = `/domains/${tld.tld}`;

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

export default async function TldPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tld: slug } = await params;
  const tld = getTld(slug);
  if (!tld) notFound();

  const names = verifiedTldNames(tld.tld) ?? exampleNamesForTld(tld.tld, 18);
  const queryHref = `/?q=${encodeURIComponent(tld.seedIdea)}`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Domain extensions", path: "/domains" },
    { name: `.${tld.tld}`, path: `/domains/${tld.tld}` },
  ];

  const relatedTlds = tld.related
    .map((s) => getTld(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(tld.faqs)} />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <p className="text-sm font-medium text-primary">{tld.label}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="font-mono">.{tld.tld}</span> domains
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
            {tld.intro}
          </p>
          <div className="mt-6">
            {/* Full navigation (plain <a>, not next/link) so the generator
                runs the same reliable path as a fresh page load. */}
            <Button asChild size="lg" variant="gradient">
              <a href={queryHref}>
                <Sparkles className="size-4" />
                Find an available .{tld.tld} name
              </a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:col-span-1">
              <h2 className="text-sm font-semibold">Best for</h2>
              <ul className="mt-3 space-y-2">
                {tld.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Pros</h2>
              <ul className="mt-3 space-y-2">
                {tld.pros.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Cons</h2>
              <ul className="mt-3 space-y-2">
                {tld.cons.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <X className="mt-0.5 size-4 shrink-0 text-rose-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mt-12 text-xl font-semibold tracking-tight">
            Example .{tld.tld} name ideas
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tap any name to look up its availability at a registrar, or generate
            a batch tuned to your own idea.
          </p>
          <div className="mt-5">
            <NameIdeasGrid names={names} />
          </div>

          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Describe your idea and we&apos;ll generate brandable names and check
              .{tld.tld} availability live.
            </p>
            <Button asChild className="mt-3" variant="default">
              <a href={queryHref}>
                Generate .{tld.tld} name ideas
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>

          <h2 className="mt-12 text-xl font-semibold tracking-tight">
            .{tld.tld} domain FAQ
          </h2>
          <dl className="mt-4 space-y-3">
            {tld.faqs.map((faq) => (
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

          {relatedTlds.length > 0 && (
            <>
              <h2 className="mt-12 text-xl font-semibold tracking-tight">
                Compare other extensions
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedTlds.map((rel) => (
                  <Link
                    key={rel.tld}
                    href={`/domains/${rel.tld}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    .{rel.tld} domains
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
