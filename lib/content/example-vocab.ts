import type { GeneratedName } from "@/schemas/domain";
import { buildExampleNames } from "@/lib/content/example-names";

/**
 * Hand-curated brandable vocabulary per niche and per extension. These pools
 * are what make the landing-page examples varied and genuinely registerable
 * instead of two-word permutations.
 */

type NicheVocab = {
  roots: string[];
  modifiers?: string[];
  extraSuffixes?: string[];
  themedTlds?: string[];
};

const NICHE_VOCAB: Record<string, NicheVocab> = {
  "coffee-shop": {
    roots: ["Bean", "Brew", "Roast", "Grind", "Crema", "Steam", "Pour", "Mug", "Drip", "Ember", "Hearth", "Kettle", "Aroma", "Perk", "Cortado", "Press", "Bloom", "Barista"],
    modifiers: ["Urban", "Daily", "Golden", "Wild", "Little", "Corner", "Morning", "Slow"],
    extraSuffixes: ["Roasters", "Bar", "House", "Brew"],
    themedTlds: ["coffee", "cafe", "co"],
  },
  bakery: {
    roots: ["Crumb", "Rise", "Flour", "Hearth", "Loaf", "Knead", "Dough", "Butter", "Honey", "Oven", "Yeast", "Crust", "Proof", "Bloom", "Sugar"],
    modifiers: ["Golden", "Little", "Daily", "Wild", "Sweet", "Stone", "Morning"],
    extraSuffixes: ["Bakehouse", "Bakery", "House", "Bar"],
    themedTlds: ["cafe", "co", "shop"],
  },
  restaurant: {
    roots: ["Table", "Hearth", "Fork", "Plate", "Harvest", "Ember", "Spoon", "Feast", "Larder", "Pantry", "Sage", "Olive", "Copper", "Salt", "Grove", "Maple"],
    modifiers: ["Wild", "Golden", "Copper", "Little", "Olive", "North", "True"],
    extraSuffixes: ["Kitchen", "House", "Table", "Eatery", "Room"],
    themedTlds: ["kitchen", "cafe", "co"],
  },
  photography: {
    roots: ["Frame", "Lens", "Aperture", "Shutter", "Focus", "Vista", "Prism", "Capture", "Halo", "Glimpse", "Still", "Bloom", "Silver", "Pixel", "Exposure"],
    modifiers: ["Golden", "Silver", "North", "True", "Bright", "Pure", "Still"],
    extraSuffixes: ["Studio", "Photo", "Films", "House"],
    themedTlds: ["photography", "studio", "co"],
  },
  "real-estate": {
    roots: ["Haven", "Key", "Nest", "Hearth", "Abode", "Anchor", "Cedar", "Maple", "Summit", "Harbor", "Dwell", "Domus", "Roost", "Keystone", "Crown"],
    modifiers: ["Prime", "North", "True", "Summit", "Cedar", "Crown"],
    extraSuffixes: ["Realty", "Homes", "Estates", "Group", "Properties"],
    themedTlds: ["homes", "realty", "co"],
  },
  "clothing-brand": {
    roots: ["Thread", "Stitch", "Loom", "Weave", "Drape", "Seam", "Cotton", "Linen", "Tailor", "Denim", "Fold", "Knit", "Wool", "Cloth"],
    modifiers: ["Wild", "North", "Pure", "True", "Urban", "Bold", "Raw", "Nordic"],
    extraSuffixes: ["Apparel", "Wear", "Threads", "Studio", "Supply"],
    themedTlds: ["co", "shop", "store"],
  },
  "fitness-gym": {
    roots: ["Forge", "Iron", "Pulse", "Peak", "Grit", "Tempo", "Surge", "Vault", "Flex", "Drive", "Pace", "Core", "Summit", "Charge", "Apex", "Anvil", "Torque", "Brawn", "Vigor", "Kinetic", "Stride", "Stoke", "Rally", "Sinew", "Brace"],
    modifiers: ["Iron", "Peak", "Prime", "Bold", "North", "True", "Pure"],
    extraSuffixes: ["Fitness", "Gym", "Club", "Athletics", "HQ"],
    themedTlds: ["fitness", "co"],
  },
  "saas-startup": {
    roots: ["Flow", "Sync", "Loop", "Scale", "Drift", "Lever", "Cobalt", "Vertex", "Quanta", "Lattice", "Pylon", "Conduit", "Cinder", "Onyx", "Helix", "Quill", "Vellum", "Cascade", "Vector", "Cipher", "Pivot", "Beacon"],
    modifiers: ["Prime", "Apex", "Nova", "Bright", "North", "Peak", "True"],
    extraSuffixes: ["Labs", "HQ", "Hub", "Stack", "Base"],
    themedTlds: ["ai", "io", "app"],
  },
  "marketing-agency": {
    roots: ["Echo", "Reach", "Buzz", "Bloom", "Lift", "Story", "Vivid", "Halo", "Drift", "Catalyst", "Tonic", "Verve", "Lumen", "Ripple", "Banner", "Plume", "Cadence", "Quill", "Vantage", "Kindle", "Beacon"],
    modifiers: ["Bright", "Bold", "Nova", "North", "Vivid", "True", "Prime"],
    extraSuffixes: ["Studio", "Agency", "Collective", "Lab", "Works"],
    themedTlds: ["agency", "co", "io"],
  },
  "salon-spa": {
    roots: ["Glow", "Bloom", "Luxe", "Serene", "Halo", "Lush", "Velvet", "Petal", "Aura", "Renew", "Gloss", "Silk", "Bliss", "Verde", "Dewy", "Lustre", "Opal", "Cocoon", "Sable", "Lotus", "Pearl", "Wisp", "Verbena", "Almond"],
    modifiers: ["Pure", "Golden", "Velvet", "Serene", "Lush", "North", "True"],
    extraSuffixes: ["Salon", "Spa", "Studio", "Beauty", "Room"],
    themedTlds: ["salon", "spa", "co"],
  },
  landscaping: {
    roots: ["Green", "Oak", "Meadow", "Terra", "Fern", "Cedar", "Grove", "Bloom", "Stone", "Leaf", "Verde", "Sprout", "Acre", "Willow", "Maple", "Field"],
    modifiers: ["Green", "North", "Cedar", "Wild", "True", "Stone"],
    extraSuffixes: ["Landscapes", "Gardens", "Grounds", "Outdoor", "Works"],
    themedTlds: ["garden", "land", "co"],
  },
  podcast: {
    roots: ["Echo", "Wave", "Signal", "Audio", "Static", "Pulse", "Banter", "Chatter", "Voice", "Reel", "Loop", "Volume", "Tonic", "Riff", "Frequency"],
    modifiers: ["Open", "Loud", "North", "True", "Nova", "Bold"],
    extraSuffixes: ["Cast", "Radio", "Show", "Media", "Audio"],
    themedTlds: ["fm", "show", "co"],
  },
  "food-truck": {
    roots: ["Roll", "Bite", "Wheel", "Smoke", "Grub", "Curb", "Flame", "Crave", "Hunger", "Sizzle", "Munch", "Wrap", "Fork", "Street", "Ember", "Stack"],
    modifiers: ["Street", "Hungry", "Wild", "Loaded", "Curb", "North"],
    extraSuffixes: ["Truck", "Kitchen", "Eats", "Grub", "Bites"],
    themedTlds: ["kitchen", "co"],
  },
};

