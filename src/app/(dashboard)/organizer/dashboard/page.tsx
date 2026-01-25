'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import { cn, currencySymbol, formatDate, formatNumber, getEndpoint, getErrorMessage } from '@lib/utils'
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  PlusCircleIcon,
  QrCodeIcon,
  TicketIcon,
} from '@heroicons/react/24/outline'
import GlassCard from '../../../../components/GlassCard'
import OrganizerDashboardShimmer from '../../../../components/dashboard/OrganizerDashboardShimmer'
import HTTP from '@lib/HTTP'
import type { ApiData, OrganizerEvent } from '@lib/types'

type QuickMetric = {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  icon: React.ReactNode
}

type EventStatus = 'Ended' | 'Draft' | 'Sold Out' | 'Published' | (string & {})

function normalizeStatus(status?: string): EventStatus {
  const s = (status ?? '').toLowerCase().trim()
  if (s === 'published') return 'Published'
  if (s === 'draft') return 'Draft'
  if (s === 'sold out' || s === 'sold_out' || s === 'soldout') return 'Sold Out'
  if (s === 'ended' || s === 'past') return 'Ended'
  return (status as any) ?? 'Published'
}

function statusPill(status: EventStatus) {
  if (status === 'Published') return 'bg-emerald-100 text-emerald-800'
  if (status === 'Draft') return 'bg-slate-100 text-slate-800'
  if (status === 'Sold Out') return 'bg-rose-100 text-rose-800'
  return 'bg-amber-100 text-amber-800'
}

