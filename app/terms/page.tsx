import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for SmartDomainFinds — the legal agreement for using our domain research tools.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: September 27, 2026
          </p>

          <div className="prose prose-slate mt-8 dark:prose-invert">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using SmartDomainFinds (the &quot;Service&quot;), you
              accept and agree to be bound by these Terms of Service (&quot;Terms&quot;).
              If you do not agree to these Terms, do not use the Service.
            </p>

            <h2>Description of Service</h2>
            <p>
              SmartDomainFinds is a domain name research tool that provides:
            </p>
            <ul>
              <li>AI-powered domain name generation based on user input</li>
              <li>
                Real-time domain availability checking via RDAP/WHOIS lookups
                and registrar APIs
              </li>
              <li>
                Domain name scoring and analysis (brandability, memorability,
                etc.)
              </li>
              <li>Links to third-party registrars for domain registration</li>
              <li>
                Additional tools such as WHOIS lookup, bulk domain checking, and
                username availability checking
              </li>
            </ul>

            <h2>Use of Service</h2>

            <h3>Permitted Use</h3>
            <p>You may use the Service for:</p>
            <ul>
              <li>Researching and discovering available domain names</li>
              <li>Checking domain availability and registration information</li>
              <li>Generating business and brand name ideas</li>
              <li>
                Personal, commercial, or organizational domain research purposes
              </li>
            </ul>

            <h3>Prohibited Use</h3>
            <p>You may not:</p>
            <ul>
              <li>
                Use automated systems (bots, scrapers) to access the Service
                without prior written permission
              </li>
              <li>
                Circumvent any access restrictions, rate limits, or security
                measures
              </li>
              <li>
                Attempt to overwhelm our infrastructure through excessive
                requests
              </li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>
                Reverse engineer, decompile, or attempt to extract source code
              </li>
              <li>
                Resell, redistribute, or create derivative services based on
                SmartDomainFinds without permission
              </li>
            </ul>

            <h2>Availability Information Disclaimer</h2>
            <p>
              <strong>Important:</strong> While we strive to provide accurate
              domain availability information, the data is provided &quot;as is&quot; for
              research purposes only. Availability status can change rapidly,
              and there may be delays between our checks and actual registry
              state.
            </p>
            <p>
              <strong>
                Always confirm domain availability directly with a registrar
                before making a purchase decision.
              </strong>{" "}
              We are not responsible for:
            </p>
            <ul>
              <li>
                Domains that become unavailable between our check and your
                attempted registration
              </li>
              <li>Errors in availability data from upstream sources</li>
              <li>
                Premium pricing, registration restrictions, or other conditions
                imposed by registries and registrars
              </li>
              <li>
                Lost opportunities due to inaccurate or delayed availability
                information
              </li>
            </ul>

            <h2>Third-Party Services</h2>

            <h3>RDAP/WHOIS Data</h3>
            <p>
              We query authoritative RDAP (Registration Data Access Protocol)
              servers and WHOIS databases to check domain availability and
              retrieve registration information. This data is provided by
              third-party registry operators. We do not control or guarantee the
              accuracy, availability, or timeliness of this data.
            </p>

            <h3>Registrar Links and Affiliate Disclosure</h3>
            <p>
              The Service includes links to third-party domain registrars.{" "}
              <strong>
                Some of these links may be affiliate links, meaning we may
                receive a commission if you make a purchase through these links.
              </strong>{" "}
              This comes at no additional cost to you and helps support the
              Service.
            </p>
            <p>
              We are not affiliated with, endorsed by, or responsible for any
              registrar. Your use of registrar services is governed by their
              respective terms of service and privacy policies. We make no
              warranties regarding:
            </p>
            <ul>
              <li>Registrar pricing, fees, or promotional offers</li>
              <li>Registrar service quality or reliability</li>
              <li>Domain registration, transfer, or renewal processes</li>
              <li>Registrar customer support or dispute resolution</li>
            </ul>

            <h3>AI-Generated Content</h3>
            <p>
              Domain name suggestions are generated using artificial intelligence
              based on your input. These suggestions are creative outputs and do
              not constitute professional naming, branding, or trademark advice.
            </p>

            <h2>Intellectual Property</h2>

            <h3>Service Content</h3>
            <p>
              The Service, including its design, features, code, and original
              content, is owned by SmartDomainFinds and protected by copyright,
              trademark, and other intellectual property laws. You may not copy,
              modify, distribute, or create derivative works without permission.
            </p>

            <h3>User Content</h3>
            <p>
              You retain ownership of any search queries, ideas, or preferences
              you provide to the Service. By using the Service, you grant us a
              limited license to use this input solely to provide and improve
              the Service.
            </p>

            <h3>Generated Suggestions</h3>
            <p>
              Domain name suggestions generated by our AI are not copyrightable
              in most jurisdictions and are provided to you freely. However, we
              make no warranty that generated names are available, not
              trademarked, or suitable for your intended use. You are
              responsible for conducting your own trademark searches and legal
              due diligence.
            </p>

            <h2>Disclaimers and Limitations of Liability</h2>

            <h3>No Warranty</h3>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>We do not warrant that:</p>
            <ul>
              <li>The Service will be uninterrupted or error-free</li>
              <li>
                Domain availability information will be accurate or up-to-date
              </li>
              <li>Generated domain names are legally available or suitable</li>
              <li>Any defects will be corrected</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMARTDOMAINFINDS SHALL NOT
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
              DATA, USE, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED
              TO YOUR USE OF THE SERVICE.
            </p>
            <p>
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID
              TO USE THE SERVICE (WHICH IS $0 FOR FREE USERS).
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SmartDomainFinds, its
              affiliates, and their respective officers, directors, employees,
              and agents from any claims, damages, losses, liabilities, and
              expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>
                Your registration or use of domain names discovered through the
                Service
              </li>
              <li>Any trademark or intellectual property disputes</li>
            </ul>

            <h2>Privacy</h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting to this page with an
              updated &quot;Last updated&quot; date. Your continued use of the Service
              after changes constitutes acceptance of the revised Terms.
            </p>

            <h2>Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any
              time, with or without cause or notice, including for violations of
              these Terms or excessive use that impacts service availability for
              others.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware,
              United States, without regard to conflict of law principles.
              Disputes arising from these Terms or your use of the Service shall
              be resolved in the courts located in Delaware.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full force and effect.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at
              legal@smartdomainfinds.com.
            </p>

            <div className="not-prose mt-8 border-t border-border pt-6">
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
