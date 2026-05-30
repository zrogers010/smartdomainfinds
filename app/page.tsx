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
      </main>
      <Footer />
    </div>
  );
}
