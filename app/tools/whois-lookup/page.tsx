import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { WhoisTool } from "@/components/tools/whois-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("whois-lookup")!;

export const metadata: Metadata = {
  title: `${tool.name} — Domain Age, Registrar & DNS`,
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
    q: "What information does this WHOIS lookup show?",
    a: "For supported TLDs it shows the registrar, registration (creation) date, last update, expiry date, and the domain's age in years, plus live DNS records — A, AAAA, MX, nameservers, TXT, and CNAME.",
  },
  {
    q: "Where does the data come from?",
    a: "Registration data comes from authoritative RDAP servers (the modern, structured replacement for WHOIS). DNS records are resolved live at lookup time. Some TLDs don't publish RDAP data, in which case registration details may be unavailable while DNS still works.",
  },
  {
    q: "How is domain age calculated?",
    a: "Age is the number of whole years between the domain's registration date and today, based on the RDAP registration event. Older domains are often considered more trustworthy by search engines.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="WHOIS, domain age & DNS lookup"
      intro="Look up any domain's registrar, registration date, age, and expiry, plus its live DNS records — powered by authoritative RDAP, no API key required."
      faqs={FAQS}
    >
      <WhoisTool />
    </ToolPageShell>
  );
}
