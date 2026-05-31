/**
 * Curated content for the programmatic TLD landing pages at /domains/[tld].
 *
 * The set mirrors SUPPORTED_TLDS so every extension the tool checks has a real,
 * useful explainer page. `seedIdea` feeds the deterministic demo generator so
 * example names suit the extension and stay stable at build time.
 */

export type TldFaq = { q: string; a: string };

export type TldInfo = {
  /** Bare extension, e.g. "ai" (no dot). Used as the route slug. */
  tld: string;
  /** Short human label, e.g. "Artificial Intelligence". */
  label: string;
  /** One-line tagline. */
  tagline: string;
  /** 2-3 sentence intro shown on the page. */
  intro: string;
  /** Who the extension suits best. */
  bestFor: string[];
  pros: string[];
  cons: string[];
  /** Idea used to seed on-theme example names for this extension. */
  seedIdea: string;
  faqs: TldFaq[];
  /** Related TLD slugs for internal linking. */
  related: string[];
};

export const TLDS: TldInfo[] = [
  {
    tld: "com",
    label: "Commercial",
    tagline: "The original, most trusted domain extension.",
    intro:
      ".com is the default the world types from memory and trusts instinctively. It's the strongest choice for almost any business — the trade-off is that the best short .com names are scarce, so brandable or coined names give you the best shot at an available one.",
    bestFor: ["Any business that wants maximum trust", "Ecommerce and brands", "Companies playing the long game"],
    pros: [
      "Highest trust and recognition with the general public.",
      "What people type and assume by default.",
      "Best resale value and long-term brand equity.",
    ],
    cons: [
      "The most competitive — great short names are often taken or premium-priced.",
    ],
    seedIdea: "a modern startup building a brandable product",
    faqs: [
      {
        q: "Is a .com still worth it?",
        a: "Yes. For most businesses .com remains the most trusted and memorable extension. If your exact .com is taken, a brandable or coined name often has an available .com, or a credible alternative like .co or .ai will do.",
      },
      {
        q: "What if my .com is taken?",
        a: "Try a brandable variation, add a short prefix or suffix, or consider a strong alternative like .co, .ai, or .io. Our generator surfaces available options across all of these instantly.",
      },
    ],
    related: ["co", "ai", "io"],
  },
  {
    tld: "ai",
    label: "Artificial Intelligence",
    tagline: "The go-to extension for AI and tech companies.",
    intro:
      ".ai has become the signature extension for artificial-intelligence and modern tech products. It signals you're building something cutting-edge, and great names are far more available than on .com.",
    bestFor: ["AI and machine-learning products", "Modern tech startups", "Developer tools"],
    pros: [
      "Instantly signals an AI or tech focus.",
      "Far more short, brandable names still available than .com.",
      "Widely accepted and trusted in tech circles.",
    ],
    cons: [
      "Registration and renewal cost more than .com.",
      "Less familiar to non-tech, mainstream audiences.",
    ],
    seedIdea: "an artificial intelligence platform for businesses",
    faqs: [
      {
        q: "Is a .ai domain good for a startup?",
        a: "Yes, especially for AI or tech products. It clearly communicates your focus, carries credibility with technical audiences, and offers far better name availability than .com.",
      },
      {
        q: "Why are .ai domains more expensive?",
        a: ".ai is the country-code domain for Anguilla and is priced higher than .com, typically with multi-year registration. For an AI brand, many founders consider the cost worthwhile.",
      },
    ],
    related: ["io", "dev", "tech"],
  },
  {
    tld: "io",
    label: "Tech & Startups",
    tagline: "A startup favorite, especially for developer products.",
    intro:
      ".io is firmly established in tech as a startup and developer-tool extension. It reads as modern and technical, and availability of short, brandable names is excellent compared to .com.",
    bestFor: ["Developer tools and APIs", "Tech startups", "SaaS products"],
    pros: [
      "Strong, modern reputation in tech and startup communities.",
      "Great availability of short names.",
      "Reads well as a brandable, ownable name.",
    ],
    cons: [
      "Pricier than .com.",
      "Less recognized by mainstream, non-technical audiences.",
    ],
    seedIdea: "a developer tools and API startup",
    faqs: [
      {
        q: "Is .io good for a tech company?",
        a: "Yes. .io is widely accepted and respected in tech and startup circles, making it a strong pick for developer tools and SaaS, with much better name availability than .com.",
      },
      {
        q: "Is .io or .com better for a startup?",
        a: "A great .com is still ideal for mainstream credibility, but .io is a respected, modern alternative when the .com is taken — particularly for technical products and audiences.",
      },
    ],
    related: ["ai", "dev", "co"],
  },
  {
    tld: "app",
    label: "Applications",
    tagline: "Purpose-built for mobile and web apps.",
    intro:
      ".app tells visitors exactly what you offer and comes with built-in HTTPS security required by the registry. It's a clean, modern choice for any product centered on an application.",
    bestFor: ["Mobile and web apps", "SaaS products", "Anything 'app'-centric"],
    pros: [
      "Crystal-clear that you're an application.",
      "Requires HTTPS by default, signalling security.",
      "Good availability of clear, descriptive names.",
    ],
    cons: [
      "Less universally recognized than .com.",
      "Only fits products that are genuinely an app.",
    ],
    seedIdea: "a mobile productivity app for teams",
    faqs: [
      {
        q: "Who should use a .app domain?",
        a: "Any company whose core product is a mobile or web app. It communicates purpose immediately and enforces HTTPS, which is a small trust and security plus.",
      },
      {
        q: "Does .app require HTTPS?",
        a: "Yes. .app is on the HSTS preload list, so browsers require a valid HTTPS certificate — which is standard practice anyway and signals security to users.",
      },
    ],
    related: ["dev", "io", "tech"],
  },
  {
    tld: "dev",
    label: "Developers",
    tagline: "Made for developers, tools, and documentation.",
    intro:
      ".dev is a natural home for developer tools, open-source projects, portfolios, and documentation. Like .app, it requires HTTPS and reads as credible to technical audiences.",
    bestFor: ["Developer tools", "Engineer portfolios", "Open-source projects and docs"],
    pros: [
      "Clearly signals a developer focus.",
      "HTTPS required by default.",
      "Plenty of clean names still available.",
    ],
    cons: [
      "Niche — best for technical audiences.",
      "Not a fit for mainstream consumer brands.",
    ],
    seedIdea: "an open source developer tool and platform",
    faqs: [
      {
        q: "What is a .dev domain used for?",
        a: "It's popular for developer tools, engineering portfolios, open-source projects, and documentation sites — anything aimed at a technical audience.",
      },
      {
        q: "Is .dev a good domain?",
        a: "For developer-focused products and personal engineering brands, yes. It's modern, credible with technical users, and enforces HTTPS by default.",
      },
    ],
    related: ["app", "io", "ai"],
  },
  {
    tld: "xyz",
    label: "Modern & Creative",
    tagline: "A flexible, affordable extension for anything new.",
    intro:
      ".xyz is a versatile, low-cost extension embraced by startups, web3 projects, and creators who want a short, memorable name without .com scarcity. It's modern and unrestricted — you can use it for anything.",
    bestFor: ["Startups and side projects", "Web3 and creative brands", "Short, catchy names"],
    pros: [
      "Inexpensive and widely available.",
      "Short, brandable names are easy to find.",
      "Modern, no-rules feel.",
    ],
    cons: [
      "Less trusted by mainstream audiences than .com.",
      "Has been associated with spam in some circles.",
    ],
    seedIdea: "a creative startup with a catchy brand",
    faqs: [
      {
        q: "Is .xyz a legitimate domain?",
        a: "Yes — .xyz is a fully legitimate, widely used extension popular with startups and creators. As with any newer TLD, pair it with a quality site so it reads as trustworthy.",
      },
      {
        q: "Who uses .xyz domains?",
        a: "Startups, web3 and crypto projects, creators, and anyone wanting a short, affordable, brandable name when the .com is unavailable.",
      },
    ],
    related: ["co", "online", "store"],
  },
  {
    tld: "co",
    label: "Companies",
    tagline: "The most popular .com alternative.",
    intro:
      ".co reads as short for 'company' and is the most credible, widely-accepted alternative when your .com is taken. It's brandable, trusted, and recognizable to mainstream audiences.",
    bestFor: ["Startups and companies", "Brands whose .com is taken", "Global businesses"],
    pros: [
      "Closest in feel and trust to .com.",
      "Short and brandable.",
      "Recognized by general audiences.",
    ],
    cons: [
      "People sometimes type .com out of habit.",
      "Pricier than .com.",
    ],
    seedIdea: "a fast-growing company and brand",
    faqs: [
      {
        q: "Is .co a good alternative to .com?",
        a: "Yes — .co is the most widely-accepted .com alternative, reading as short for 'company'. It's brandable and trusted, though some visitors may type .com out of habit.",
      },
      {
        q: "What does .co stand for?",
        a: "It's the country-code domain for Colombia, but it's marketed and widely used globally as shorthand for 'company' or 'corporation'.",
      },
    ],
    related: ["com", "io", "xyz"],
  },
  {
    tld: "org",
    label: "Organizations",
    tagline: "The trusted choice for nonprofits and communities.",
    intro:
      ".org signals a nonprofit, community, or mission-driven organization. It carries a long history of trust and is the expected extension for charities, open-source foundations, and member groups.",
    bestFor: ["Nonprofits and charities", "Communities and foundations", "Open-source projects"],
    pros: [
      "Strong trust for mission-driven groups.",
      "Widely recognized and expected for nonprofits.",
      "Better availability than .com.",
    ],
    cons: [
      "Reads as non-commercial — less ideal for a for-profit brand.",
    ],
    seedIdea: "a nonprofit organization and community",
    faqs: [
      {
        q: "Who should use a .org domain?",
        a: "Nonprofits, charities, communities, foundations, and open-source projects. It signals a mission-driven, non-commercial purpose that audiences trust.",
      },
      {
        q: "Can a business use .org?",
        a: "It can, but .org reads as non-commercial, so for-profit brands are usually better served by .com, .co, or an industry-specific extension.",
      },
    ],
    related: ["com", "net", "co"],
  },
  {
    tld: "tech",
    label: "Technology",
    tagline: "A descriptive extension for technology brands.",
    intro:
      ".tech spells out your industry and gives technology companies a clear, descriptive home. It offers strong availability and works well for hardware, startups, conferences, and tech media.",
    bestFor: ["Technology companies", "Hardware and gadgets", "Tech events and media"],
    pros: [
      "Clearly communicates a technology focus.",
      "Excellent name availability.",
      "Descriptive and SEO-friendly for tech terms.",
    ],
    cons: [
      "Longer than .com or .io.",
      "Less trusted by mainstream audiences than .com.",
    ],
    seedIdea: "a technology company building hardware and software",
    faqs: [
      {
        q: "Is .tech a good domain extension?",
        a: "For technology companies, yes — it's descriptive, widely available, and signals your industry clearly. It's a bit longer than .io or .com, so favor concise names.",
      },
      {
        q: "Who uses .tech domains?",
        a: "Tech startups, hardware makers, conferences, accelerators, and tech publications that want their industry in the name.",
      },
    ],
    related: ["io", "ai", "app"],
  },
  {
    tld: "net",
    label: "Network",
    tagline: "A classic fallback with broad recognition.",
    intro:
      ".net is one of the original extensions and remains a recognizable, trusted fallback — historically associated with networks, infrastructure, and internet services. It's a solid choice when your .com is unavailable.",
    bestFor: ["Tech and infrastructure services", "Communities and platforms", "Brands whose .com is taken"],
    pros: [
      "Long-established and broadly recognized.",
      "Better availability than .com.",
      "Neutral and professional.",
    ],
    cons: [
      "Can feel dated compared to newer extensions.",
      "People often default to typing .com.",
    ],
    seedIdea: "a network and internet services platform",
    faqs: [
      {
        q: "Is .net still a good domain?",
        a: "It's a recognizable, professional fallback when your .com is taken, especially for tech, infrastructure, or community platforms. Newer extensions like .co or .io can feel more modern.",
      },
      {
        q: "What is .net used for?",
        a: "Originally for network and internet-service providers, it's now used broadly as a general-purpose alternative to .com.",
      },
    ],
    related: ["com", "org", "co"],
  },
  {
    tld: "online",
    label: "Online Presence",
    tagline: "A clear, descriptive extension for any web presence.",
    intro:
      ".online plainly states that you're on the web and offers wide availability for descriptive names. It suits courses, communities, small businesses, and projects that want an obvious, affordable home.",
    bestFor: ["Small businesses and creators", "Courses and communities", "Descriptive keyword names"],
    pros: [
      "Self-explanatory and easy to understand.",
      "Lots of available names.",
      "Affordable.",
    ],
    cons: [
      "Longer than most extensions.",
      "Less premium feel than .com or .co.",
    ],
    seedIdea: "an online business and community platform",
    faqs: [
      {
        q: "Is .online a good domain?",
        a: "It's a clear, affordable option with great availability, well-suited to small businesses, courses, and communities. For a premium brand feel, .com or .co are stronger.",
      },
      {
        q: "Who should use .online?",
        a: "Creators, small businesses, and projects that want an obvious, descriptive, budget-friendly web address when the .com is taken.",
      },
    ],
    related: ["store", "xyz", "co"],
  },
  {
    tld: "store",
    label: "Ecommerce",
    tagline: "Built for online shops and retail brands.",
    intro:
      ".store tells shoppers exactly what to expect and is purpose-built for ecommerce. It's a descriptive, available option for retail brands, boutiques, and product launches.",
    bestFor: ["Online shops and retail", "Product brands and boutiques", "Ecommerce launches"],
    pros: [
      "Instantly signals a place to buy.",
      "Strong availability for retail names.",
      "Descriptive and SEO-friendly for shopping terms.",
    ],
    cons: [
      "Only fits ecommerce and retail.",
      "Longer than .com or .co.",
    ],
    seedIdea: "an online store selling products direct to consumers",
    faqs: [
      {
        q: "Is .store good for ecommerce?",
        a: "Yes — .store clearly communicates that you sell products, which can help shoppers and search relevance. It's a strong, available pick for retail brands and product launches.",
      },
      {
        q: "Should my shop use .store or .com?",
        a: "A .com is still the most trusted for checkout, but .store is a clear, descriptive alternative when your .com is taken and works well for new retail brands.",
      },
    ],
    related: ["online", "co", "xyz"],
  },
];

const TLD_MAP = new Map(TLDS.map((t) => [t.tld, t]));

export function getTld(tld: string): TldInfo | undefined {
  return TLD_MAP.get(tld);
}
