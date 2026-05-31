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
  consulting: {
    roots: ["Apex", "Vantage", "Pinnacle", "Beacon", "Compass", "Catalyst", "Keystone", "Anchor", "Cobalt", "Vertex", "Helm", "Quorum", "Lattice", "Meridian", "Atlas", "Cedar", "Pillar", "Verve"],
    modifiers: ["Prime", "North", "True", "Apex", "Clear"],
    extraSuffixes: ["Partners", "Advisory", "Group", "Consulting", "Strategy"],
    themedTlds: ["consulting", "co"],
  },
  "cleaning-service": {
    roots: ["Sparkle", "Pristine", "Gleam", "Shine", "Tidy", "Crisp", "Spotless", "Polish", "Dew", "Lustre", "Sage", "Maple", "Bloom", "Verde", "Lumen", "Halo", "Cinder", "Pure"],
    modifiers: ["Pure", "Bright", "Fresh", "Clear", "Daily"],
    extraSuffixes: ["Cleaning", "Cleaners", "Care", "Services", "Co"],
    themedTlds: ["cleaning", "co"],
  },
  "law-firm": {
    roots: ["Verdict", "Counsel", "Sterling", "Aegis", "Anchor", "Pillar", "Oakwood", "Beacon", "Meridian", "Cardinal", "Cobalt", "Atlas", "Sentinel", "Keystone", "Cedar", "Lex", "Vantage", "Granite"],
    modifiers: ["Prime", "North", "True", "Sterling", "Cardinal"],
    extraSuffixes: ["Law", "Legal", "Counsel", "Partners", "Group"],
    themedTlds: ["law", "co"],
  },
  "dental-clinic": {
    roots: ["Enamel", "Pearl", "Aspen", "Cedar", "Beacon", "Maple", "Lumen", "Crest", "Ivory", "Willow", "Halo", "Gleam", "Dew", "Bloom", "Aura", "Verde", "Cinder", "Bright"],
    modifiers: ["Bright", "Pure", "Gentle", "North", "Clear"],
    extraSuffixes: ["Dental", "Dentistry", "Smiles", "Care", "Clinic"],
    themedTlds: ["dental", "care", "co"],
  },
  "yoga-studio": {
    roots: ["Lotus", "Breath", "Bloom", "Sage", "Serene", "Halo", "Aura", "Willow", "Ember", "Verde", "Lumen", "Grove", "Petal", "Banyan", "Zen", "Cedar", "Drift", "Bare"],
    modifiers: ["Pure", "Serene", "North", "True", "Still"],
    extraSuffixes: ["Yoga", "Studio", "Wellness", "Flow", "Collective"],
    themedTlds: ["yoga", "studio", "co"],
  },
  brewery: {
    roots: ["Hops", "Barrel", "Ember", "Anvil", "Copper", "Cask", "Granite", "Hearth", "Oak", "Cellar", "Tidewater", "Cobalt", "Maple", "Cedar", "Forge", "Iron", "Stout", "Kettle"],
    modifiers: ["Wild", "North", "Iron", "Copper", "Bold"],
    extraSuffixes: ["Brewing", "Brewery", "Taproom", "BrewCo", "Works"],
    themedTlds: ["beer", "co", "pub"],
  },
  nonprofit: {
    roots: ["Hope", "Unity", "Bridge", "Beacon", "Haven", "Kindred", "Uplift", "Rally", "Ember", "Harbor", "Anchor", "Bloom", "Grove", "Cedar", "Lumen", "Mosaic", "Compass", "Kinship"],
    modifiers: ["United", "North", "True", "Open", "Bright"],
    extraSuffixes: ["Foundation", "Alliance", "Project", "Initiative", "Collective"],
    themedTlds: ["org", "co", "foundation"],
  },
  "interior-design": {
    roots: ["Atelier", "Hearth", "Loft", "Maison", "Abode", "Linen", "Velvet", "Marble", "Cedar", "Haven", "Form", "Ivory", "Sable", "Willow", "Verde", "Lumen", "Nook", "Lustre"],
    modifiers: ["North", "True", "Maison", "Velvet", "Sable"],
    extraSuffixes: ["Interiors", "Design", "Studio", "Atelier", "Spaces"],
    themedTlds: ["design", "studio", "co"],
  },
  "pet-grooming": {
    roots: ["Fluff", "Whisker", "Bark", "Cuddle", "Snout", "Pamper", "Bubbles", "Fetch", "Velvet", "Biscuit", "Maple", "Bramble", "Paws", "Mane", "Honey", "Cedar", "Nuzzle", "Bloom"],
    modifiers: ["Happy", "Pampered", "Posh", "Little", "Fluffy"],
    extraSuffixes: ["Grooming", "Spa", "Pets", "PawCo", "Care"],
    themedTlds: ["pet", "dog", "co"],
  },
  "travel-agency": {
    roots: ["Wander", "Voyage", "Compass", "Horizon", "Nomad", "Roam", "Trek", "Atlas", "Drift", "Harbor", "Meridian", "Vista", "Cedar", "Lumen", "Odyssey", "Beacon", "Sojourn", "Latitude"],
    modifiers: ["North", "True", "Far", "Open", "Golden"],
    extraSuffixes: ["Travel", "Voyages", "Journeys", "Getaways", "Co"],
    themedTlds: ["travel", "co", "tours"],
  },
  "event-planning": {
    roots: ["Soiree", "Gather", "Lumen", "Confetti", "Velvet", "Bloom", "Halo", "Fete", "Toast", "Ember", "Mosaic", "Petal", "Aura", "Cedar", "Grove", "Marble", "Vivid", "Soju"],
    modifiers: ["Golden", "Velvet", "North", "True", "Bright"],
    extraSuffixes: ["Events", "Co", "Occasions", "Collective", "Studio"],
    themedTlds: ["events", "co", "party"],
  },
  "jewelry-brand": {
    roots: ["Opal", "Lustre", "Gilded", "Ember", "Ivory", "Halo", "Velvet", "Pearl", "Sable", "Lumen", "Aura", "Onyx", "Marble", "Petal", "Gleam", "Crown", "Verde", "Aurum"],
    modifiers: ["Golden", "Velvet", "Sable", "Pure", "Luxe"],
    extraSuffixes: ["Jewelry", "Atelier", "Co", "Studio", "Fine"],
    themedTlds: ["jewelry", "co", "shop"],
  },
  "candle-business": {
    roots: ["Ember", "Glow", "Wick", "Hearth", "Lumen", "Amber", "Flicker", "Cinder", "Honey", "Sable", "Velvet", "Bloom", "Maple", "Halo", "Dusk", "Verde", "Tallow", "Cozy"],
    modifiers: ["Cozy", "Golden", "Little", "Warm", "North"],
    extraSuffixes: ["Candle", "Candles", "Co", "Home", "Studio"],
    themedTlds: ["co", "shop", "store"],
  },
  florist: {
    roots: ["Petal", "Bloom", "Posy", "Stem", "Verde", "Willow", "Fern", "Lush", "Daisy", "Sage", "Ivy", "Meadow", "Bouquet", "Grove", "Honey", "Maple", "Bramble", "Wisteria"],
    modifiers: ["Wild", "Little", "Golden", "Fresh", "North"],
    extraSuffixes: ["Florals", "Flowers", "Bloom", "Botanicals", "Co"],
    themedTlds: ["flowers", "co", "shop"],
  },
  "barber-shop": {
    roots: ["Blade", "Razor", "Fade", "Clipper", "Anvil", "Iron", "Crown", "Mane", "Stag", "Copper", "Oak", "Sterling", "Ace", "Cedar", "Granite", "Maple", "Verge", "Onyx"],
    modifiers: ["Classic", "Iron", "North", "Sterling", "Bold"],
    extraSuffixes: ["Barber", "Barbershop", "Grooming", "Co", "Cuts"],
    themedTlds: ["co", "style"],
  },
  "tattoo-studio": {
    roots: ["Needle", "Raven", "Iron", "Onyx", "Ember", "Serpent", "Dagger", "Crow", "Sable", "Anvil", "Vivid", "Cobalt", "Inkwell", "Thorn", "Cinder", "Obsidian", "Ink", "Ash"],
    modifiers: ["Black", "Iron", "Wild", "Bold", "North"],
    extraSuffixes: ["Tattoo", "Ink", "Studio", "Collective", "Co"],
    themedTlds: ["ink", "tattoo", "co"],
  },
  "skincare-brand": {
    roots: ["Glow", "Dew", "Lush", "Bloom", "Petal", "Aura", "Lumen", "Velvet", "Serene", "Halo", "Verde", "Silk", "Bare", "Ivory", "Botanic", "Sage", "Nectar", "Dewy"],
    modifiers: ["Pure", "Glow", "Bare", "North", "Lush"],
    extraSuffixes: ["Skin", "Beauty", "Botanicals", "Co", "Glow"],
    themedTlds: ["beauty", "co", "shop"],
  },
  "ecommerce-store": {
    roots: ["Cart", "Shelf", "Trove", "Bazaar", "Crate", "Nook", "Vault", "Depot", "Parcel", "Stash", "Mercato", "Cobalt", "Harbor", "Pantry", "Loom", "Maple", "Cedar", "Tilt"],
    modifiers: ["Daily", "North", "Prime", "Little", "Urban"],
    extraSuffixes: ["Goods", "Shop", "Market", "Supply", "Co"],
    themedTlds: ["shop", "store", "co"],
  },
  accounting: {
    roots: ["Ledger", "Balance", "Abacus", "Tally", "Keystone", "Anchor", "Sterling", "Cobalt", "Beacon", "Vantage", "Quanta", "Pillar", "Atlas", "Meridian", "Cedar", "Crest", "Summit", "Audit"],
    modifiers: ["Prime", "North", "True", "Sterling", "Clear"],
    extraSuffixes: ["Accounting", "Books", "Advisory", "Partners", "Co"],
    themedTlds: ["co", "accountant", "tax"],
  },
  construction: {
    roots: ["Granite", "Forge", "Anvil", "Keystone", "Iron", "Bedrock", "Cornerstone", "Apex", "Cobalt", "Pillar", "Steel", "Oak", "Ridge", "Atlas", "Foundry", "Cedar", "Beacon", "Quarry"],
    modifiers: ["North", "Iron", "True", "Prime", "Solid"],
    extraSuffixes: ["Construction", "Builders", "Build", "Contracting", "Co"],
    themedTlds: ["build", "construction", "co"],
  },
  "youtube-channel": {
    roots: ["Pixel", "Reel", "Frame", "Vivid", "Echo", "Spark", "Loop", "Stream", "Banter", "Vibe", "Lumen", "Nova", "Static", "Riff", "Beacon", "Wave", "Buzz", "Drift"],
    modifiers: ["Daily", "Bold", "Nova", "North", "Open"],
    extraSuffixes: ["TV", "Media", "Studio", "Channel", "Co"],
    themedTlds: ["tv", "co", "media"],
  },
  "gaming-esports": {
    roots: ["Pixel", "Vortex", "Nova", "Surge", "Glitch", "Frag", "Rift", "Volt", "Apex", "Phantom", "Cipher", "Blaze", "Onyx", "Nexus", "Flux", "Cobalt", "Pulse", "Specter"],
    modifiers: ["Apex", "Nova", "Bold", "Hyper", "North"],
    extraSuffixes: ["Gaming", "Esports", "Squad", "Arena", "Co"],
    themedTlds: ["gg", "io", "co"],
  },
  tutoring: {
    roots: ["Scholar", "Sage", "Spark", "Lumen", "Beacon", "Compass", "Grove", "Aspen", "Quill", "Mentor", "Cedar", "Halo", "Bloom", "Atlas", "Prism", "Nova", "Bright", "Summit"],
    modifiers: ["Bright", "North", "Prime", "Clear", "True"],
    extraSuffixes: ["Tutoring", "Learning", "Academy", "Scholars", "Co"],
    themedTlds: ["academy", "education", "co"],
  },
  daycare: {
    roots: ["Sprout", "Bloom", "Acorn", "Giggle", "Cubby", "Meadow", "Willow", "Maple", "Pebble", "Nest", "Honey", "Bumble", "Grove", "Lumen", "Daisy", "Sage", "Sunny", "Bramble"],
    modifiers: ["Little", "Sunny", "Bright", "Happy", "Tiny"],
    extraSuffixes: ["Kids", "Academy", "Learning", "Preschool", "Co"],
    themedTlds: ["care", "co", "academy"],
  },
  "crypto-web3": {
    roots: ["Ledger", "Cipher", "Vault", "Nexus", "Helix", "Quanta", "Prism", "Forge", "Relay", "Cinder", "Vertex", "Aether", "Nova", "Pulse", "Cobalt", "Onyx", "Cascade", "Pylon", "Beacon", "Zenith", "Lumen", "Stark", "Obsidian", "Quartz"],
    modifiers: ["Open", "Meta", "Hyper", "Proto", "Prime"],
    extraSuffixes: ["Protocol", "Labs", "Network", "Chain", "Vault"],
    themedTlds: ["xyz", "io", "ai"],
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
  info: {
    roots: ["Guide", "Compass", "Atlas", "Beacon", "Index", "Brief", "Digest", "Lumen", "Scout", "Almanac", "Ledger", "Sage"],
    extraSuffixes: ["Guide", "Hub", "Desk"],
  },
  site: {
    roots: ["Nova", "Vibe", "Pixel", "Loft", "Studio", "Bright", "Halo", "Drift", "Canvas", "Spark", "Cedar", "Lumen"],
  },
  studio: {
    roots: ["Form", "Canvas", "Atelier", "Pixel", "Frame", "Loom", "Verve", "Lumen", "Halo", "Marble", "Onyx", "Ember", "Vivid", "Prism"],
    extraSuffixes: ["Works", "Lab", "Collective"],
  },
  design: {
    roots: ["Form", "Canvas", "Pixel", "Prism", "Loom", "Marble", "Lumen", "Verve", "Onyx", "Halo", "Vivid", "Atelier", "Slate", "Bauhaus"],
    extraSuffixes: ["Works", "Lab", "Studio"],
  },
  space: {
    roots: ["Nova", "Orbit", "Comet", "Drift", "Lumen", "Vibe", "Loft", "Halo", "Pulse", "Zen", "Cobalt", "Cosmos"],
    extraSuffixes: ["Lab", "Hub", "Collective"],
  },
  cloud: {
    roots: ["Sync", "Scale", "Relay", "Vault", "Cobalt", "Nimbus", "Lattice", "Pylon", "Conduit", "Stratus", "Helix", "Vertex"],
    extraSuffixes: ["Labs", "Stack", "Systems"],
  },
  shop: {
    roots: ["Cart", "Trove", "Bazaar", "Goods", "Crate", "Nook", "Depot", "Parcel", "Stash", "Maple", "Harbor", "Pantry"],
    extraSuffixes: ["Goods", "Market", "Supply"],
  },
  agency: {
    roots: ["Echo", "Reach", "Vivid", "Halo", "Verve", "Catalyst", "Lumen", "Cadence", "Banner", "Beacon", "Plume", "Vantage"],
    extraSuffixes: ["Collective", "Works", "Lab"],
  },
  media: {
    roots: ["Echo", "Reel", "Frame", "Vivid", "Signal", "Pulse", "Static", "Loop", "Lumen", "Banter", "Wave", "Beacon"],
    extraSuffixes: ["House", "Works", "Collective"],
  },
  digital: {
    roots: ["Nova", "Pixel", "Vertex", "Cobalt", "Lumen", "Catalyst", "Pulse", "Relay", "Forge", "Spark", "Helix", "Vector"],
    extraSuffixes: ["Labs", "Works", "Studio"],
  },
  world: {
    roots: ["Wander", "Horizon", "Atlas", "Compass", "Mosaic", "Unity", "Bridge", "Kindred", "Lumen", "Beacon", "Grove", "Harbor"],
    extraSuffixes: ["Collective", "Project"],
  },
  life: {
    roots: ["Bloom", "Glow", "Serene", "Lush", "Verde", "Sage", "Halo", "Aura", "Lumen", "Bare", "Petal", "Dewy"],
    extraSuffixes: ["Co", "Studio"],
  },
  live: {
    roots: ["Pulse", "Echo", "Wave", "Signal", "Stage", "Reel", "Spark", "Vivid", "Loop", "Banter", "Surge", "Tempo"],
    extraSuffixes: ["Studio", "Media"],
  },
  club: {
    roots: ["Halo", "Verve", "Onyx", "Cobalt", "Ember", "Lumen", "Vivid", "Drift", "Nova", "Sable", "Velvet", "Spark"],
    extraSuffixes: ["Collective", "Society"],
  },
  blog: {
    roots: ["Quill", "Inkwell", "Page", "Folio", "Muse", "Scribe", "Lumen", "Banter", "Drift", "Vellum", "Echo", "Margin"],
    extraSuffixes: ["Notes", "Journal"],
  },
  link: {
    roots: ["Tap", "Hop", "Jump", "Loop", "Bridge", "Relay", "Snap", "Click", "Beacon", "Pulse", "Nova", "Drift"],
    extraSuffixes: ["Hub", "Bio"],
  },
  fun: {
    roots: ["Giggle", "Bounce", "Zip", "Bubble", "Spark", "Jolly", "Vibe", "Pixel", "Comet", "Doodle", "Wiggle", "Confetti"],
  },
  vip: {
    roots: ["Onyx", "Velvet", "Sable", "Gilded", "Lustre", "Crown", "Opal", "Halo", "Marble", "Aurum", "Verve", "Luxe"],
    extraSuffixes: ["Society", "Collective"],
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

export function exampleNamePoolForTld(tld: string, count = 60): GeneratedName[] {
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
