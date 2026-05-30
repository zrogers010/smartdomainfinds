import {
  BadgeCheck,
  Gauge,
  Layers,
  ListChecks,
  ShieldQuestion,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DomainFinder } from "@/components/domain/domain-finder";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const FAQ = [
  {
    q: "Is SmartDomainFinds free?",
    a: "Yes. You can generate brandable name ideas and check domain availability in real time for free, with no account required.",
  },
  {
    q: "How does it check domain availability?",
    a: "Availability is verified live against authoritative registry RDAP servers (the modern WHOIS replacement), so a domain is only marked available once it has actually been checked.",
  },
  {
    q: "Which domain extensions does it support?",
    a: "It checks popular extensions including .com, .ai, .io, .app, .dev, .xyz, .co, .org, .tech, .net, .online, and .store, plus brandable name variations.",
  },
  {
    q: "What is the Smart Score?",
    a: "Every name gets a deterministic Smart Score that combines availability with brandability, memorability, clarity, pronunciation, spelling, SEO relevance, and premium feel.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      url: appUrl,
      name: "SmartDomainFinds",
      description:
        "AI domain name generator with real-time availability checks and a Smart Score for every name.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${appUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${appUrl}/#webapp`,
      name: "SmartDomainFinds",
      url: appUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser.",
      description:
        "Generate brandable domain names, check availability in real time, and score every option to pick the best one.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      "@id": `${appUrl}/#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

const FEATURES = [
  {
    Icon: Sparkles,
    title: "Smarter ideation",
    body: "Fewer, better names across brandable, descriptive, premium, SEO, playful, and short styles — not hundreds of mediocre permutations.",
  },
  {
    Icon: Gauge,
    title: "Decision-grade scoring",
    body: "Every name gets a deterministic Smart Score across availability, brandability, memorability, clarity, pronunciation, spelling, SEO, and premium feel.",
  },
  {
    Icon: BadgeCheck,
    title: "Real availability",
    body: "AI suggests, a provider verifies. We never claim a domain is free until availability has actually been checked.",
  },
  {
    Icon: ShieldQuestion,
    title: "Risks, made obvious",
    body: "See the downsides — trademark-looking names, awkward spellings, or names that anchor too hard to a trend — before you commit.",
  },
  {
    Icon: Layers,
    title: "Filter, sort, compare",
    body: "Slice results by availability, TLD, style, score, and length. Sort by what matters and compare your favorites side by side.",
  },
  {
    Icon: ListChecks,
    title: "Build a shortlist",
    body: "Save the best options, copy them in one click, and export your shortlist to CSV to share with your team.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <DomainFinder />

        <section className="border-t border-border/70 bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Not just “is it available?” — “is it the right name?”
              </h2>
              <p className="mt-3 text-balance text-muted-foreground">
                Most tools answer one question. SmartDomainFinds helps you
                understand why a name is good, what the risks are, and what to
                actually buy.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently asked questions
            </h2>
            <dl className="mt-8 space-y-4">
              {FAQ.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <dt className="text-base font-semibold">{q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
