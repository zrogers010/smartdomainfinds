import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for SmartDomainFinds — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: September 27, 2026
          </p>

          <div className="prose prose-slate mt-8 dark:prose-invert">
            <h2>Overview</h2>
            <p>
              SmartDomainFinds ("we", "us", or "our") is a domain availability
              research tool. This Privacy Policy explains how we collect, use,
              and protect your information when you use our service.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information You Provide</h3>
            <p>
              When you use SmartDomainFinds, you provide search queries,
              business ideas, and domain name preferences. This information is
              processed to generate domain name suggestions and check
              availability.
            </p>

            <h3>Automatically Collected Information</h3>
            <p>
              We automatically collect certain technical information when you
              visit our site, including:
            </p>
            <ul>
              <li>
                Browser type, device type, and operating system information
              </li>
              <li>IP address (anonymized for analytics)</li>
              <li>Pages visited and features used</li>
              <li>Referral source and search queries within our site</li>
            </ul>

            <h3>Analytics</h3>
            <p>
              We use Google Analytics to understand how users interact with our
              service. Google Analytics collects information such as how often
              users visit this site, what pages they visit, and what other sites
              they used prior to coming to this site. We use the information we
              get from Google Analytics to improve our service. Google's ability
              to use and share information collected by Google Analytics about
              your visits to this site is restricted by the{" "}
              <a
                href="https://www.google.com/policies/privacy/partners/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Terms of Service
              </a>{" "}
              and the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
              .
            </p>

            <h3>Local Storage</h3>
            <p>
              We store certain preferences locally in your browser (such as
              theme preference, recent searches, and shortlisted domains) using
              browser local storage. This data never leaves your device unless
              you explicitly share it.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>
                Generate domain name suggestions based on your search queries
              </li>
              <li>
                Check domain availability via third-party registrar APIs and
                RDAP/WHOIS services
              </li>
              <li>
                Improve our service, understand usage patterns, and fix issues
              </li>
              <li>
                Analyze aggregate trends to develop new features and content
              </li>
            </ul>

            <h2>Third-Party Services</h2>

            <h3>Domain Availability Checks</h3>
            <p>
              When you search for domain availability, we query authoritative
              registry RDAP (Registration Data Access Protocol) servers and
              third-party registrar APIs. These queries may include the domain
              names you're checking. Each registry and registrar has its own
              privacy policy governing how they handle this data.
            </p>

            <h3>Registrar Links</h3>
            <p>
              We provide links to domain registrars where you can purchase
              available domains. Some of these links may be affiliate links,
              meaning we may receive a commission if you make a purchase. Your
              interaction with registrar websites is governed by their respective
              privacy policies, not ours.
            </p>

            <h3>AI Services</h3>
            <p>
              Our domain name generation feature uses third-party AI services to
              analyze your input and generate suggestions. We do not send
              personally identifiable information to these services — only your
              search queries and preferences.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement reasonable security measures to protect your
              information. However, no method of transmission over the Internet
              or electronic storage is 100% secure. We cannot guarantee absolute
              security.
            </p>

            <h2>Data Retention</h2>
            <p>
              Search queries and generated results are retained temporarily in
              server logs for debugging and service improvement purposes. We
              periodically purge old logs. Information stored in your browser
              (local storage) remains until you clear it.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have certain rights:</p>
            <ul>
              <li>Access to the information we hold about you</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Objection to processing of your information</li>
            </ul>
            <p>
              Since we don't require accounts, most data is processed
              ephemerally or stored locally on your device. You can clear your
              browser's local storage at any time to remove stored preferences
              and shortlists.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              SmartDomainFinds is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware that we have inadvertently collected such
              information, we will take steps to delete it.
            </p>

            <h2>International Users</h2>
            <p>
              SmartDomainFinds is operated from the United States. If you are
              accessing our service from outside the United States, your
              information may be transferred to, stored, and processed in the
              United States or other countries.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              through our website or via email at privacy@smartdomainfinds.com.
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
