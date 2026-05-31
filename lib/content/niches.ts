/**
 * Curated niches for the programmatic "business name ideas" landing pages.
 *
 * Each niche powers a statically-generated page at
 * /business-name-ideas/[slug]. `seedIdea` feeds the deterministic demo
 * generator (so example names are stable at build time) and the homepage tool
 * via /?q=. The rest is genuine, page-unique copy so these are real, useful
 * pages — not thin doorway pages.
 */

export type NicheFaq = { q: string; a: string };

export type Niche = {
  slug: string;
  /** Display name, e.g. "Coffee Shop". */
  name: string;
  /** Natural-language idea (>= 8 chars) for the generator + ?q= deep link. */
  seedIdea: string;
  /** One-line meta description seed. */
  blurb: string;
  /** 2-3 sentence intro shown on the page. */
  intro: string;
  /** Practical naming tips specific to this niche. */
  tips: string[];
  faqs: NicheFaq[];
  /** Related niche slugs for internal linking. */
  related: string[];
};

export const NICHES: Niche[] = [
  {
    slug: "coffee-shop",
    name: "Coffee Shop",
    seedIdea: "a cozy neighborhood coffee shop and espresso bar",
    blurb:
      "Brandable, available name ideas for a coffee shop, café, or espresso bar.",
    intro:
      "A great coffee shop name feels warm, local, and easy to say out loud at the counter. Below are brandable ideas you can check for an available domain in seconds — then generate dozens more tuned to your vibe.",
    tips: [
      "Keep it short and easy to say — customers will recommend it by word of mouth.",
      "Evoke a feeling (cozy, bright, local) rather than just describing 'coffee'.",
      "Make sure the matching .com (or a clean .cafe/.co) is available before you print signage.",
    ],
    faqs: [
      {
        q: "How do I come up with a coffee shop name?",
        a: "Start from the feeling you want customers to have, list evocative words, then pair them with your neighborhood, a roast term, or a short brandable suffix. Generate a batch, shortlist the ones with an available domain, and say each out loud before deciding.",
      },
      {
        q: "Should a coffee shop name include the word 'coffee'?",
        a: "Not necessarily. Including it helps clarity and local SEO, but many memorable cafés use evocative or invented names and let the storefront communicate the rest.",
      },
    ],
    related: ["bakery", "restaurant", "food-truck"],
  },
  {
    slug: "bakery",
    name: "Bakery",
    seedIdea: "an artisan bakery selling fresh bread and pastries",
    blurb:
      "Sweet, brandable name ideas for a bakery, patisserie, or bread shop.",
    intro:
      "Bakery names should feel handmade and inviting — a little nostalgic, never corporate. Here are name ideas with available domains, plus a generator to spin up more in your style.",
    tips: [
      "Lean into craft and warmth — words like 'rise', 'crumb', 'hearth', or 'flour' brand beautifully.",
      "Avoid hard-to-spell words; people will search for you after one visit.",
      "Check social handle availability alongside the domain so your brand is consistent.",
    ],
    faqs: [
      {
        q: "What makes a good bakery name?",
        a: "The best bakery names are short, evocative, and easy to spell, hinting at craft and warmth. Pair a baking term with your name or town, keep it pronounceable, and confirm the domain is free.",
      },
      {
        q: "Can I use a French word for my bakery?",
        a: "Yes — French or Italian roots can add a premium, artisan feel, but make sure it's still easy for local customers to pronounce and remember.",
      },
    ],
    related: ["coffee-shop", "restaurant", "clothing-brand"],
  },
  {
    slug: "fitness-gym",
    name: "Gym & Fitness",
    seedIdea: "a modern fitness gym and personal training studio",
    blurb:
      "Strong, motivating name ideas for a gym, fitness studio, or training brand.",
    intro:
      "Fitness brands win on energy and confidence. These name ideas sound strong and modern, and each can be checked for an available domain instantly.",
    tips: [
      "Convey energy and progress — momentum words ('forge', 'peak', 'rise', 'pulse') work well.",
      "Keep it short enough to fit on a logo, app icon, and merch.",
      "Decide if you're local (use your city) or scaling (stay brandable and broad).",
    ],
    faqs: [
      {
        q: "How do I name a gym or fitness studio?",
        a: "Pick the feeling you want members to associate with you — strength, community, or transformation — then build a short, punchy brandable name around it and lock in the domain and handles.",
      },
      {
        q: "Should my gym name include my city?",
        a: "If you're a single local location, adding your city helps discoverability. If you plan to franchise or go online, a broader brandable name travels better.",
      },
    ],
    related: ["salon-spa", "consulting", "saas-startup"],
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    seedIdea: "a farm-to-table restaurant and modern eatery",
    blurb:
      "Memorable name ideas for a restaurant, eatery, or dining concept.",
    intro:
      "A restaurant's name sets the tone before the first bite. These ideas range from warm and rustic to sharp and modern — all checkable for an available domain.",
    tips: [
      "Match the name to the cuisine and atmosphere you're creating.",
      "Make it easy to find on a map and tag on social — avoid clever misspellings.",
      "Secure the domain and reservations-friendly handle early, before reviews start rolling in.",
    ],
    faqs: [
      {
        q: "How do I choose a restaurant name?",
        a: "Anchor it to your concept and atmosphere, keep it easy to say and spell, and check that the domain and social handles are available so guests can find and tag you.",
      },
      {
        q: "Do restaurants need a .com domain?",
        a: "A .com still reads as the most trustworthy for menus and reservations, but a clean .restaurant, .co, or local extension can work if your exact .com is taken.",
      },
    ],
    related: ["coffee-shop", "bakery", "food-truck"],
  },
  {
    slug: "photography",
    name: "Photography",
    seedIdea: "a wedding and portrait photography business",
    blurb:
      "Elegant name ideas for a photography studio or freelance photographer.",
    intro:
      "Photography brands balance the personal and the professional. Whether you use your name or a studio name, here are ideas with available domains to build your portfolio on.",
    tips: [
      "Decide between a personal name (great for trust) and a studio name (great for scaling a team).",
      "Evoke light, moments, or your style rather than just 'photo'.",
      "Keep it short for a clean portfolio URL and watermark.",
    ],
    faqs: [
      {
        q: "Should I use my own name for my photography business?",
        a: "Using your name builds personal trust and is ideal for solo photographers. A studio name is better if you'll hire associates or want to sell the business later.",
      },
      {
        q: "What domain is best for a photographer?",
        a: "A short .com is ideal for portfolios, but .photography, .studio, or .co are strong, on-theme alternatives when your .com is unavailable.",
      },
    ],
    related: ["real-estate", "clothing-brand", "marketing-agency"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    seedIdea: "a real estate agency helping people buy and sell homes",
    blurb:
      "Trustworthy name ideas for a real estate agency, team, or brokerage.",
    intro:
      "Real estate names need to signal trust, locality, and stability. These ideas sound credible and professional, and each is checkable for an available domain.",
    tips: [
      "Convey trust and place — 'home', 'key', 'haven', or your region read well.",
      "Avoid trendy spellings; clients are making a major financial decision.",
      "Grab the domain and a Google-friendly handle for local search visibility.",
    ],
    faqs: [
      {
        q: "What should a real estate company name convey?",
        a: "Trust, professionalism, and a sense of place. Combine a stability or home-related word with your name or region, and keep it easy to say in a referral.",
      },
      {
        q: "Is .realestate or .com better?",
        a: "A .com remains the default clients type, but .realestate, .homes, or .co can differentiate you and are useful when the .com is gone.",
      },
    ],
    related: ["consulting", "marketing-agency", "landscaping"],
  },
  {
    slug: "clothing-brand",
    name: "Clothing Brand",
    seedIdea: "a sustainable streetwear clothing brand",
    blurb:
      "Stylish, brandable name ideas for a clothing line or fashion label.",
    intro:
      "A clothing brand lives and dies by its name's vibe. These ideas are coined and brandable — the kind of label that looks good on a tag — and each can be checked for an available domain.",
    tips: [
      "Brandable and coined names give you the most room to build a distinct identity.",
      "Check trademark conflicts in apparel classes before committing.",
      "Lock the domain and Instagram/TikTok handle together — consistency is everything in fashion.",
    ],
    faqs: [
      {
        q: "How do I name a clothing brand?",
        a: "Aim for a short, coined, brandable word that feels like your aesthetic. Generate a batch, shortlist names with a free domain and matching social handles, and check apparel trademarks.",
      },
      {
        q: "Should a fashion brand use .com?",
        a: "A .com is best for credibility and ecommerce, but fashion labels increasingly use .co, .shop, or .store when the .com isn't available.",
      },
    ],
    related: ["bakery", "photography", "marketing-agency"],
  },
  {
    slug: "saas-startup",
    name: "SaaS Startup",
    seedIdea: "a B2B SaaS platform for automating team workflows",
    blurb:
      "Modern, brandable name ideas for a SaaS startup or software product.",
    intro:
      "SaaS names need to be brandable, ownable, and easy to type. These startup-style ideas are built to become a product and a brand — each checkable for an available domain.",
    tips: [
      "Favor short, coined names you can own and trademark over descriptive keyword strings.",
      "Make sure it's easy to spell when said aloud on a sales call.",
      "A clean .com matters for B2B credibility; .ai, .io, and .dev are strong alternatives.",
    ],
    faqs: [
      {
        q: "What makes a good SaaS company name?",
        a: "Short, brandable, easy to spell, and ownable. Avoid generic keyword names that are hard to trademark, and prioritize a name with an available .com (or a credible .ai/.io).",
      },
      {
        q: "Is a .io or .ai domain okay for a startup?",
        a: "Yes — .io and .ai are widely accepted in tech and signal you're a modern software company, especially when a great .com is unavailable or expensive.",
      },
    ],
    related: ["marketing-agency", "consulting", "fitness-gym"],
  },
  {
    slug: "marketing-agency",
    name: "Marketing Agency",
    seedIdea: "a digital marketing and branding agency",
    blurb:
      "Creative, credible name ideas for a marketing or branding agency.",
    intro:
      "An agency's name is its first portfolio piece — it should feel creative but credible. Here are brandable ideas with available domains to launch your studio.",
    tips: [
      "Show a little creativity — your name is proof you can name things.",
      "Keep it credible enough for enterprise clients to recommend internally.",
      "Secure a clean domain and email-friendly name for outreach.",
    ],
    faqs: [
      {
        q: "How do I name a marketing agency?",
        a: "Balance creativity with credibility. A short, brandable name signals capability; pair it with an available .com or .co and a professional email domain.",
      },
      {
        q: "Should an agency name describe what it does?",
        a: "A little clarity helps SEO, but the strongest agencies use brandable names and let their case studies do the explaining.",
      },
    ],
    related: ["consulting", "saas-startup", "clothing-brand"],
  },
  {
    slug: "salon-spa",
    name: "Salon & Spa",
    seedIdea: "a hair salon and day spa offering beauty treatments",
    blurb:
      "Calming, elegant name ideas for a salon, spa, or beauty studio.",
    intro:
      "Salon and spa names should feel calming, polished, and a little indulgent. These ideas evoke relaxation and beauty, and each can be checked for an available domain.",
    tips: [
      "Evoke calm, glow, or renewal — soft, elegant words brand well.",
      "Keep it easy to say when clients book by phone.",
      "Match the domain and booking-friendly handle for online appointments.",
    ],
    faqs: [
      {
        q: "What's a good name for a salon or spa?",
        a: "Choose a calming, elegant word that hints at beauty or renewal, keep it easy to pronounce for phone bookings, and secure the matching domain and social handle.",
      },
      {
        q: "Do I need a website for a salon?",
        a: "Yes — even a simple site with services, prices, and online booking builds trust and improves local search, so grabbing the domain early is worth it.",
      },
    ],
    related: ["fitness-gym", "photography", "cleaning-service"],
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    seedIdea: "a landscaping and lawn care service company",
    blurb:
      "Sturdy, local name ideas for a landscaping or lawn care business.",
    intro:
      "Landscaping brands do well with names that feel reliable, local, and rooted in the outdoors. Here are ideas with available domains for your service business.",
    tips: [
      "Nature words ('green', 'oak', 'meadow', 'terra') signal what you do instantly.",
      "Add your region for local SEO and word-of-mouth referrals.",
      "Keep it easy to read on a truck wrap and yard sign.",
    ],
    faqs: [
      {
        q: "How should I name my landscaping business?",
        a: "Combine a nature or growth word with your name or service area. Keep it readable from a distance (truck, sign) and confirm the domain and local listing are available.",
      },
      {
        q: "Does a landscaping business need a website?",
        a: "Yes — most customers search online before hiring, so a simple site plus a Google Business Profile (and a matching domain) wins local jobs.",
      },
    ],
    related: ["cleaning-service", "real-estate", "consulting"],
  },
  {
    slug: "podcast",
    name: "Podcast",
    seedIdea: "a podcast about technology and culture",
    blurb:
      "Catchy, brandable name ideas for a podcast or audio show.",
    intro:
      "A podcast name has to be searchable, sayable, and stick in a feed of thousands. These ideas are catchy and brandable, and each is checkable for an available domain.",
    tips: [
      "Make it easy to search and spell — listeners type it into apps from memory.",
      "Hint at your topic or tone without boxing yourself in for future episodes.",
      "Grab the domain and handle so listeners can find your show and links in one place.",
    ],
    faqs: [
      {
        q: "How do I name a podcast?",
        a: "Pick something short, searchable, and easy to spell that hints at your theme. Check that the name isn't taken by another show, and secure a matching domain and social handle.",
      },
      {
        q: "Does a podcast need a domain?",
        a: "A domain gives your show a home for episodes, links, and email signups, and makes you look established — well worth registering before you launch.",
      },
    ],
    related: ["marketing-agency", "saas-startup", "clothing-brand"],
  },
  {
    slug: "food-truck",
    name: "Food Truck",
    seedIdea: "a gourmet food truck serving street food",
    blurb:
      "Fun, bold name ideas for a food truck or street food business.",
    intro:
      "Food truck names should be fun, bold, and readable from across a parking lot. These playful ideas come with available domains so you can build a following online too.",
    tips: [
      "Be playful and bold — food trucks reward personality and a great pun.",
      "Keep it large-and-legible for the truck and easy to tag on social.",
      "Lock the domain and handle so fans can track where you'll park next.",
    ],
    faqs: [
      {
        q: "What's a good food truck name?",
        a: "Something fun, bold, and easy to read at a glance, ideally hinting at your food. Confirm the domain and social handle are free so customers can follow your location.",
      },
      {
        q: "Why does a food truck need a website?",
        a: "A simple site or page lets fans find your schedule, menu, and booking info — and a matching domain makes your truck look legit and easy to remember.",
      },
    ],
    related: ["coffee-shop", "restaurant", "bakery"],
  },
];

const NICHE_MAP = new Map(NICHES.map((n) => [n.slug, n]));

export function getNiche(slug: string): Niche | undefined {
  return NICHE_MAP.get(slug);
}
