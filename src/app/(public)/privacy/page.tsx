import type { Metadata } from 'next'

const LAST_UPDATED = 'January 28, 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for TBM Events.',
}

export default function PrivacyPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-text-light dark:text-text-dark">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">TBM Events</p>
        <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">Last Updated: {LAST_UPDATED}</p>
      </header>

      <div className="space-y-6 text-sm leading-6 text-text-light/90 dark:text-text-dark/90">
        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. INTRODUCTION</h2>
          <p>
            TBM Events respects your privacy and is committed to protecting your personal data in compliance with the
            Nigeria Data Protection Regulation (NDPR).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. INFORMATION WE COLLECT</h2>
          <p>We may collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Payment information (processed securely via third parties)</li>
            <li>Event attendance data</li>
            <li>Device and usage data</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. HOW WE USE YOUR INFORMATION</h2>
          <p>Your data is used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide ticketing and event services</li>
            <li>Process payments</li>
            <li>Verify identity and prevent fraud</li>
            <li>Communicate event updates</li>
            <li>Improve platform performance</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. DATA SHARING</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Event organizers (only relevant ticket data)</li>
            <li>Payment processors</li>
            <li>Legal or regulatory authorities when required</li>
          </ul>
          <p>We do not sell personal data.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. DATA STORAGE &amp; SECURITY</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your data. However, no system is
            100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. COOKIES &amp; TRACKING</h2>
          <p>
            TBM Events uses cookies and similar technologies to enhance user experience, analytics, and marketing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. USER RIGHTS</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent</li>
            <li>File complaints with NDPR authorities</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. DATA RETENTION</h2>
          <p>
            We retain personal data only as long as necessary for operational, legal, or regulatory purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. CHILDREN’S PRIVACY</h2>
          <p>TBM Events does not knowingly collect data from persons under 18.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">10. THIRD-PARTY LINKS</h2>
          <p>
            TBM Events is not responsible for privacy practices of third-party websites or services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">11. CHANGES TO PRIVACY POLICY</h2>
          <p>
            We may update this Privacy Policy periodically. Updates will be communicated via the Platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">12. CONTACT US</h2>
          <p>
            For privacy inquiries: <span className="font-semibold">privacy@thetbmevents.com</span>
          </p>
        </section>
      </div>
    </main>
  )
}
