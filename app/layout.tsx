import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SmartDomainFinds — Find the smartest available domain",
    template: "%s · SmartDomainFinds",
  },
  description:
    "Describe your startup, product, newsletter, app, or side project. SmartDomainFinds generates brandable names, checks availability, scores each option, and helps you pick the best one.",
  keywords: [
    "domain name generator",
    "AI domain finder",
    "startup name generator",
    "brandable domains",
    "available domains",
  ],
  openGraph: {
    title: "SmartDomainFinds — Find the smartest available domain",
    description:
      "AI-powered domain name generator and research assistant. Generate, score, and shortlist brandable available domains.",
    url: appUrl,
    siteName: "SmartDomainFinds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
