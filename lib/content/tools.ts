/** Registry of free micro-tools. Powers the /tools hub, footer, and sitemap. */
export type ToolMeta = {
  slug: string;
  name: string;
  tagline: string;
  /** Longer meta description. */
  blurb: string;
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "social-username-checker",
    name: "Username Checker",
    tagline: "See if your name is free across social platforms.",
    blurb:
      "Check username availability on GitHub, X, Instagram, TikTok, YouTube and more — find a handle that's free everywhere, alongside your domain.",
  },
  {
    slug: "whois-lookup",
    name: "WHOIS & DNS Lookup",
    tagline: "Registrar, domain age, expiry, and live DNS records.",
    blurb:
      "Look up any domain's registration details (registrar, creation date, age, expiry) and live DNS records (A, AAAA, MX, NS, TXT) via authoritative RDAP.",
  },
  {
    slug: "bulk-domain-checker",
    name: "Bulk Domain Checker",
    tagline: "Check availability for a whole list of domains at once.",
    blurb:
      "Paste up to 50 domains and check them all for availability in one go, with one-click links to register the available ones.",
  },
  {
    slug: "ens-checker",
    name: "ENS (.eth) Checker",
    tagline: "Check if a web3 .eth name is available on-chain.",
    blurb:
      "Check ENS (.eth) name availability directly on the Ethereum blockchain — no wallet needed — with links to register on ENS or view on OpenSea.",
  },
  {
    slug: "tx-checker",
    name: "Crypto Transaction Checker",
    tagline: "Verify any transaction across Ethereum, Base, Arbitrum & more.",
    blurb:
      "Paste a transaction hash to verify its status, value, gas fee, and confirmations on Ethereum, Base, Arbitrum, Optimism, Polygon, or BNB Chain — straight from the blockchain, no account needed.",
  },
  {
    slug: "crypto-wallet-checker",
    name: "Crypto Wallet & Stablecoin Checker",
    tagline: "See native and USDC/USDT/DAI balances for any address.",
    blurb:
      "Look up any wallet address or ENS name to see its native balance and USDC, USDT, and DAI stablecoin holdings across Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain — on-chain and key-free.",
  },
  {
    slug: "nft-lookup",
    name: "NFT Lookup",
    tagline: "Fetch any NFT's owner, metadata, and artwork by token ID.",
    blurb:
      "Enter an NFT contract address and token ID to view its collection, current owner, traits, and artwork across Ethereum, Base, Arbitrum, Optimism, Polygon, and BNB Chain — read directly on-chain.",
  },
  {
    slug: "slogan-generator",
    name: "Slogan Generator",
    tagline: "Instant tagline and slogan ideas for your brand.",
    blurb:
      "Generate catchy slogan and tagline ideas for your brand or product instantly — free, with no sign-up, and one-click copy.",
  },
  {
    slug: "acronym-generator",
    name: "Acronym Generator",
    tagline: "Turn a word into a memorable backronym.",
    blurb:
      "Turn any short word into a memorable acronym (backronym) with positive, business-friendly word expansions for each letter.",
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.slug, t]));

export function getTool(slug: string): ToolMeta | undefined {
  return TOOL_MAP.get(slug);
}

/** Related tools = everything except the given slug, capped. */
export function relatedTools(slug: string, limit = 3): ToolMeta[] {
  return TOOLS.filter((t) => t.slug !== slug).slice(0, limit);
}
