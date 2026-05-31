import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { breadcrumbLd, faqLd } from "@/lib/content/structured-data";
import { getTool, relatedTools } from "@/lib/content/tools";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Faq = { q: string; a: string };

export function ToolPageShell({
  slug,
  heading,
  intro,
  faqs,
  children,
}: {
  slug: string;
  heading: string;
  intro: string;
  faqs?: Faq[];
  children: React.ReactNode;
}) {
  const tool = getTool(slug);
  const name = tool?.name ?? heading;
  const path = `/tools/${slug}`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Free tools", path: "/tools" },
    { name, path },
  ];

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} — SmartDomainFinds`,
    url: `${appUrl}${path}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool?.blurb ?? intro,
  };

  const related = relatedTools(slug);

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={softwareLd} />
      {faqs && faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={crumbs} />

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-4 text-balance text-muted-foreground">{intro}</p>

          <div className="mt-8">{children}</div>

          {faqs && faqs.length > 0 && (
            <>
              <h2 className="mt-14 text-xl font-semibold tracking-tight">
                Frequently asked questions
              </h2>
              <dl className="mt-4 space-y-3">
                {faqs.map((faq) => (
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
            </>
          )}

          <h2 className="mt-14 text-xl font-semibold tracking-tight">
            More free tools
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}`}
                className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <span className="block text-sm font-semibold">{rel.name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {rel.tagline}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