type TldVocab = { roots: string[]; extraSuffixes?: string[]; modifiers?: string[] };

const TLD_VOCAB: Record<string, TldVocab> = {
  com: {
    roots: ["Nova", "Vibe", "Drift", "Vertex", "Halo", "Lumen", "Cinder", "Verve", "Quill", "Onyx", "Cobalt", "Cascade", "Pylon", "Lattice", "Marlin", "Harbor", "Ember", "Cedar"],
  },
  ai: {
    roots: ["Neural", "Synapse", "Cortex", "Mind", "Logic", "Vision", "Sense", "Model", "Pilot", "Sage", "Oracle", "Nexus", "Cipher", "Atlas"],
    extraSuffixes: ["Mind", "Labs", "Logic"],
  },
  io: {
    roots: ["Sync", "Loop", "Deploy", "Pipe", "Shift", "Cobalt", "Relay", "Quanta", "Pylon", "Conduit", "Helix", "Cipher", "Vellum", "Lattice", "Onyx", "Cinder"],
    extraSuffixes: ["Stack", "Labs", "HQ"],
  },
  app: {
    roots: ["Tap", "Snap", "Pocket", "Swift", "Bright", "Loop", "Flow", "Spark", "Daily", "Vibe", "Pulse", "Echo"],
  },
  dev: {
    roots: ["Ship", "Craft", "Repo", "Pipe", "Kernel", "Cinder", "Quill", "Pylon", "Helix", "Cobalt", "Onyx", "Vellum", "Lambda", "Quanta", "Lattice", "Conduit"],
    extraSuffixes: ["Stack", "Labs", "Craft"],
  },
  xyz: {
    roots: ["Nova", "Vibe", "Flux", "Echo", "Pixel", "Drift", "Zen", "Loop", "Orbit", "Comet", "Halo", "Spark"],
  },
  co: {
    roots: ["Nova", "Vibe", "Apex", "Drift", "Lumen", "Cinder", "Verve", "Onyx", "Cobalt", "Cascade", "Marlin", "Quill", "Pylon", "Harbor", "Ember", "Vantage"],
  },
  org: {
    roots: ["Care", "Hope", "Unity", "Aid", "Cause", "Impact", "Bridge", "Give", "Rally", "Beacon", "Haven", "Kindred"],
    extraSuffixes: ["Project", "Alliance", "Foundation"],
  },
  tech: {
    roots: ["Byte", "Circuit", "Quantum", "Pixel", "Logic", "Spark", "Forge", "Nexus", "Vortex", "Pulse", "Cobalt", "Relay"],
    extraSuffixes: ["Labs", "Systems", "Stack"],
  },
  net: {
    roots: ["Link", "Node", "Mesh", "Relay", "Connect", "Grid", "Wave", "Port", "Sync", "Hub", "Bridge", "Beacon"],
    extraSuffixes: ["Works", "Grid", "Hub"],
  },
  online: {
    roots: ["Shop", "Daily", "Hub", "Spot", "Zone", "World", "Place", "Base", "Desk", "Loop", "Nova", "Vibe"],
  },
  store: {
    roots: ["Shop", "Cart", "Market", "Goods", "Shelf", "Bazaar", "Outlet", "Supply", "Trove", "Vault", "Pantry", "Depot"],
    extraSuffixes: ["Goods", "Supply", "Market"],
  },
};

