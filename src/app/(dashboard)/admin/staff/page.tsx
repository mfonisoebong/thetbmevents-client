'use client'

import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'

export default function AdminStaffPage() {
  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Staff</h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Manage internal users and permissions.</p>
        </div>

        <GlassCard className="mt-6 p-6">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-5">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">This feature is deprecated.</div>
            <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
              Staff management has been removed from this dashboard.
            </p>
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
