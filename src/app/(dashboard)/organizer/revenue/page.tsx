'use client'

import React, { useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import { events as mockEvents } from '../../../../lib/mockEvents'
import { computeEventStats } from '@lib/eventStats'
import type { EventItem } from '@lib/types'
import { cn, currencySymbol, formatNumber } from '@lib/utils'
import Link from 'next/link'
import { ArrowTrendingUpIcon, ArrowsUpDownIcon, CalendarDaysIcon, SparklesIcon } from '@heroicons/react/24/outline'
import GlassCard from "../../../../components/GlassCard";

type SortKey = 'ticketsSold' | 'revenue'

type SortOrder = 'desc' | 'asc'

type MonthPoint = {
  key: string
  label: string
  value: number
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
          {subtitle ? <div className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">{subtitle}</div> : null}
        </div>
        {icon ? <div className="shrink-0 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-2 text-gray-900 dark:text-white">{icon}</div> : null}
      </div>
    </GlassCard>
  )
}

function monthLabel(i: number) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i] ?? '—'
}

function buildDeterministicMonthlySeries(total: number, year: number) {
  // Make a deterministic looking distribution (no random api calls) that sums to `total`.
  // This is demo data; later you can swap with backend analytics.
  const weights = [7, 6, 8, 9, 10, 11, 12, 10, 9, 8, 7, 6]
  const sumW = weights.reduce((a, b) => a + b, 0)

  // Slightly skew by year so it doesn't look identical forever.
  const bump = (year % 5) - 2

  let remaining = Math.max(0, Math.round(total))
  const values = weights.map((w, idx) => {
    const adjusted = Math.max(1, w + (idx % 2 === 0 ? bump : -bump))
    const v = Math.floor((adjusted / sumW) * total)
    remaining -= v
    return v
  })

  // Put leftover into current month (Jan date context says current month is Jan).
  values[0] = Math.max(0, values[0] + remaining)

  return values
}

