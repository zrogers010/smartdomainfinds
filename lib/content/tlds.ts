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
  {
    tld: "info",
    label: "Information",
    tagline: "A classic, descriptive extension for resource sites.",
    intro:
      ".info is one of the original generic extensions and reads as a place to learn or look something up. It's a recognizable, affordable option for guides, resource hubs, and knowledge bases when the .com is taken.",
    bestFor: ["Resource and reference sites", "Guides and knowledge bases", "Informational projects"],
    pros: [
      "Self-explanatory and widely recognized.",
      "Strong availability of descriptive names.",
      "Affordable and trusted for content sites.",
    ],
    cons: [
      "Less premium feel than .com for a commercial brand.",
      "Has historically attracted some low-quality sites.",
    ],
    seedIdea: "an informational resource hub and knowledge base",
    faqs: [
      {
        q: "Is a .info domain good?",
        a: "For informational, reference, and resource sites it's a clear, affordable choice with good availability. For a product or commercial brand, .com or .co usually read as more premium.",
      },
      {
        q: "Who uses .info domains?",
        a: "Guides, knowledge bases, public-information projects, and content sites that want their purpose obvious in the name.",
      },
    ],
    related: ["org", "online", "site"],
  },
  {
    tld: "site",
    label: "Websites",
    tagline: "A clean, descriptive home for any website.",
    intro:
      ".site is a flexible, affordable extension that simply says you're online. It works for portfolios, small businesses, side projects, and landing pages, with excellent availability of short, descriptive names.",
    bestFor: ["Portfolios and personal sites", "Small businesses and side projects", "Landing pages"],
    pros: [
      "Clear and easy to understand.",
      "Great availability of brandable names.",
      "Affordable to register.",
    ],
    cons: [
      "Less premium than .com or .co.",
      "Generic feel for a flagship brand.",
    ],
    seedIdea: "a personal portfolio and project website",
    faqs: [
      {
        q: "Is .site a good domain extension?",
        a: "It's a clear, affordable, widely-available option that suits portfolios, small businesses, and side projects. For a premium commercial brand, .com or .co feel stronger.",
      },
      {
        q: "Who should use a .site domain?",
        a: "Creators, freelancers, and small projects that want an obvious, budget-friendly web address when the .com is unavailable.",
      },
    ],
    related: ["online", "space", "xyz"],
  },
  {
    tld: "studio",
    label: "Studios & Creatives",
    tagline: "Made for design, photo, music, and creative studios.",
    intro:
      ".studio is a natural, on-brand home for creative businesses — design, photography, music, film, and agencies. It signals craft and creativity, and short, brandable names are far more available than on .com.",
    bestFor: ["Design and creative studios", "Photographers and videographers", "Music and recording studios"],
    pros: [
      "Instantly signals a creative studio.",
      "Excellent availability of brandable names.",
      "Reads as modern and professional.",
    ],
    cons: [
      "Longer than .com or .co.",
      "Best suited to creative businesses specifically.",
    ],
    seedIdea: "a creative design and photography studio",
    faqs: [
      {
        q: "Who should use a .studio domain?",
        a: "Design, photography, film, music, and creative agencies — anyone whose brand centers on craft and studio work. It communicates that clearly and offers great name availability.",
      },
      {
        q: "Is .studio a credible extension?",
        a: "Yes. It's well-established with creative professionals and reads as modern and intentional, especially paired with a polished portfolio site.",
      },
    ],
    related: ["design", "media", "agency"],
  },
  {
    tld: "design",
    label: "Designers",
    tagline: "The signature extension for design brands.",
    intro:
      ".design tells the world exactly what you do. It's a favorite among product designers, studios, and agencies who want a descriptive, credible name — with availability that .com can't match.",
    bestFor: ["Designers and design studios", "Agencies and portfolios", "Design tools and communities"],
    pros: [
      "Clearly communicates a design focus.",
      "Strong availability of memorable names.",
      "Credible and modern in creative circles.",
    ],
    cons: [
      "Pricier than .com.",
      "Niche — best for design-led brands.",
    ],
    seedIdea: "a product design studio and portfolio",
    faqs: [
      {
        q: "Is .design good for a portfolio?",
        a: "Yes — it's descriptive, credible with creative audiences, and offers far better availability than .com, making it a strong pick for designers and studios.",
      },
      {
        q: "Who uses .design domains?",
        a: "Product and graphic designers, design studios, agencies, and design tools or communities that want their craft in the name.",
      },
    ],
    related: ["studio", "agency", "media"],
  },
  {
    tld: "space",
    label: "Creative & Startups",
    tagline: "A versatile, modern extension with room to grow.",
    intro:
      ".space is a flexible, affordable extension embraced by startups, creators, and communities. It reads as open and modern — a good fit for coworking, communities, portfolios, and creative projects when the .com is gone.",
    bestFor: ["Startups and creative projects", "Communities and coworking", "Portfolios and personal brands"],
    pros: [
      "Short, modern, and brandable.",
      "Great availability of catchy names.",
      "Affordable and unrestricted.",
    ],
    cons: [
      "Less mainstream trust than .com.",
      "Best paired with a polished site.",
    ],
    seedIdea: "a creative community and coworking space",
    faqs: [
      {
        q: "Is .space a legitimate domain?",
        a: "Yes — it's a fully legitimate, widely-used extension popular with startups, creators, and communities. As with any newer TLD, pair it with a quality site so it reads as trustworthy.",
      },
      {
        q: "Who uses .space domains?",
        a: "Startups, creative projects, communities, coworking brands, and personal portfolios wanting a short, modern name.",
      },
    ],
    related: ["xyz", "site", "club"],
  },
  {
    tld: "cloud",
    label: "Cloud & SaaS",
    tagline: "Purpose-built for SaaS and infrastructure brands.",
    intro:
      ".cloud is a descriptive, modern extension for SaaS products, hosting, and infrastructure companies. It signals that you're cloud-native and offers strong availability for technical, brandable names.",
    bestFor: ["SaaS and cloud platforms", "Hosting and infrastructure", "Developer and data products"],
    pros: [
      "Clearly signals a cloud or SaaS product.",
      "Great availability of technical names.",
      "Modern and credible with tech buyers.",
    ],
    cons: [
      "Best suited to cloud/SaaS specifically.",
      "Less recognized by mainstream audiences.",
    ],
    seedIdea: "a cloud SaaS platform for businesses",
    faqs: [
      {
        q: "Is .cloud good for a SaaS company?",
        a: "Yes. It immediately communicates a cloud-based product, reads as modern to technical buyers, and has far better availability than .com for descriptive names.",
      },
      {
        q: "Who uses .cloud domains?",
        a: "SaaS platforms, hosting providers, infrastructure and data companies, and developer tools that want their cloud focus in the name.",
      },
    ],
    related: ["io", "tech", "app"],
  },
  {
    tld: "shop",
    label: "Ecommerce",
    tagline: "A clear, modern home for online shops.",
    intro:
      ".shop tells customers exactly what to expect and is purpose-built for ecommerce and retail. It's descriptive, modern, and available for product brands, boutiques, and direct-to-consumer launches.",
    bestFor: ["Online shops and DTC brands", "Boutiques and product launches", "Retail and marketplaces"],
    pros: [
      "Instantly signals a place to buy.",
      "Excellent availability for retail names.",
      "Descriptive and SEO-friendly for shopping terms.",
    ],
    cons: [
      "Fits ecommerce specifically.",
      "Pricier than .com.",
    ],
    seedIdea: "an online shop selling products direct to consumers",
    faqs: [
      {
        q: "Is .shop good for ecommerce?",
        a: "Yes — it clearly communicates that you sell products, which helps shoppers and search relevance. It's a strong, available option for new retail brands and product launches.",
      },
      {
        q: "Should I use .shop or .store?",
        a: "Both are purpose-built for ecommerce and read clearly. Pick whichever pairs better with your name and is available; .shop tends to read a touch more modern.",
      },
    ],
    related: ["store", "online", "co"],
  },
  {
    tld: "agency",
    label: "Agencies",
    tagline: "Descriptive and on-brand for any agency.",
    intro:
      ".agency spells out what you are and gives marketing, creative, and service agencies a clear, credible home. Availability is excellent, so you can land a short, memorable name that .com can't offer.",
    bestFor: ["Marketing and creative agencies", "Consultancies and service firms", "Studios and collectives"],
    pros: [
      "Clearly communicates an agency.",
      "Strong availability of brandable names.",
      "Descriptive and professional.",
    ],
    cons: [
      "Longer than .com or .co.",
      "Best suited to agencies specifically.",
    ],
    seedIdea: "a creative marketing agency",
    faqs: [
      {
        q: "Is .agency a good domain?",
        a: "For marketing, creative, and service agencies, yes — it's descriptive, credible, and widely available, so you can secure a clean, memorable name.",
      },
      {
        q: "Who uses .agency domains?",
        a: "Marketing, advertising, design, and consulting agencies, plus studios and collectives that want their model clear in the name.",
      },
    ],
    related: ["studio", "media", "design"],
  },
  {
    tld: "media",
    label: "Media & Content",
    tagline: "A natural fit for publishers and content brands.",
    intro:
      ".media reads as a home for content — publishers, production companies, podcasts, and creator brands. It's descriptive and modern, with great availability for memorable names.",
    bestFor: ["Publishers and content brands", "Production and media companies", "Podcasts and creators"],
    pros: [
      "Clearly signals a media or content brand.",
      "Great availability of memorable names.",
      "Modern and professional.",
    ],
    cons: [
      "Longer than .com or .tv.",
      "Best for media and content specifically.",
    ],
    seedIdea: "a digital media and content production company",
    faqs: [
      {
        q: "Who should use a .media domain?",
        a: "Publishers, production companies, podcasts, newsletters, and creator brands that want their content focus in the name. Availability is strong and it reads cleanly.",
      },
      {
        q: "Is .media a credible extension?",
        a: "Yes — it's well-established with content and production businesses and reads as modern and intentional.",
      },
    ],
    related: ["studio", "agency", "live"],
  },
  {
    tld: "digital",
    label: "Digital Brands",
    tagline: "A descriptive extension for digital-first businesses.",
    intro:
      ".digital suits agencies, products, and services that are digital at their core. It's descriptive and modern, with excellent availability for clear, brandable names.",
    bestFor: ["Digital agencies and studios", "Digital products and services", "Transformation and consulting"],
    pros: [
      "Signals a digital-first focus.",
      "Excellent availability of names.",
      "Modern and professional.",
    ],
    cons: [
      "Longer than .com or .co.",
      "Less recognized by mainstream audiences.",
    ],
    seedIdea: "a digital agency building products and services",
    faqs: [
      {
        q: "Is .digital a good domain extension?",
        a: "For digital agencies, products, and services it's descriptive, modern, and widely available, making it easy to land a clear, brandable name.",
      },
      {
        q: "Who uses .digital domains?",
        a: "Digital agencies, studios, product teams, and consultancies that want their digital focus in the name.",
      },
    ],
    related: ["agency", "tech", "studio"],
  },
  {
    tld: "world",
    label: "Global & Communities",
    tagline: "An expansive extension for global brands and communities.",
    intro:
      ".world reads as open, global, and community-minded. It's a flexible choice for movements, communities, events, and brands that want a big, welcoming feel — with great name availability.",
    bestFor: ["Communities and movements", "Global brands and events", "Mission-driven projects"],
    pros: [
      "Expansive, welcoming, and memorable.",
      "Great availability of evocative names.",
      "Works across many industries.",
    ],
    cons: [
      "Less premium than .com for a product brand.",
      "Longer than short alternatives.",
    ],
    seedIdea: "a global community and movement brand",
    faqs: [
      {
        q: "Who should use a .world domain?",
        a: "Communities, movements, events, and brands that want an open, global, welcoming feel. It's evocative and widely available.",
      },
      {
        q: "Is .world a legitimate extension?",
        a: "Yes — it's a fully legitimate generic extension. Pair it with a strong brand and site and it reads as modern and intentional.",
      },
    ],
    related: ["club", "life", "org"],
  },
  {
    tld: "life",
    label: "Lifestyle",
    tagline: "A warm, human extension for lifestyle brands.",
    intro:
      ".life feels personal and human — a natural fit for wellness, coaching, lifestyle, and community brands. It's memorable and widely available for evocative names.",
    bestFor: ["Wellness and coaching", "Lifestyle and community brands", "Personal brands and creators"],
    pros: [
      "Warm, human, and memorable.",
      "Great availability of evocative names.",
      "Works for personal and lifestyle brands.",
    ],
    cons: [
      "Less corporate feel.",
      "Not ideal for a technical product.",
    ],
    seedIdea: "a wellness and lifestyle coaching brand",
    faqs: [
      {
        q: "Who uses .life domains?",
        a: "Wellness coaches, lifestyle and community brands, creators, and personal brands that want a warm, human name. Availability is excellent.",
      },
      {
        q: "Is .life a good domain?",
        a: "For lifestyle, wellness, and personal brands it's evocative and widely available. For a corporate or technical product, .com or .co read stronger.",
      },
    ],
    related: ["world", "live", "club"],
  },
  {
    tld: "live",
    label: "Streaming & Events",
    tagline: "Built for streaming, events, and real-time brands.",
    intro:
      ".live reads as energetic and immediate — perfect for streamers, events, broadcasts, and real-time products. It's memorable and offers great availability for short, punchy names.",
    bestFor: ["Streamers and broadcasts", "Events and conferences", "Real-time products"],
    pros: [
      "Energetic and immediate.",
      "Great availability of punchy names.",
      "Modern and memorable.",
    ],
    cons: [
      "Best for live/real-time brands.",
      "Less mainstream than .com.",
    ],
    seedIdea: "a live streaming and events platform",
    faqs: [
      {
        q: "Who should use a .live domain?",
        a: "Streamers, event brands, broadcasts, and real-time products that want energy and immediacy in the name. It's memorable and widely available.",
      },
      {
        q: "Is .live a credible extension?",
        a: "Yes — it's well-suited to streaming, events, and real-time brands and reads as modern, especially with a polished site.",
      },
    ],
    related: ["media", "world", "fun"],
  },
  {
    tld: "club",
    label: "Communities & Membership",
    tagline: "A welcoming extension for clubs and communities.",
    intro:
      ".club is purpose-built for communities, memberships, and groups. It signals belonging and is a natural fit for clubs, fan communities, and subscription brands — with great availability.",
    bestFor: ["Clubs and communities", "Membership and subscription brands", "Fan and interest groups"],
    pros: [
      "Signals community and belonging.",
      "Great availability of brandable names.",
      "Short and memorable.",
    ],
    cons: [
      "Best for community/membership brands.",
      "Less premium for a flagship product.",
    ],
    seedIdea: "a membership community and club",
    faqs: [
      {
        q: "Who uses .club domains?",
        a: "Clubs, communities, membership and subscription brands, and fan or interest groups that want belonging in the name. Availability is strong.",
      },
      {
        q: "Is .club a good domain?",
        a: "For communities and membership brands it's descriptive and memorable, with great availability. For a corporate product, .com or .co read stronger.",
      },
    ],
    related: ["space", "world", "vip"],
  },
  {
    tld: "blog",
    label: "Blogs & Creators",
    tagline: "A clear home for blogs and creator content.",
    intro:
      ".blog says exactly what it is and is a natural fit for writers, creators, and content sites. It's descriptive, modern, and widely available for memorable names.",
    bestFor: ["Blogs and writers", "Creators and newsletters", "Content and personal sites"],
    pros: [
      "Crystal-clear that you publish content.",
      "Great availability of names.",
      "Modern and SEO-friendly for content.",
    ],
    cons: [
      "Fits content sites specifically.",
      "Less premium for a product brand.",
    ],
    seedIdea: "a personal blog and newsletter",
    faqs: [
      {
        q: "Is .blog a good domain?",
        a: "For blogs, creators, and content sites it's clear, modern, and widely available. For a commercial product, .com or .co read more premium.",
      },
      {
        q: "Who uses .blog domains?",
        a: "Writers, creators, newsletters, and content sites that want their purpose obvious in the name.",
      },
    ],
    related: ["media", "site", "online"],
  },
  {
    tld: "link",
    label: "Links & Bio",
    tagline: "Short and perfect for link-in-bio and redirects.",
    intro:
      ".link is short and literal — ideal for link-in-bio pages, short links, and redirects. It reads as modern and utility-focused, with excellent availability for snappy names.",
    bestFor: ["Link-in-bio and landing pages", "Short links and redirects", "Creators and personal brands"],
    pros: [
      "Short, literal, and modern.",
      "Great availability of snappy names.",
      "Perfect for links and redirects.",
    ],
    cons: [
      "Niche — best for link/redirect use.",
      "Less mainstream than .com.",
    ],
    seedIdea: "a link-in-bio and short link tool",
    faqs: [
      {
        q: "Who should use a .link domain?",
        a: "Creators and brands building link-in-bio pages, short links, or redirects. It's short, literal, and widely available.",
      },
      {
        q: "Is .link a credible extension?",
        a: "Yes — it's well-suited to link and redirect use cases and reads as modern and intentional.",
      },
    ],
    related: ["site", "space", "co"],
  },
  {
    tld: "fun",
    label: "Playful Brands",
    tagline: "A lighthearted extension for playful projects.",
    intro:
      ".fun is exactly what it sounds like — playful and approachable. It's a great fit for games, events, kids' brands, and side projects that don't take themselves too seriously, with wide availability.",
    bestFor: ["Games and entertainment", "Events and kids' brands", "Playful side projects"],
    pros: [
      "Playful and approachable.",
      "Great availability of catchy names.",
      "Affordable and memorable.",
    ],
    cons: [
      "Too casual for a corporate brand.",
      "Less mainstream trust than .com.",
    ],
    seedIdea: "a playful games and entertainment brand",
    faqs: [
      {
        q: "Who uses .fun domains?",
        a: "Games, entertainment, events, kids' brands, and playful side projects that want a lighthearted name. Availability is strong.",
      },
      {
        q: "Is .fun a legitimate domain?",
        a: "Yes — it's a fully legitimate extension. It just reads as casual, so it's best for playful brands rather than corporate ones.",
      },
    ],
    related: ["xyz", "space", "club"],
  },
  {
    tld: "vip",
    label: "Premium & Membership",
    tagline: "An exclusive-feeling extension for premium brands.",
    intro:
      ".vip signals exclusivity and membership. It suits premium communities, events, creators, and loyalty brands that want a sense of access — with great availability for short, punchy names.",
    bestFor: ["Premium communities and memberships", "Creators and loyalty brands", "Events and clubs"],
    pros: [
      "Signals exclusivity and access.",
      "Short and memorable.",
      "Great availability of names.",
    ],
    cons: [
      "Niche — best for premium/membership brands.",
      "Less mainstream than .com.",
    ],
    seedIdea: "a premium membership community and loyalty brand",
    faqs: [
      {
        q: "Who should use a .vip domain?",
        a: "Premium communities, memberships, creators, and loyalty brands that want a sense of exclusivity and access in the name.",
      },
      {
        q: "Is .vip a credible extension?",
        a: "Yes — it's well-suited to premium and membership brands and reads as intentional, especially paired with a polished experience.",
      },
    ],
    related: ["club", "world", "co"],
  },
];

const TLD_MAP = new Map(TLDS.map((t) => [t.tld, t]));

export function getTld(tld: string): TldInfo | undefined {
  return TLD_MAP.get(tld);
}
