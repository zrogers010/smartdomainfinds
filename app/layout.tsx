import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

const TITLE = "SmartDomainFinds — AI Domain Name Generator & Availability Checker";
const DESCRIPTION =
  "Free AI domain name generator. Describe your startup, app, or side project and instantly get brandable, available domain names — checked in real time across .com, .ai, .io, and more, each with a Smart Score.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: TITLE,
    template: "%s · SmartDomainFinds",
  },
  description: DESCRIPTION,
  applicationName: "SmartDomainFinds",
  category: "technology",
  keywords: [
    "domain name generator",
    "AI domain name generator",
    "domain availability checker",
    "startup name generator",
    "business name generator",
    "brandable domains",
    "available domain names",
    "check domain availability",
    "instant domain search",
    "find a domain name",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: appUrl,
    siteName: "SmartDomainFinds",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
