import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { UsernameTool } from "@/components/tools/username-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("social-username-checker")!;

export const metadata: Metadata = {
  title: `${tool.name} — Social Handle Availability`,
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
    q: "How does the username checker work?",
    a: "GitHub is checked live via its public API, so we can tell you reliably whether a username is free or taken. The major social networks block automated availability checks and prohibit scraping, so for X, Instagram, TikTok and others we give you a one-click link to each profile to confirm instantly and accurately.",
  },
  {
    q: "Why not auto-check Instagram, X, and TikTok?",
    a: "Those platforms actively block automated requests and their terms forbid scraping, which makes any automated 'available/taken' result unreliable. A direct profile link is faster and always correct — if the page loads, it's taken; if it 404s, it's likely free.",
  },
  {
    q: "Should my username match my domain?",
    a: "Ideally yes. A consistent handle across your domain and social platforms makes your brand easier to find and looks more professional. Use our domain generator to find a matching available domain.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Social username availability checker"
      intro="Check whether your brand name is free as a username across the platforms that matter. GitHub is verified live; social profiles are one click away to confirm."
      faqs={FAQS}
    >
      <UsernameTool />
    </ToolPageShell>
  );
}
