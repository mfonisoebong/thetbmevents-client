'use client'

import React, { useMemo } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { events as mockEvents } from '@lib/mockEvents'
import { buildAdminDashboardSummary, type AdminRevenueMonth, type AdminTopEventRow } from '@lib/adminDashboardMock'
import { cn, currencySymbol, formatNumber } from '@lib/utils'

function StatCard({
  title,
  value,
  sub,
  accent = 'yellow',
}: {
  title: string
  value: React.ReactNode
  sub?: React.ReactNode
  accent?: 'yellow' | 'teal'
}) {
  const ring = accent === 'teal' ? 'focus:ring-brand-teal' : 'focus:ring-brand-yellow'

  return (
    <div className={cn('rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm', ring)}>
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{sub}</div> : null}
    </div>
  )
}

function monthLabel(yyyymm: string) {
  // yyyymm in form YYYY-MM
  const [y, m] = yyyymm.split('-')
  const monthIndex = Number(m) - 1
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const mm = months[monthIndex] ?? m
  return `${mm} ${y}`
}

export default function AdminDashboardPage() {
  const summary = useMemo(() => buildAdminDashboardSummary(mockEvents, new Date()), [])

  const revenueColumns = useMemo((): DataTableColumn<AdminRevenueMonth>[] => {
    return [
      {
        key: 'month',
        header: 'Month',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{monthLabel(r.month)}</span>,
      },
      {
        key: 'revenue',
        header: 'Revenue',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span>
            {currencySymbol('NGN')}
            {formatNumber(r.revenue)}
          </span>
        ),
      },
      {
        key: 'netRevenue',
        header: 'Net revenue (8%)',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="text-text-muted-light dark:text-text-muted-dark">
            {currencySymbol('NGN')}
            {formatNumber(r.netRevenue)}
          </span>
        ),
      },
    ]
  }, [])

  const topEventColumns = useMemo((): DataTableColumn<AdminTopEventRow>[] => {
    return [
      {
        key: 'organizerName',
        header: 'Organizer',
        render: (r) => <span className="font-semibold text-gray-900 dark:text-white">{r.organizerName}</span>,
      },
      {
        key: 'eventName',
        header: 'Event',
        render: (r) => <span className="text-gray-900 dark:text-white">{r.eventName}</span>,
      },
      {
        key: 'ticketsSold',
        header: 'Tickets sold',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{formatNumber(r.ticketsSold)}</span>,
      },
    ]
  }, [])

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin dashboard</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">A quick overview of platform performance.</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Revenue this month"
            value={
              <>
                {currencySymbol('NGN')}
                {formatNumber(summary.revenueThisMonth)}
              </>
            }
            sub="Gross revenue"
            accent="teal"
          />
          <StatCard
            title="Net revenue this month"
            value={
              <>
                {currencySymbol('NGN')}
                {formatNumber(summary.netRevenueThisMonth)}
              </>
            }
            sub="8% of gross revenue"
          />
          <StatCard title="Total events" value={formatNumber(summary.totalEventsOverall)} sub="All time" />
          <StatCard title="Events this month" value={formatNumber(summary.totalEventsThisMonth)} sub="Created this month" />
          <StatCard title="Total organizers" value={formatNumber(summary.totalOrganizers)} sub="Accounts" />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by month */}
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by month</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                  Last 12 months (gross + platform revenue).
                </p>
              </div>
            </div>

            <div className="mt-4">
              <DataTable<AdminRevenueMonth>
                columns={revenueColumns}
                rows={[...summary.revenueByMonth].reverse()}
                rowKey={(r) => r.month}
                emptyTitle="No revenue yet"
                emptyDescription="Revenue will appear once tickets are sold."
              />
            </div>
          </GlassCard>

          {/* Top events */}
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top events</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">By tickets sold.</p>
              </div>
            </div>

            <div className="mt-4">
              <DataTable<AdminTopEventRow>
                columns={topEventColumns}
                rows={summary.topEvents}
                rowKey={(r) => r.eventId}
                emptyTitle="No events yet"
                emptyDescription="Top events will show once events exist."
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </SidebarLayout>
  )
}
