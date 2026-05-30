import type { DomainStyle } from "@/lib/domain/types";

export const EXAMPLE_PROMPTS: string[] = [
  "AI visibility tracking tool for small businesses",
  "Premium dog food brand for health-conscious owners",
  "Personal finance app for freelancers",
  "Newsletter about survival gear and preparedness",
  "Developer tool for turning data into beautiful charts",
  "Marketplace for local home service professionals",
  "App that helps people plan wine trips in France",
];

export const STYLE_DESCRIPTIONS: Record<DomainStyle, string> = {
  brandable: "Modern, startup-style names built to become a brand.",
  descriptive: "Names that clearly say what the product does.",
  premium: "Serious, investor-friendly, enterprise-ready names.",
  seo: "Names that include valuable search keywords.",
  playful: "Clever and memorable without sounding spammy.",
  short: "Concise names that are easy to remember.",
  domain_hack: "Creative names that use the TLD as part of the word.",
};

/** Tailwind classes per style badge (kept subtle + premium). */
export const STYLE_BADGE_CLASSES: Record<DomainStyle, string> = {
  brandable: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  descriptive: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
  premium: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  seo: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  playful: "bg-pink-500/12 text-pink-600 dark:text-pink-300",
  short: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
  domain_hack: "bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-300",
};
