import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { TxTool } from "@/components/tools/tx-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("tx-checker")!;

export const metadata: Metadata = {
  title: `${tool.name} — Verify Crypto Transactions On-Chain`,
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
    q: "Which blockchains are supported?",
    a: "You can check transactions on Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain. Pick the chain the transaction happened on, then paste its hash.",
  },
  {
    q: "What does the transaction status mean?",
    a: "“Success” means the transaction was mined and executed without reverting, “Failed” means it was mined but reverted (you still pay gas), and “Pending” means it's in the mempool but not yet included in a block.",
  },
  {
    q: "Do I need a wallet or API key?",
    a: "No. We read the transaction directly from public blockchain nodes, so there's no sign-in, wallet connection, or API key required.",
  },
  {
    q: "What's a transaction hash?",
    a: "It's the unique 66-character identifier (starting with 0x) that every blockchain transaction gets. You'll find it in your wallet's activity, an exchange withdrawal confirmation, or a block explorer URL.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Crypto transaction checker"
      intro="Paste a transaction hash to verify its status, value, gas fee, and confirmations on Ethereum, Base, Arbitrum, Optimism, Polygon, or BNB Chain — read straight from the blockchain, no wallet or sign-in required."
      faqs={FAQS}
    >
      <TxTool />
    </ToolPageShell>
  );
}
