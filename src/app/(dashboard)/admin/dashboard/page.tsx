'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import AdminDashboardShimmer from '../../../../components/dashboard/AdminDashboardShimmer'
import HTTP from '@lib/HTTP'
import { cn, currencySymbol, formatNumber, getEndpoint, getErrorMessage } from '@lib/utils'
import type { AdminDashboardOverview, ApiData, RevenuePast12Month, TopOrganizer } from '@lib/types'

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

function sfNumber(input: string): number {
  const n = Number.parseFloat(String(input ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

type AdminRevenueMonthRow = {
  month: string // YYYY-MM
  revenue: number
  netRevenue: number
}

type AdminTopOrganizerRow = {
  id: string
  organizerName: string
  email: string
  ticketsSold: string
  totalSales: number
}

const ADMIN_NET_REVENUE_RATE = 0.08

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const loadOverview = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<AdminDashboardOverview>, undefined>({
      url: getEndpoint('/dashboard/admin/overview'),
      method: 'get',
    })

    if (!resp.ok || !resp.data) {
      setOverview(null)
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    setOverview(resp.data.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadOverview()
  }, [loadOverview, reloadToken])

  const revenueByMonth = useMemo((): AdminRevenueMonthRow[] => {
    const src: RevenuePast12Month[] = overview?.revenue_past_12_months ?? []

    return src
      .map((m) => {
        const month = `${m.year}-${String(m.month).padStart(2, '0')}`
        const revenue = Number(m.revenue ?? 0)
        const netRevenue = Math.round(revenue * ADMIN_NET_REVENUE_RATE)
        return { month, revenue, netRevenue }
      })
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [overview])

  const topOrganizers = useMemo((): AdminTopOrganizerRow[] => {
    const src: TopOrganizer[] = overview?.top_organizers ?? []
    return src.map((o) => ({
      id: o.id,
      organizerName: o.organizer,
      email: o.email,
      ticketsSold: String(o.tickets_sold ?? ''),
      totalSales: Number((o as any).total_sales ?? 0),
    }))
  }, [overview])

  const revenueColumns = useMemo((): DataTableColumn<AdminRevenueMonthRow>[] => {
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

  const topOrganizerColumns = useMemo((): DataTableColumn<AdminTopOrganizerRow>[] => {
    return [
      {
        key: 'organizerName',
        header: 'Organizer',
        render: (r) => (
          <div className="min-w-[180px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.organizerName}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">{r.email}</div>
          </div>
        ),
      },
      {
        key: 'ticketsSold',
        header: 'Tickets sold',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{r.ticketsSold}</span>,
      },
      {
        key: 'totalSales',
        header: 'Total sales',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="font-semibold">
            {currencySymbol('NGN')}
            {formatNumber(r.totalSales)}
          </span>
        ),
      },
    ]
  }, [])

  const revenueThisMonth = useMemo(() => sfNumber(overview?.revenue_this_month ?? '0'), [overview?.revenue_this_month])
  const netRevenueThisMonth = useMemo(() => Math.round(revenueThisMonth * ADMIN_NET_REVENUE_RATE), [revenueThisMonth])

  if (loading) {
    return (
      <SidebarLayout>
        <AdminDashboardShimmer />
      </SidebarLayout>
    )
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin dashboard</h1>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t load dashboard overview right now.</p>
                <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</div>
              </div>
              <button
                type="button"
                onClick={() => setReloadToken((n) => n + 1)}
                className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            </div>
          </GlassCard>
        </div>
      </SidebarLayout>
    )
  }

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
                {formatNumber(revenueThisMonth)}
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
                {formatNumber(netRevenueThisMonth)}
              </>
            }
            sub="8% of gross revenue"
          />
          <StatCard title="Total events" value={formatNumber(overview?.total_events ?? 0)} sub="All time" />
          <StatCard title="Events this month" value={formatNumber(overview?.events_this_month ?? 0)} sub="Created this month" />
          <StatCard title="Total organizers" value={formatNumber(overview?.total_organizers ?? 0)} sub="Accounts" />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by month */}
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by month</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Last 12 months (gross + platform revenue).</p>
              </div>
            </div>

            <div className="mt-4">
              <DataTable<AdminRevenueMonthRow>
                columns={revenueColumns}
                rows={[...revenueByMonth].reverse()}
                rowKey={(r) => r.month}
                emptyTitle="No revenue yet"
                emptyDescription="Revenue will appear once tickets are sold."
              />
            </div>
          </GlassCard>

          {/* Top organizers */}
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top organizers</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">By tickets sold.</p>
              </div>
            </div>

            <div className="mt-4">
              <DataTable<AdminTopOrganizerRow>
                columns={topOrganizerColumns}
                rows={topOrganizers}
                rowKey={(r) => r.id}
                emptyTitle="No organizers yet"
                emptyDescription="Top organizers will show once ticket sales start."
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </SidebarLayout>
  )
}