/** Build varied, curated example names for a niche page (mixed extensions). */
export function exampleNamesForNiche(slug: string, count = 24): GeneratedName[] {
  const vocab = NICHE_VOCAB[slug];
  if (!vocab) return [];
  return buildExampleNames({
    seedKey: `niche:${slug}`,
    roots: vocab.roots,
    modifiers: vocab.modifiers,
    extraSuffixes: vocab.extraSuffixes,
    themedTlds: vocab.themedTlds,
    count,
  });
}

/** Build varied, curated example names for a TLD page (all on that extension). */
export function exampleNamesForTld(tld: string, count = 18): GeneratedName[] {
  const vocab = TLD_VOCAB[tld] ?? TLD_VOCAB.com;
  return buildExampleNames({
    seedKey: `tld:${tld}`,
    roots: vocab.roots,
    modifiers: vocab.modifiers,
    extraSuffixes: vocab.extraSuffixes,
    forceTld: tld,
    count,
  });
}

/**
 * Large candidate pools (relaxed variety caps) used by the build-time
 * availability precompute, which checks these and keeps the available ones.
 */
export function exampleNamePoolForNiche(slug: string, count = 90): GeneratedName[] {
  const vocab = NICHE_VOCAB[slug];
  if (!vocab) return [];
  return buildExampleNames({
    seedKey: `niche:${slug}`,
    roots: vocab.roots,
    modifiers: vocab.modifiers,
    extraSuffixes: vocab.extraSuffixes,
    themedTlds: vocab.themedTlds,
    count,
    rootCap: 6,
    tagCap: 12,
  });
}

/**
 * Large `.com`-forced pool for a niche. The precompute checks these against
 * RDAP and keeps the available ones, so pages lead with verifiable-available
 * (green) names instead of unverifiable themed extensions.
 */
export function exampleNamePoolForNicheCom(
  slug: string,
  count = 130
): GeneratedName[] {
  const vocab = NICHE_VOCAB[slug];
  if (!vocab) return [];
  return buildExampleNames({
    seedKey: `niche:${slug}`,
    roots: vocab.roots,
    modifiers: vocab.modifiers,
    extraSuffixes: vocab.extraSuffixes,
    forceTld: "com",
    count,
    rootCap: 8,
    tagCap: 16,
  });
}

export function exampleNamePoolForTld(tld: string, count = 100): GeneratedName[] {
  const vocab = TLD_VOCAB[tld] ?? TLD_VOCAB.com;
  return buildExampleNames({
    seedKey: `tld:${tld}`,
    roots: vocab.roots,
    modifiers: vocab.modifiers,
    extraSuffixes: vocab.extraSuffixes,
    forceTld: tld,
    count,
    rootCap: 8,
    tagCap: 16,
  });
}
