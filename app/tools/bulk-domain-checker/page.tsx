import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { BulkDomainTool } from "@/components/tools/bulk-domain-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("bulk-domain-checker")!;

export const metadata: Metadata = {
  title: `${tool.name} — Check Many Domains at Once`,
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
    q: "How many domains can I check at once?",
    a: "Up to 50 domains per check. Paste them one per line (or comma-separated), with their extension included — for example mybrand.com, mybrand.io, mybrand.ai.",
  },
  {
    q: "How accurate are the results?",
    a: "Availability is verified live against authoritative RDAP registries. Some TLDs (like .io and .co) don't publish RDAP data, so they show as 'unknown' rather than a guess we can't confirm.",
  },
  {
    q: "Is the bulk checker free?",
    a: "Yes, completely free with no account. For the available ones, you'll get a one-click link to register at a domain registrar.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Bulk domain availability checker"
      intro="Paste a list of domains and check them all for availability at once. Great for comparing a shortlist of names or grabbing every extension of your brand."
      faqs={FAQS}
    >
      <BulkDomainTool />
    </ToolPageShell>
  );
}
