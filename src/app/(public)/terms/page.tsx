import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for TBM Events – Event Ticketing Platform.',
}

export default function TermsPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-text-light dark:text-text-dark">Terms of Use</h1>
        <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
          TBM Events – Event Ticketing Platform
        </p>
      </header>

      <div className="space-y-6 text-sm leading-6 text-text-light/90 dark:text-text-dark/90">
        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. INTRODUCTION</h2>
          <p>
            Welcome to TBM Events (“TBM,” “we,” “us,” “our”). TBM Events is a digital event ticketing and attendee
            management platform operating in Nigeria, providing services to event organizers, attendees, promoters,
            partners, and vendors through our mobile application, website, and related services (collectively, the
            “Platform”).
          </p>
          <p>
            By accessing or using the TBM Events Platform, you agree to be bound by these Terms of Use. If you do not
            agree, please do not use the Platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. ELIGIBILITY</h2>
          <p>
            You must be at least 18 years old to create an account or conduct financial transactions on TBM Events. By
            using the Platform, you confirm that you have the legal capacity to enter into this agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. OUR SERVICES</h2>
          <p>TBM Events provides, but is not limited to, the following services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Event creation and publishing</li>
            <li>Ticket sales (free and paid)</li>
            <li>QR code ticketing and validation</li>
            <li>Attendee management</li>
            <li>Payment processing and settlements</li>
            <li>Event analytics and reporting</li>
            <li>Promotions and event discovery</li>
          </ul>
          <p>
            TBM Events does not organize events, but acts as a technology intermediary between event organizers and
            attendees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. USER ACCOUNTS</h2>
          <h3 className="font-semibold">4.1 Account Creation</h3>
          <p>You are responsible for providing accurate and complete information when creating an account.</p>
          <h3 className="font-semibold">4.2 Account Security</h3>
          <p>
            You are solely responsible for maintaining the confidentiality of your login credentials. TBM Events shall not
            be liable for unauthorized access resulting from your negligence.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. EVENT ORGANIZERS</h2>
          <p>If you are an event organizer:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You confirm that you have the legal authority to host the event.</li>
            <li>You are solely responsible for the accuracy of event details, pricing, schedules, and refunds.</li>
            <li>You agree that TBM Events may deduct applicable service fees and charges before settlement.</li>
            <li>
              TBM Events reserves the right to suspend or remove events that violate laws, public safety, or platform
              rules.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. TICKETS &amp; PAYMENTS</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tickets purchased are non-refundable unless otherwise stated by the organizer.</li>
            <li>
              TBM Events is not responsible for event cancellations, postponements, or changes, but will reasonably assist
              in communication.
            </li>
            <li>All payments are processed through secure third-party payment providers.</li>
            <li>TBM Events is not liable for losses resulting from failed events, force majeure, or organizer default.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. FEES &amp; COMMISSIONS</h2>
          <p>
            TBM Events charges service fees on ticket sales. Fees are subject to change with notice and may vary based on
            event type, volume, or partnership agreements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. PROHIBITED ACTIVITIES</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the platform for fraudulent or illegal activities</li>
            <li>Sell counterfeit or unauthorized tickets</li>
            <li>Manipulate ticket prices unfairly</li>
            <li>Harvest user data without consent</li>
            <li>Interfere with platform operations</li>
          </ul>
          <p>Violation may result in account suspension, termination, or legal action.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. INTELLECTUAL PROPERTY</h2>
          <p>
            All content, logos, designs, software, and trademarks on TBM Events are the exclusive property of TBM Events
            or its licensors. Unauthorized use is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">10. LIMITATION OF LIABILITY</h2>
          <p>To the fullest extent permitted by Nigerian law:</p>
          <p>TBM Events shall not be liable for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Event cancellations or disruptions</li>
            <li>Financial losses due to organizer actions</li>
            <li>Technical downtime beyond reasonable control</li>
            <li>Personal injury or property damage at events</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">11. INDEMNIFICATION</h2>
          <p>
            You agree to indemnify TBM Events against claims, losses, or damages arising from your use of the Platform or
            violation of these Terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">12. TERMINATION</h2>
          <p>TBM Events reserves the right to suspend or terminate accounts without notice if these Terms are breached.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">13. GOVERNING LAW</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in
            Nigerian courts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">14. CHANGES TO TERMS</h2>
          <p>
            TBM Events may update these Terms at any time. Continued use signifies acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">15. CONTACT</h2>
          <p>
            <span className="font-semibold">Email:</span> support@thetbmevents.com
          </p>
          <p>
            <span className="font-semibold">Location:</span> Nigeria
          </p>
        </section>
      </div>
    </main>
  )
}
