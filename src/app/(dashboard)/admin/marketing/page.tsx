'use client'

import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs text-center font-semibold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
      {children}
    </span>
  )
}

export default function AdminMarketingPage() {
  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Marketing</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Campaigns, promotions, and announcements.</p>
          </div>
          <Badge>Coming soon</Badge>
        </div>

        <GlassCard className="mt-6 p-6">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-6">
            <div className="text-lg font-bold text-gray-900 dark:text-white">Coming soon</div>
            <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
              We’re building marketing tools for email blasts, promo codes, audience segments, and featured events.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Email</div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Announcements & newsletters</div>
              </div>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Promotions</div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Featured events & banners</div>
              </div>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Insights</div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Campaign performance</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="/admin/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
              >
                Back to dashboard
              </a>
              <a
                href="/admin/finance"
                className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                View revenue
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