export default function Page() {
  const currency: 'NGN' | 'USD' = 'NGN'

  const [events, setEvents] = useState<OrganizerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const now = useMemo(() => new Date(), [])

  const currentMonthLabel = useMemo(() => {
    // Uses the user/browser locale by default; falls back gracefully.
    try {
      return new Intl.DateTimeFormat(undefined, { month: 'short' }).format(now)
    } catch {
      return now.toLocaleString(undefined, { month: 'short' })
    }
  }, [now])

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<OrganizerEvent[]>, undefined>({
      url: getEndpoint('/dashboard/organizer/overview'),
      method: 'get',
    })

    if (!resp.ok) {
      setEvents([])
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    const payload = resp.data
    const list = (payload?.data ?? []) as OrganizerEvent[]

    setEvents(Array.isArray(list) ? list : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview, reloadToken])

  const derived = useMemo(() => {
    const rows = events.map((e) => {
      const status = normalizeStatus(e.status)
      const totalSold = Number(e.total_tickets_sold ?? 0)
      const totalRevenue = Number(e.total_revenue ?? 0)
      return { event: e, stats: { totalSold, totalRevenue }, status }
    })

    const totalEvents = rows.length
    const totalTicketsSold = rows.reduce((acc, r) => acc + r.stats.totalSold, 0)
    const totalRevenue = rows.reduce((acc, r) => acc + r.stats.totalRevenue, 0)
    const totalNetRevenue = Math.round(totalRevenue * 0.95)

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const upcoming = rows
      .filter((r) => new Date(r.event.date).getTime() >= todayStart)
      .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())

    const ended = rows
      .filter((r) => new Date(r.event.date).getTime() < todayStart)
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime())

    const topByTickets = [...rows].sort((a, b) => b.stats.totalSold - a.stats.totalSold).slice(0, 3)
    const topByRevenue = [...rows].sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue).slice(0, 3)

    const month = now.getMonth()
    const year = now.getFullYear()

    const eventsThisMonth = rows.filter((r) => {
      const d = new Date(r.event.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

    const revenueThisMonth = eventsThisMonth.reduce((acc, r) => acc + r.stats.totalRevenue, 0)

    return {
      rows,
      totalEvents,
      totalTicketsSold,
      totalRevenue,
      totalNetRevenue,
      upcoming,
      ended,
      topByTickets,
      topByRevenue,
      eventsThisMonth,
      revenueThisMonth,
    }
  }, [events, now])

  const [topMode, setTopMode] = useState<'tickets' | 'revenue'>('tickets')

  const metrics: QuickMetric[] = useMemo(
    () => [
      {
        label: 'Total revenue',
        value: (
          <>
            {currencySymbol(currency)}
            {formatNumber(derived.totalRevenue)}
          </>
        ),
        sub: (
          <span>
            Net: {currencySymbol(currency)}{formatNumber(derived.totalNetRevenue)} (-5%)
          </span>
        ),
        icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
      },
      {
        label: 'Tickets sold',
        value: formatNumber(derived.totalTicketsSold),
        sub: (
          <span>
            {formatNumber(derived.totalEvents)} event{derived.totalEvents === 1 ? '' : 's'}
          </span>
        ),
        icon: <TicketIcon className="w-5 h-5" />,
      },
      {
        label: 'Revenue this month',
        value: (
          <>
            {currencySymbol(currency)}
            {formatNumber(derived.revenueThisMonth)}
          </>
        ),
        sub: (
          <span>
            {formatNumber(derived.eventsThisMonth.length)} event{derived.eventsThisMonth.length === 1 ? '' : 's'} in {currentMonthLabel}
          </span>
        ),
        icon: <CalendarDaysIcon className="w-5 h-5" />,
      },
      {
        label: 'Upcoming events',
        value: formatNumber(derived.upcoming.length),
        sub: derived.upcoming[0] ? <span>Next: {formatDate(derived.upcoming[0].event.date)}</span> : <span>—</span>,
        icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
      },
    ],
    [currency, derived, currentMonthLabel]
  )

  const topRows = topMode === 'tickets' ? derived.topByTickets : derived.topByRevenue

  return (
    <SidebarLayout>
      {loading ? (
        <OrganizerDashboardShimmer />
      ) : error ? (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-red-700 dark:text-red-200">Couldn’t load overview</div>
                <div className="text-sm text-red-700/80 dark:text-red-200/80 mt-1">{error}</div>
              </div>
              <button
                type="button"
                onClick={() => setReloadToken((t) => t + 1)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Organizer Dashboard</h1>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Quick overview of your events, sales, and check-ins.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/organizer/events/new"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
              >
                <PlusCircleIcon className="w-5 h-5" />
                Create event
              </Link>

              <Link
                href="/organizer/revenue"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
              >
                <ArrowTrendingUpIcon className="w-5 h-5" />
                Revenue
              </Link>

              <Link
                href="/organizer/scan-qr"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
              >
                <QrCodeIcon className="w-5 h-5" />
                Scan QR
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <GlassCard key={m.label} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{m.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{m.value}</div>
                    {m.sub ? <div className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">{m.sub}</div> : null}
                  </div>
                  <div className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-2 text-gray-900 dark:text-white">
                    {m.icon}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming */}
            <GlassCard className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming events</h2>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">What’s next on your calendar.</p>
                </div>
                <Link href="/organizer/events" className="text-sm font-semibold text-sky-600 hover:underline">
                  View all
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {derived.upcoming.length === 0 ? (
                  <div className="md:col-span-2 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-6 text-center">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">No upcoming events</div>
                    <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create an event to start selling tickets.</div>
                  </div>
                ) : (
                  derived.upcoming.slice(0, 4).map(({ event, stats, status }) => (
                    <Link
                      key={event.id}
                      href={`/organizer/events/${event.id}`}
                      className="group rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 hover:bg-white/20"
                    >
                      <div className="flex items-start gap-3">
                        <img src={event.image ?? '/images/placeholder-event.svg'} alt={event.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:underline">{event.title}</div>
                          <div className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">{formatDate(event.date)} • {event.location}</div>
                        </div>
                        <span className={cn('shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold', statusPill(status))}>{status}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2">
                          <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">Tickets sold</div>
                          <div className="mt-1 font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalSold)}</div>
                        </div>
                        <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2">
                          <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">Revenue</div>
                          <div className="mt-1 font-bold text-gray-900 dark:text-white">{currencySymbol(currency)}{formatNumber(stats.totalRevenue)}</div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Top performers */}
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top performers</h2>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Your best performing events.</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTopMode('tickets')}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border',
                    topMode === 'tickets'
                      ? 'bg-brand-yellow text-white border-brand-yellow'
                      : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20',
                  )}
                >
                  Tickets
                </button>
                <button
                  type="button"
                  onClick={() => setTopMode('revenue')}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border',
                    topMode === 'revenue'
                      ? 'bg-brand-yellow text-white border-brand-yellow'
                      : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20',
                  )}
                >
                  Revenue
                </button>

                <Link href="/organizer/revenue" className="ml-auto text-xs font-semibold text-sky-600 hover:underline">
                  Details →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {topRows.map(({ event, stats }) => (
                  <Link
                    key={event.id}
                    href={`/organizer/events/${event.id}`}
                    className="group flex items-center gap-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 hover:bg-white/20"
                  >
                    <img src={event.image ?? '/images/placeholder-event.svg'} alt={event.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:underline">{event.title}</div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{event.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">{topMode === 'tickets' ? 'Tickets' : 'Revenue'}</div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {topMode === 'tickets'
                          ? formatNumber(stats.totalSold)
                          : `${currencySymbol(currency)}${formatNumber(stats.totalRevenue)}`}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-black/10 dark:border-white/10 pt-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Quick tools</div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <Link
                    href="/organizer/coupons"
                    className="inline-flex items-center justify-between rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                  >
                    <span>Manage coupons</span>
                    <span className="text-text-muted-light dark:text-text-muted-dark">→</span>
                  </Link>
                  <Link
                    href="/organizer/scan-qr"
                    className="inline-flex items-center justify-between rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                  >
                    <span>Check-in attendees</span>
                    <span className="text-text-muted-light dark:text-text-muted-dark">→</span>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Recent activity */}
          <GlassCard className="mt-6 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent activity</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">A tiny feed based on your events.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {derived.upcoming.slice(0, 2).map(({ event, stats }) => (
                <div key={event.id} className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Upcoming</div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">{event.title}</div>
                  <div className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">{formatDate(event.date)} • {event.time}</div>
                  <div className="mt-3 text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{formatNumber(stats.totalSold)}</span> tickets sold so far
                  </div>
                </div>
              ))}

              {derived.ended.slice(0, 1).map(({ event, stats }) => (
                <div key={event.id} className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Ended</div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">{event.title}</div>
                  <div className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">{formatDate(event.date)}</div>
                  <div className="mt-3 text-sm text-gray-900 dark:text-white">
                    Revenue: <span className="font-semibold">{currencySymbol(currency)}{formatNumber(stats.totalRevenue)}</span>
                  </div>
                </div>
              ))}

              {derived.ended.length === 0 && derived.upcoming.length === 0 ? (
                <div className="md:col-span-3 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-8 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">No activity yet</div>
                  <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create an event and start selling tickets.</div>
                </div>
              ) : null}
            </div>
          </GlassCard>
        </div>
      )}
    </SidebarLayout>
  )
}
