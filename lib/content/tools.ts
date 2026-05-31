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
