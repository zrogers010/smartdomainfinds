import type { Metadata } from "next";

import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { NftTool } from "@/components/tools/nft-tool";
import { getTool } from "@/lib/content/tools";

const tool = getTool("nft-lookup")!;

export const metadata: Metadata = {
  title: `${tool.name} — Owner, Metadata & Artwork`,
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
    q: "What do I need to look up an NFT?",
    a: "The NFT's contract address (a 0x… address) and its token ID (a number), plus the chain it lives on. You'll find both in the URL on a marketplace like OpenSea or on a block explorer.",
  },
  {
    q: "Does it support ERC-721 and ERC-1155?",
    a: "Yes. We read ERC-721 ownership (ownerOf) when available and fall back to the ERC-1155 metadata URI, so both standards are covered.",
  },
  {
    q: "Why is the image sometimes missing?",
    a: "Some NFTs store their artwork on IPFS gateways that can be slow or offline, and a few use formats we can't preview. We always show the on-chain data and links even when the image can't load.",
  },
  {
    q: "Which chains are supported?",
    a: "Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain. Make sure to pick the chain the NFT was minted on.",
  },
];

export default function Page() {
  return (
    <ToolPageShell
      slug={tool.slug}
      heading="NFT lookup"
      intro="Enter an NFT contract address and token ID to see its collection, current owner, traits, and artwork across Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain — read directly from the blockchain."
      faqs={FAQS}
    >
      <NftTool />
    </ToolPageShell>
  );
}
