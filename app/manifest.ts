import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartDomainFinds — AI Domain Name Generator",
    short_name: "SmartDomainFinds",
    description:
      "Free AI domain name generator with real-time availability checks and a Smart Score for every name.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    categories: ["productivity", "business", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