function BarChart({
  points,
  currency,
}: {
  points: MonthPoint[]
  currency: 'NGN' | 'USD'
}) {
  const max = Math.max(...points.map((p) => p.value), 1)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by month</h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">A quick view of your revenue across the year.</p>
        </div>
        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{currency === 'NGN' ? '₦' : '$'} values</div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-2 items-end h-48">
        {points.map((p) => {
          const h = Math.round((p.value / max) * 100)

          return (
            <div key={p.key} className="col-span-3 sm:col-span-1 flex flex-col items-center gap-2">
              <div className="w-full group relative">
                <div
                  className={cn(
                    'w-full rounded-xl border border-black/10 dark:border-white/10 backdrop-blur-sm',
                    'bg-gradient-to-b from-brand-yellow/80 to-brand-yellow/30',
                    'dark:from-brand-yellow/70 dark:to-brand-yellow/20'
                  )}
                  style={{ height: `${Math.max(6, h)}%` }}
                />

                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-lg bg-black/80 text-white text-xs px-3 py-2 shadow-lg whitespace-nowrap">
                    <div className="font-semibold">{p.label}</div>
                    <div>
                      {currencySymbol(currency)}
                      {formatNumber(p.value)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{p.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrganizerRevenuePage() {
  // Current date context: Jan 20, 2026
  const currentYear = 2026
  const currentMonthIndex = 0 // Jan

  const currency: 'NGN' | 'USD' = 'NGN'

  const events = useMemo(() => mockEvents, [])

  const eventRows = useMemo(() => {
    return events.map((e: EventItem) => {
      const s = computeEventStats(e)
      return {
        id: e.id,
        title: e.title,
        category: e.category,
        image: e.image ?? '/images/placeholder-event.svg',
        ticketsSold: s.totalSold,
        revenue: s.totalRevenue,
      }
    })
  }, [events])

  const totalRevenue = useMemo(() => eventRows.reduce((acc, r) => acc + r.revenue, 0), [eventRows])
  const totalNetRevenue = useMemo(() => Math.round(totalRevenue * 0.95), [totalRevenue])

  const monthlyValues = useMemo(() => buildDeterministicMonthlySeries(totalRevenue, currentYear), [totalRevenue, currentYear])
  const revenueThisMonth = useMemo(() => monthlyValues[currentMonthIndex] ?? 0, [monthlyValues, currentMonthIndex])

  const monthPoints: MonthPoint[] = useMemo(
    () =>
      monthlyValues.map((v, i) => ({
        key: `${currentYear}-${i + 1}`,
        label: monthLabel(i),
        value: v,
      })),
    [monthlyValues, currentYear]
  )

  const [sortKey, setSortKey] = useState<SortKey>('ticketsSold')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const sortedEvents = useMemo(() => {
    const rows = [...eventRows]
    rows.sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number)
      return sortOrder === 'asc' ? diff : -diff
    })
    return rows
  }, [eventRows, sortKey, sortOrder])

  const topEvent = sortedEvents[0]

  const bestMonth = useMemo(() => {
    let idx = 0
    let max = -Infinity
    for (let i = 0; i < monthlyValues.length; i++) {
      if (monthlyValues[i] > max) {
        max = monthlyValues[i]
        idx = i
      }
    }
    return { label: monthLabel(idx), value: max }
  }, [monthlyValues])

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Revenue</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Your earnings overview — clean, quick, and beautiful.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/organizer/events"
              className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
            >
              View events
            </Link>
            <button
              type="button"
              onClick={() => console.log('Payouts coming soon')}
              className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
            >
              Request payout
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total revenue"
            value={
              <>
                {currencySymbol(currency)}
                {formatNumber(totalRevenue)}
              </>
            }
            subtitle="Sum of all ticket sales (demo)."
            icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
          />

          <StatCard
            title="Total net revenue"
            value={
              <>
                {currencySymbol(currency)}
                {formatNumber(totalNetRevenue)}
              </>
            }
            subtitle="After platform fee (-5%)."
            icon={<SparklesIcon className="w-5 h-5" />}
          />

          <StatCard
            title="Revenue this month"
            value={
              <>
                {currencySymbol(currency)}
                {formatNumber(revenueThisMonth)}
              </>
            }
            subtitle={
              <span className="inline-flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" /> {monthLabel(currentMonthIndex)} {currentYear}
              </span>
            }
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-6">
            <BarChart points={monthPoints} currency={currency} />
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Best month</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Your highest revenue month this year.</p>
              <div className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">{bestMonth.label}</div>
              <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                {currencySymbol(currency)}
                {formatNumber(bestMonth.value)}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Highest selling event</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Based on the sorting mode you pick.</p>

              {topEvent ? (
                <div className="mt-4">
                  <Link
                    href={`/organizer/events/${topEvent.id}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 hover:bg-white/20"
                  >
                    <img src={topEvent.image} alt={topEvent.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:underline">{topEvent.title}</div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{topEvent.category}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {sortKey === 'ticketsSold' ? 'Tickets sold' : 'Revenue'}
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {sortKey === 'ticketsSold'
                          ? formatNumber(topEvent.ticketsSold)
                          : `${currencySymbol(currency)}${formatNumber(topEvent.revenue)}`}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark mr-1">Sort</div>

                    <button
                      type="button"
                      onClick={() => setSortKey('ticketsSold')}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur-sm',
                        sortKey === 'ticketsSold'
                          ? 'bg-brand-yellow text-white border-brand-yellow'
                          : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                      )}
                    >
                      Tickets
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortKey('revenue')}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur-sm',
                        sortKey === 'revenue'
                          ? 'bg-brand-yellow text-white border-brand-yellow'
                          : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                      )}
                    >
                      Revenue
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
                      className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                      title="Toggle sorting order"
                    >
                      <ArrowsUpDownIcon className="w-4 h-4" />
                      {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">No events found.</div>
              )}
            </GlassCard>
          </div>
        </div>

        <GlassCard className="mt-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leaderboard</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Top events by your chosen sort mode.</p>
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Showing {Math.min(5, sortedEvents.length)} of {sortedEvents.length}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedEvents.slice(0, 6).map((ev) => (
              <Link
                key={ev.id}
                href={`/organizer/events/${ev.id}`}
                className="group rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 hover:bg-white/20"
              >
                <div className="flex items-center gap-3">
                  <img src={ev.image} alt={ev.title} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:underline">{ev.title}</div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{ev.category}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2">
                    <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">Tickets</div>
                    <div className="mt-1 font-bold text-gray-900 dark:text-white">{formatNumber(ev.ticketsSold)}</div>
                  </div>
                  <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2">
                    <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">Revenue</div>
                    <div className="mt-1 font-bold text-gray-900 dark:text-white">
                      {currencySymbol(currency)}
                      {formatNumber(ev.revenue)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
