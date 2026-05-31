import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { AcronymTool } from "@/components/tools/acronym-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("acronym-generator")!;

export const metadata: Metadata = {
  title: `${tool.name} — Backronym Maker`,
  description: tool.blurb,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: {
    title: `${tool.name} · SmartDomainFinds`,
    description: tool.blurb,
    url: `/tools/${tool.slug}`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "What is a backronym?",
    a: "A backronym is a phrase created so that its initials spell an existing word — for example turning 'NOVA' into 'Nimble, Open, Versatile, Authentic'. It's a fun way to give a brand name or project an instant meaning.",
  },
  {
    q: "How long can the word be?",
    a: "The acronym generator works with words from 2 to 8 letters. Each letter is expanded into a positive, business-friendly word, and you get a few variations to choose from.",
  },
  {
    q: "Is it free?",
    a: "Yes — it runs instantly in your browser, free and with no sign-up. Click any result to copy it.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Acronym & backronym generator"
      intro="Turn a short word into a memorable acronym. Enter 2–8 letters and get positive, business-friendly expansions for each one, with a few variations to pick from."
      faqs={FAQS}
    >
      <AcronymTool />
    </ToolPageShell>
  );
}
