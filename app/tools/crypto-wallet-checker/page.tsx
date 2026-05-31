import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { WalletTool } from "@/components/tools/wallet-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("crypto-wallet-checker")!;

export const metadata: Metadata = {
  title: `${tool.name} — USDC, USDT & DAI Balances`,
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
    q: "Which stablecoins does it check?",
    a: "We read the on-chain balances of the major dollar stablecoins — USDC, USDT, and DAI — for the address you enter, on whichever chain you select.",
  },
  {
    q: "Can I use an ENS name instead of an address?",
    a: "Yes. Enter a name like yourbrand.eth and we'll resolve it to its Ethereum address first, then read the balances.",
  },
  {
    q: "Which chains are supported?",
    a: "Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain. Note that the same wallet can hold different balances on each chain, so pick the one you want to inspect.",
  },
  {
    q: "Is this safe — do I connect my wallet?",
    a: "It's completely read-only. You paste a public address (or ENS name); we never ask you to connect a wallet, sign anything, or share a private key.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="Crypto wallet & stablecoin checker"
      intro="Enter any wallet address or ENS name to see its native balance and USDC, USDT, and DAI stablecoin holdings across Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain — read-only, on-chain, and key-free."
      faqs={FAQS}
    >
      <WalletTool />
    </ToolPageShell>
  );
}
