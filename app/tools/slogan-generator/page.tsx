import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { SloganTool } from "@/components/tools/slogan-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("slogan-generator")!;

export const metadata: Metadata = {
  title: `${tool.name} — Free Tagline Ideas`,
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
    q: "How do I write a good slogan?",
    a: "Keep it short, specific, and benefit-driven. Aim for something a customer could repeat from memory, hint at what makes you different, and read it aloud to make sure it flows. Use the ideas here as starting points and tailor the best one to your brand.",
  },
  {
    q: "Is the slogan generator free?",
    a: "Yes — it's completely free, runs instantly in your browser, and requires no sign-up. Click any slogan to copy it.",
  },
  {
    q: "Can I use these slogans commercially?",
    a: "The generated phrases are starting points for inspiration. Before using one commercially, do a quick trademark search to make sure it isn't already claimed in your industry.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Slogan & tagline generator"
      intro="Enter your brand name or a keyword and get instant slogan and tagline ideas. Free, no sign-up, and one click to copy your favorite."
      faqs={FAQS}
    >
      <SloganTool />
    </ToolPageShell>
  );
}
