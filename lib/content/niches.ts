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
  {
    slug: "consulting",
    name: "Consulting",
    seedIdea: "a management and strategy consulting firm",
    blurb:
      "Credible, professional name ideas for a consulting firm or advisory practice.",
    intro:
      "Consulting names need to signal expertise and trust on the first impression. These ideas sound credible and established, and each can be checked for an available domain in seconds.",
    tips: [
      "Convey authority and clarity — clients are buying confidence.",
      "Keep it easy to say on a call and spell in an email.",
      "A clean .com (or .co) reinforces credibility with enterprise clients.",
    ],
    faqs: [
      {
        q: "How do I name a consulting firm?",
        a: "Lead with credibility: pair a strong, professional word (or your surname) with a clear descriptor, keep it easy to pronounce, and secure a matching .com and professional email domain.",
      },
      {
        q: "Should I use my own name for a consultancy?",
        a: "Your name builds personal trust and works well for solo or boutique practices; a brandable name scales better if you plan to grow a team or sell the firm.",
      },
    ],
    related: ["marketing-agency", "accounting", "saas-startup"],
  },
  {
    slug: "cleaning-service",
    name: "Cleaning Service",
    seedIdea: "a residential and commercial cleaning service",
    blurb:
      "Fresh, trustworthy name ideas for a cleaning or janitorial business.",
    intro:
      "Cleaning brands win on trust and a sense of sparkle. These name ideas feel fresh and dependable, and each is checkable for an available domain.",
    tips: [
      "Evoke clean, fresh, and bright — sparkle words brand instantly.",
      "Add your city for local search and word-of-mouth referrals.",
      "Keep it readable on a van wrap and easy to say on the phone.",
    ],
    faqs: [
      {
        q: "How do I name a cleaning business?",
        a: "Combine a fresh or sparkle word with your name or area, keep it easy to read on a vehicle and say over the phone, and grab the domain plus a Google Business Profile.",
      },
      {
        q: "Does a cleaning business need a website?",
        a: "Yes — most clients search and compare online, so a simple site with services and booking, plus a matching domain, helps you win local jobs.",
      },
    ],
    related: ["landscaping", "consulting", "real-estate"],
  },
  {
    slug: "law-firm",
    name: "Law Firm",
    seedIdea: "a law firm offering legal services to businesses",
    blurb: "Authoritative name ideas for a law firm or legal practice.",
    intro:
      "Law firm names should read as established, trustworthy, and precise. These ideas sound credible and professional, and each can be checked for an available domain.",
    tips: [
      "Convey trust and authority — heritage and stability words work well.",
      "Keep it easy to cite and spell for referrals and filings.",
      "A .com or .law domain reinforces credibility with clients.",
    ],
    faqs: [
      {
        q: "How are law firms typically named?",
        a: "Traditionally by partner surnames, but modern firms increasingly use a short, credible brandable name. Either way, prioritize trust, easy spelling, and an available .com or .law.",
      },
      {
        q: "Is a .law domain worth it?",
        a: ".law signals your practice clearly and can be a strong choice when your .com is taken, though many clients still expect and trust a .com.",
      },
    ],
    related: ["consulting", "accounting", "real-estate"],
  },
  {
    slug: "dental-clinic",
    name: "Dental Clinic",
    seedIdea: "a modern dental clinic and family dentistry practice",
    blurb:
      "Friendly, clean name ideas for a dental clinic or dentistry practice.",
    intro:
      "Dental brands balance clinical trust with a warm, friendly feel. These name ideas sound clean and approachable, and each is checkable for an available domain.",
    tips: [
      "Evoke bright, healthy smiles without being clinical or cold.",
      "Add your city for local search; patients choose nearby.",
      "Keep it easy to say when patients refer friends and family.",
    ],
    faqs: [
      {
        q: "How should I name a dental practice?",
        a: "Aim for warm and trustworthy with a hint of bright, healthy smiles. Add your location for local SEO, keep it easy to say, and secure the domain and Google Business Profile.",
      },
      {
        q: "Should a dental clinic name include the dentist's name?",
        a: "A dentist's name adds personal trust and is common, while a brandable practice name scales better across multiple dentists or locations.",
      },
    ],
    related: ["salon-spa", "consulting", "cleaning-service"],
  },
  {
    slug: "yoga-studio",
    name: "Yoga Studio",
    seedIdea: "a yoga and wellness studio offering classes",
    blurb: "Calming, grounded name ideas for a yoga or wellness studio.",
    intro:
      "Yoga studio names should feel calm, grounded, and welcoming. These ideas evoke balance and breath, and each can be checked for an available domain.",
    tips: [
      "Evoke calm, breath, and balance — soft, grounded words resonate.",
      "Keep it easy to say in a class and remember on a schedule.",
      "Match the domain and handle so students can book and follow along.",
    ],
    faqs: [
      {
        q: "How do I name a yoga studio?",
        a: "Choose a calming, grounded word that hints at balance or breath, keep it easy to pronounce, and secure a matching domain and social handle for class schedules and bookings.",
      },
      {
        q: "Does a yoga studio need a website?",
        a: "Yes — a simple site with schedules, pricing, and online booking builds trust and improves local search, so the domain is worth grabbing early.",
      },
    ],
    related: ["salon-spa", "fitness-gym", "skincare-brand"],
  },
  {
    slug: "brewery",
    name: "Brewery",
    seedIdea: "a craft brewery and taproom",
    blurb: "Bold, characterful name ideas for a craft brewery or taproom.",
    intro:
      "Brewery names should have character and a story you can put on a can. These ideas are bold and brandable, and each is checkable for an available domain.",
    tips: [
      "Lean into character and place — local landmarks and bold words work.",
      "Make sure it looks good on a can and a tap handle.",
      "Check trademark conflicts in beverages before printing labels.",
    ],
    faqs: [
      {
        q: "How do I name a brewery?",
        a: "Tell a small story — pair a bold or local word with a brewing term, make sure it reads well on a can, and confirm the domain and beverage trademarks are clear.",
      },
      {
        q: "Should a brewery name include 'brewing'?",
        a: "It adds clarity and works on labels, but many beloved breweries use a bold brandable name and let 'Brewing Co.' sit underneath.",
      },
    ],
    related: ["restaurant", "food-truck", "coffee-shop"],
  },
  {
    slug: "nonprofit",
    name: "Nonprofit",
    seedIdea: "a nonprofit organization supporting local communities",
    blurb: "Hopeful, mission-driven name ideas for a nonprofit or charity.",
    intro:
      "Nonprofit names should feel hopeful, human, and clear about the good you do. These ideas are warm and credible, and each can be checked for an available domain.",
    tips: [
      "Lead with mission and hope — clarity earns donor trust.",
      "Keep it easy to say and remember for fundraising and word of mouth.",
      "A .org domain signals nonprofit credibility to donors.",
    ],
    faqs: [
      {
        q: "How do I name a nonprofit?",
        a: "Center your mission and the people you help, keep it warm and easy to remember, and secure a credible .org domain so donors trust you at a glance.",
      },
      {
        q: "Should a nonprofit use a .org domain?",
        a: "Yes — .org is strongly associated with nonprofits and charities and builds instant trust with donors, grant-makers, and volunteers.",
      },
    ],
    related: ["consulting", "marketing-agency", "event-planning"],
  },
  {
    slug: "interior-design",
    name: "Interior Design",
    seedIdea: "an interior design and home styling studio",
    blurb: "Elegant, refined name ideas for an interior design studio.",
    intro:
      "Interior design names should feel refined, tasteful, and a little aspirational. These ideas evoke style and space, and each is checkable for an available domain.",
    tips: [
      "Evoke taste and space — refined, design-forward words work well.",
      "Keep it elegant but easy to say to clients and contractors.",
      "A clean domain and portfolio-friendly handle showcase your work.",
    ],
    faqs: [
      {
        q: "How do I name an interior design business?",
        a: "Aim for refined and tasteful — a design or space word paired with your name reads well. Keep it easy to say, and secure a clean domain for your portfolio.",
      },
      {
        q: "Should I use my name for an interior design studio?",
        a: "Your name builds a personal, premium brand and is common in design; a studio name scales better if you grow a team.",
      },
    ],
    related: ["real-estate", "photography", "clothing-brand"],
  },
  {
    slug: "pet-grooming",
    name: "Pet Grooming",
    seedIdea: "a pet grooming and dog spa business",
    blurb:
      "Playful, caring name ideas for a pet grooming or dog spa business.",
    intro:
      "Pet grooming names should feel fun, caring, and a little pampering. These ideas are playful and brandable, and each can be checked for an available domain.",
    tips: [
      "Be playful and warm — pet owners love personality.",
      "Keep it easy to say when clients book and refer.",
      "Match the domain and handle so before/after photos build your brand.",
    ],
    faqs: [
      {
        q: "How do I name a pet grooming business?",
        a: "Lean into playful and caring with a hint of pampering, keep it easy to say for bookings, and secure a matching domain and social handle for your grooming photos.",
      },
      {
        q: "Does a pet grooming business need a website?",
        a: "Yes — clients search locally and love before/after galleries, so a simple site plus a matching domain and Google profile wins appointments.",
      },
    ],
    related: ["salon-spa", "cleaning-service", "landscaping"],
  },
  {
    slug: "travel-agency",
    name: "Travel Agency",
    seedIdea: "a travel agency planning trips and getaways",
    blurb: "Wanderlust-filled name ideas for a travel agency or tour company.",
    intro:
      "Travel brands should spark wanderlust and feel effortless. These name ideas evoke journeys and discovery, and each is checkable for an available domain.",
    tips: [
      "Evoke journeys, horizons, and discovery — wanderlust sells.",
      "Keep it easy to say and spell for bookings and referrals.",
      "Grab the domain and handle to share itineraries and inspiration.",
    ],
    faqs: [
      {
        q: "How do I name a travel agency?",
        a: "Evoke discovery and ease — a journey or horizon word paired with a brandable suffix works well. Keep it easy to spell and secure a matching domain and handle.",
      },
      {
        q: "Does a travel agency need a website?",
        a: "Absolutely — travelers research and book online, so a polished site and a memorable domain are essential for trust and inquiries.",
      },
    ],
    related: ["event-planning", "photography", "marketing-agency"],
  },
  {
    slug: "event-planning",
    name: "Event Planning",
    seedIdea: "an event planning and wedding coordination company",
    blurb: "Polished, celebratory name ideas for an event planning business.",
    intro:
      "Event planning names should feel polished, celebratory, and dependable. These ideas evoke memorable moments, and each can be checked for an available domain.",
    tips: [
      "Evoke celebration and seamless moments — elegance reassures clients.",
      "Keep it easy to say and tag for referrals and social proof.",
      "Match the domain and handle so galleries showcase your events.",
    ],
    faqs: [
      {
        q: "How do I name an event planning business?",
        a: "Aim for polished and celebratory — a moments or occasion word paired with your name reads well. Keep it easy to say and secure a matching domain and handle.",
      },
      {
        q: "Should an event planner use their own name?",
        a: "Your name adds a personal, boutique feel that clients love; a brandable name scales better if you grow a team or franchise.",
      },
    ],
    related: ["travel-agency", "photography", "marketing-agency"],
  },
  {
    slug: "jewelry-brand",
    name: "Jewelry Brand",
    seedIdea: "a handmade fine jewelry and accessories brand",
    blurb: "Refined, sparkling name ideas for a jewelry or accessories brand.",
    intro:
      "Jewelry names should feel refined, timeless, and a touch luxurious. These ideas are elegant and brandable, and each is checkable for an available domain.",
    tips: [
      "Evoke shine, craft, and timelessness — premium words elevate.",
      "Keep it elegant but easy to spell on a tag and search bar.",
      "Lock the domain and social handle to showcase pieces consistently.",
    ],
    faqs: [
      {
        q: "How do I name a jewelry brand?",
        a: "Aim for refined and timeless — a gem, light, or craft word makes a premium impression. Keep it easy to spell and secure a matching domain and handle.",
      },
      {
        q: "Should a jewelry brand use .com?",
        a: "A .com reads premium and trustworthy for ecommerce, but .co, .shop, or .jewelry can work when your exact .com is taken.",
      },
    ],
    related: ["clothing-brand", "skincare-brand", "candle-business"],
  },
  {
    slug: "candle-business",
    name: "Candle Business",
    seedIdea: "a handmade soy candle and home fragrance brand",
    blurb: "Warm, cozy name ideas for a candle or home fragrance brand.",
    intro:
      "Candle brands should feel warm, cozy, and a little luxurious. These ideas evoke glow and scent, and each can be checked for an available domain.",
    tips: [
      "Evoke warmth, glow, and scent — cozy words brand beautifully.",
      "Keep it easy to spell on a label and search bar.",
      "Match the domain and handle for product photos and launches.",
    ],
    faqs: [
      {
        q: "How do I name a candle business?",
        a: "Lean into warmth and glow with a hint of scent or season, keep it easy to spell on a label, and secure a matching domain and social handle for launches.",
      },
      {
        q: "Should a candle brand use .com?",
        a: "A .com reads trustworthy for ecommerce, but .co, .shop, or .store are solid alternatives when the .com is unavailable.",
      },
    ],
    related: ["skincare-brand", "jewelry-brand", "clothing-brand"],
  },
  {
    slug: "florist",
    name: "Florist",
    seedIdea: "a florist and flower shop offering arrangements",
    blurb: "Fresh, blooming name ideas for a florist or flower shop.",
    intro:
      "Florist names should feel fresh, romantic, and full of bloom. These ideas evoke petals and gardens, and each is checkable for an available domain.",
    tips: [
      "Evoke blossoms, petals, and gardens — soft, fresh words shine.",
      "Keep it easy to say for phone orders and referrals.",
      "Match the domain and handle to show off arrangements online.",
    ],
    faqs: [
      {
        q: "How do I name a florist or flower shop?",
        a: "Lean into bloom and freshness — a petal, garden, or flower word brands well. Keep it easy to say for orders and secure a matching domain and handle.",
      },
      {
        q: "Does a florist need a website?",
        a: "Yes — customers order online and for events, so a simple shop with photos and a matching domain helps you capture orders and stand out locally.",
      },
    ],
    related: ["event-planning", "landscaping", "salon-spa"],
  },
  {
    slug: "barber-shop",
    name: "Barber Shop",
    seedIdea: "a classic barbershop offering cuts and shaves",
    blurb:
      "Sharp, classic name ideas for a barbershop or men's grooming brand.",
    intro:
      "Barbershop names should feel sharp, classic, and a little timeless. These ideas evoke craft and confidence, and each can be checked for an available domain.",
    tips: [
      "Evoke craft and classic confidence — sharp, vintage words work.",
      "Keep it easy to say for walk-ins and referrals.",
      "Match the domain and handle so cut photos build your following.",
    ],
    faqs: [
      {
        q: "How do I name a barbershop?",
        a: "Lean into classic and sharp — a craft, blade, or vintage word brands well. Keep it easy to say for walk-ins and secure a matching domain and social handle.",
      },
      {
        q: "Does a barbershop need a website?",
        a: "Yes — clients book and discover online, so a simple site with services and booking, plus a matching domain and Google profile, fills your chairs.",
      },
    ],
    related: ["salon-spa", "tattoo-studio", "fitness-gym"],
  },
  {
    slug: "tattoo-studio",
    name: "Tattoo Studio",
    seedIdea: "a custom tattoo studio and art collective",
    blurb: "Edgy, artistic name ideas for a tattoo studio or artist.",
    intro:
      "Tattoo studio names should feel artistic, bold, and unmistakably yours. These ideas are edgy and brandable, and each is checkable for an available domain.",
    tips: [
      "Evoke ink, art, and edge — bold, distinctive words stand out.",
      "Keep it easy to find and tag for portfolio discovery.",
      "Match the domain and handle so your portfolio lives in one place.",
    ],
    faqs: [
      {
        q: "How do I name a tattoo studio?",
        a: "Lean into art and edge — an ink, needle, or bold word brands well. Keep it easy to find and tag, and secure a matching domain and handle for your portfolio.",
      },
      {
        q: "Does a tattoo studio need a website?",
        a: "Yes — clients judge artists by portfolios, so a clean site or gallery plus a matching domain and social handle drive bookings.",
      },
    ],
    related: ["barber-shop", "clothing-brand", "photography"],
  },
  {
    slug: "skincare-brand",
    name: "Skincare Brand",
    seedIdea: "a clean skincare and beauty products brand",
    blurb: "Clean, glowing name ideas for a skincare or beauty brand.",
    intro:
      "Skincare names should feel clean, radiant, and trustworthy. These ideas evoke glow and care, and each can be checked for an available domain.",
    tips: [
      "Evoke glow, purity, and care — clean, soft words sell.",
      "Keep it easy to spell on packaging and search bars.",
      "Match the domain and handle for product launches and reviews.",
    ],
    faqs: [
      {
        q: "How do I name a skincare brand?",
        a: "Aim for clean and radiant — a glow, dew, or botanical word makes a premium impression. Keep it easy to spell and secure a matching domain and social handle.",
      },
      {
        q: "Should a skincare brand use .com?",
        a: "A .com reads trustworthy for beauty ecommerce, but .co, .shop, or .beauty are solid when your exact .com is taken.",
      },
    ],
    related: ["salon-spa", "candle-business", "clothing-brand"],
  },
  {
    slug: "ecommerce-store",
    name: "Ecommerce Store",
    seedIdea: "an online store selling curated products",
    blurb: "Catchy, brandable name ideas for an ecommerce or online store.",
    intro:
      "Ecommerce names should be catchy, trustworthy, and easy to type. These ideas are brandable and built to scale, and each is checkable for an available domain.",
    tips: [
      "Favor short, brandable names you can own across products.",
      "Make it easy to type and spell — customers come back by memory.",
      "A clean .com (or .shop/.store) builds buyer trust.",
    ],
    faqs: [
      {
        q: "How do I name an online store?",
        a: "Pick a short, brandable, easy-to-type name that isn't tied to one product so you can expand. Prioritize an available .com, .shop, or .store and matching handles.",
      },
      {
        q: "Is .shop or .store good for ecommerce?",
        a: "Yes — .shop and .store clearly signal commerce and are great alternatives when your .com is unavailable, though .com still reads most trustworthy.",
      },
    ],
    related: ["clothing-brand", "jewelry-brand", "skincare-brand"],
  },
  {
    slug: "accounting",
    name: "Accounting Firm",
    seedIdea: "an accounting and bookkeeping firm for small businesses",
    blurb:
      "Precise, trustworthy name ideas for an accounting or bookkeeping firm.",
    intro:
      "Accounting names should feel precise, dependable, and credible. These ideas sound trustworthy and professional, and each can be checked for an available domain.",
    tips: [
      "Convey precision and trust — clients hand you their finances.",
      "Keep it easy to say and spell for referrals and invoices.",
      "A clean .com or .co reinforces credibility with clients.",
    ],
    faqs: [
      {
        q: "How do I name an accounting firm?",
        a: "Lead with precision and trust — a ledger, balance, or stability word paired with your name reads well. Keep it easy to spell and secure a matching .com or .co.",
      },
      {
        q: "Should I use my name for an accounting practice?",
        a: "Your name builds trust for solo or boutique firms; a brandable name scales better if you grow a team or add partners.",
      },
    ],
    related: ["consulting", "law-firm", "saas-startup"],
  },
  {
    slug: "construction",
    name: "Construction Company",
    seedIdea: "a residential and commercial construction company",
    blurb:
      "Solid, dependable name ideas for a construction or contracting company.",
    intro:
      "Construction names should feel solid, capable, and built to last. These ideas sound dependable and strong, and each is checkable for an available domain.",
    tips: [
      "Convey strength and reliability — sturdy, foundational words work.",
      "Add your region for local bids and word-of-mouth.",
      "Keep it easy to read on a sign, hard hat, and truck.",
    ],
    faqs: [
      {
        q: "How do I name a construction company?",
        a: "Lean into strength and reliability — a foundation, stone, or build word paired with your name or region reads well. Keep it readable on signage and grab the domain.",
      },
      {
        q: "Does a construction company need a website?",
        a: "Yes — clients vet contractors online, so a simple site with projects and contact info, plus a matching domain, wins trust and bids.",
      },
    ],
    related: ["landscaping", "real-estate", "cleaning-service"],
  },
  {
    slug: "youtube-channel",
    name: "YouTube Channel",
    seedIdea: "a youtube channel creating lifestyle and how-to videos",
    blurb:
      "Catchy, brandable name ideas for a YouTube channel or video creator.",
    intro:
      "A channel name has to be searchable, memorable, and easy to shout out in a video. These ideas are catchy and brandable, and each can be checked for an available domain.",
    tips: [
      "Make it easy to search, spell, and say in an intro.",
      "Hint at your niche without boxing in future content.",
      "Grab the domain and handle so fans find links and merch in one place.",
    ],
    faqs: [
      {
        q: "How do I name a YouTube channel?",
        a: "Pick a short, searchable, easy-to-say name that hints at your niche but leaves room to grow. Check it isn't taken on YouTube and secure a matching domain and handles.",
      },
      {
        q: "Does a YouTube channel need a domain?",
        a: "A domain gives your channel a home for links, merch, and email signups, and makes sponsors take you more seriously — worth registering early.",
      },
    ],
    related: ["podcast", "gaming-esports", "marketing-agency"],
  },
  {
    slug: "gaming-esports",
    name: "Gaming & Esports",
    seedIdea: "a gaming and esports team or content brand",
    blurb: "Bold, energetic name ideas for a gaming or esports brand.",
    intro:
      "Gaming brands win on energy, edge, and identity. These name ideas are bold and brandable, built for streams and jerseys, and each is checkable for an available domain.",
    tips: [
      "Go bold and energetic — sharp, punchy words own the screen.",
      "Keep it short for tags, jerseys, and stream overlays.",
      "Match the domain and handle across platforms for a consistent identity.",
    ],
    faqs: [
      {
        q: "How do I name a gaming team or channel?",
        a: "Lean into bold and punchy — a short, high-energy brandable word works best. Keep it taggable across platforms and secure a matching domain and handles.",
      },
      {
        q: "Does a gaming brand need a website?",
        a: "Yes — a site for your roster, schedule, merch, and sponsors makes you look pro, so grabbing a matching domain early pays off.",
      },
    ],
    related: ["youtube-channel", "podcast", "clothing-brand"],
  },
  {
    slug: "tutoring",
    name: "Tutoring Service",
    seedIdea: "a tutoring service for students and test prep",
    blurb: "Smart, encouraging name ideas for a tutoring or education business.",
    intro:
      "Tutoring names should feel smart, encouraging, and trustworthy to parents. These ideas evoke growth and clarity, and each can be checked for an available domain.",
    tips: [
      "Evoke growth, brightness, and clarity — encouraging words win parents.",
      "Keep it easy to say and spell for referrals.",
      "Match the domain and handle for scheduling and resources.",
    ],
    faqs: [
      {
        q: "How do I name a tutoring business?",
        a: "Aim for encouraging and bright — a growth, learning, or clarity word reads well to parents. Keep it easy to say and secure a matching domain and handle.",
      },
      {
        q: "Does a tutoring service need a website?",
        a: "Yes — parents research and book online, so a simple site with subjects, pricing, and booking plus a matching domain builds trust and inquiries.",
      },
    ],
    related: ["consulting", "saas-startup", "daycare"],
  },
  {
    slug: "daycare",
    name: "Daycare & Preschool",
    seedIdea: "a daycare and early learning preschool",
    blurb:
      "Warm, playful name ideas for a daycare, preschool, or childcare center.",
    intro:
      "Childcare names should feel warm, safe, and playful to parents. These ideas evoke care and growth, and each is checkable for an available domain.",
    tips: [
      "Evoke warmth, safety, and play — gentle words reassure parents.",
      "Keep it easy to say and remember for referrals.",
      "Match the domain and handle for enrollment and updates.",
    ],
    faqs: [
      {
        q: "How do I name a daycare or preschool?",
        a: "Lean into warm and playful with a sense of safety and growth, keep it easy to say, and secure a matching domain and social handle for enrollment and updates.",
      },
      {
        q: "Does a daycare need a website?",
        a: "Yes — parents research childcare carefully online, so a simple, reassuring site with programs and enrollment plus a matching domain builds trust.",
      },
    ],
    related: ["tutoring", "cleaning-service", "salon-spa"],
  },
];

const NICHE_MAP = new Map(NICHES.map((n) => [n.slug, n]));

export function getNiche(slug: string): Niche | undefined {
  return NICHE_MAP.get(slug);
}
