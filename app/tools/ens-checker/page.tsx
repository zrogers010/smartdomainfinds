import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { EnsTool } from "@/components/tools/ens-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("ens-checker")!;

export const metadata: Metadata = {
  title: `${tool.name} — Web3 .eth Name Availability`,
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
    q: "What is an ENS (.eth) name?",
    a: "ENS (Ethereum Name Service) names like yourbrand.eth are web3 domains: human-readable names that map to crypto wallet addresses and decentralized websites, stored on the Ethereum blockchain as NFTs.",
  },
  {
    q: "How is .eth availability checked?",
    a: "We query the ENS BaseRegistrar smart contract directly on the Ethereum blockchain to ask whether the name is available — an authoritative, on-chain answer. No wallet or sign-in is needed to check.",
  },
  {
    q: "Why do .eth names need to be at least 3 characters?",
    a: "The ENS registrar only allows registration of names with three or more characters. Shorter names aren't registrable through the standard controller, so the checker requires at least three characters.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="ENS (.eth) name checker"
      intro="Check whether a web3 .eth name is available — verified directly on the Ethereum blockchain, with one-click links to register on ENS or view an existing name on OpenSea."
      faqs={FAQS}
    >
      <EnsTool />
    </ToolPageShell>
  );
}
