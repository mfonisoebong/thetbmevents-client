'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import SidebarLayout from '../../../../../components/layouts/SidebarLayout'
import type { ApiData, OrganizerEvent, OrdersAndAttendees } from '@lib/types'
import { cn, currencySymbol, formatDate, formatNumber, getEndpoint, getErrorMessage } from '@lib/utils'
import { exportToCsv } from '@lib/csv'
import { useTableSearch } from '../../../../../hooks/useTableSearch'
import DataTable from '../../../../../components/DataTable'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import OrganizerEventDetailsShimmer from '../../../../../components/dashboard/OrganizerEventDetailsShimmer'
import GlassCard from '../../../../../components/GlassCard'
import HTTP from '@lib/HTTP'
import { computeEventStatsFromApi } from '@lib/eventStats'

type TabKey = 'overview' | 'tickets' | 'orders' | 'attendees' | 'settings'

type OrderRow = {
  id: string
  customerName: string
  customerEmail: string
  items: string
  qty: number
  amount: number
  status: string
  date: string
}

type AttendeeRow = {
  id: string
  name: string
  email: string
  ticketType: string
  orderId: string
  checkedIn: boolean
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

function pillClass(variant: 'success' | 'warning' | 'danger' | 'neutral') {
  if (variant === 'success') return 'bg-emerald-100 text-emerald-800'

  if (variant === 'warning') return 'bg-amber-100 text-amber-800'

  if (variant === 'danger') return 'bg-rose-100 text-rose-800'

  return 'bg-slate-100 text-slate-800'
}

function StatCard({ title, value, sub }: { title: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{sub}</div> : null}
    </div>
  )
}

export default function OrganizerEventDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams<{ id?: string | string[] }>()

  const id = useMemo(() => {
    const raw = routeParams?.id
    return Array.isArray(raw) ? raw[0] : raw
  }, [routeParams?.id])

  const [copied, setCopied] = useState(false)
  const [manualOrderId, setManualOrderId] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [blastSubject, setBlastSubject] = useState('')
  const [blastBody, setBlastBody] = useState('')

  const tab = (searchParams.get('tab') as TabKey) || 'overview'

  const [event, setEvent] = useState<OrganizerEvent | null>(null)
  const [ordersAndAttendees, setOrdersAndAttendees] = useState<OrdersAndAttendees | null>(null)

  const [loadingOverview, setLoadingOverview] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const loadOverview = useCallback(async () => {
    if (!id) return

    setLoadingOverview(true)
    setError(null)

    const resp = await HTTP<ApiData<OrganizerEvent[]>, undefined>({
      url: getEndpoint('/dashboard/organizer/overview'),
      method: 'get',
    })

    if (!resp.ok) {
      setEvent(null)
      setError(getErrorMessage(resp.error))
      setLoadingOverview(false)
      return
    }

    const list = resp.data?.data ?? []
    const found = Array.isArray(list) ? list.find((e) => String(e.id) === String(id)) ?? null : null

    setEvent(found)
    setLoadingOverview(false)
  }, [id])

  const loadOrdersAndAttendees = useCallback(async () => {
    if (!id) return

    setLoadingOrders(true)

    const resp = await HTTP<ApiData<OrdersAndAttendees>, undefined>({
      url: getEndpoint(`/dashboard/organizer/event-orders-and-attendees/${encodeURIComponent(id)}`),
      method: 'get',
    })

    if (!resp.ok) {
      setOrdersAndAttendees(null)
      setError(getErrorMessage(resp.error))
      setLoadingOrders(false)
      return
    }

    setOrdersAndAttendees(resp.data?.data ?? null)
    setLoadingOrders(false)
  }, [id])

  useEffect(() => {
    // reset between event id changes or retries
    setEvent(null)
    setOrdersAndAttendees(null)
    setError(null)
    setLoadingOverview(true)
    setLoadingOrders(true)

    loadOverview()
    loadOrdersAndAttendees()
  }, [loadOverview, loadOrdersAndAttendees, reloadToken])

  const loading = loadingOverview || loadingOrders

  const currency = useMemo(() => {
    const firstTicket = event?.tickets?.[0]
    return firstTicket?.currency ?? 'NGN'
  }, [event])

  const status = useMemo(() => normalizeStatus(event?.status), [event])

  const stats = useMemo(() => {
    if (!event) return null
    return computeEventStatsFromApi(event)
  }, [event])

  const { attendees, orders, topCustomers } = useMemo(() => {
    const api = ordersAndAttendees

    const aRows: AttendeeRow[] = (api?.attendees ?? []).map((a) => ({
      id: String(a.id),
      name: a.full_name,
      email: a.email,
      ticketType: a.ticket_name,
      orderId: '',
      checkedIn: Boolean(a.checked_in),
    }))

    const oRows: OrderRow[] = (api?.orders ?? []).map((o) => ({
      id: o.id,
      customerName: o.customer?.full_name ?? '',
      customerEmail: o.customer?.email ?? '',
      items: (o.items ?? []).join(', '),
      qty: Number(o.quantity ?? 0),
      amount: Number(o.amount ?? 0),
      status: o.status ?? 'Paid',
      date: '',
    }))

    const counts = new Map<string, { name: string; email: string; tickets: number }>()
    for (const o of (api?.orders ?? [])) {
      const email = o.customer?.email ?? ''
      if (!email) continue
      const prev = counts.get(email)
      if (prev) prev.tickets += Number(o.quantity ?? 0)
      else counts.set(email, { name: o.customer?.full_name ?? '', email, tickets: Number(o.quantity ?? 0) })
    }

    const top = Array.from(counts.values())
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 6)

    return { attendees: aRows, orders: oRows, topCustomers: top }
  }, [ordersAndAttendees])

  const attendeeSearch = useTableSearch(attendees, (row, q) => {
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.ticketType.toLowerCase().includes(q) ||
      row.orderId.toLowerCase().includes(q)
    )
  })

  const orderSearch = useTableSearch(orders, (row, q) => {
    return (
      row.id.toLowerCase().includes(q) ||
      row.customerName.toLowerCase().includes(q) ||
      row.customerEmail.toLowerCase().includes(q) ||
      row.items.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q)
    )
  })

  function setTab(next: TabKey) {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('tab', next)
    router.replace(`?${nextParams.toString()}`)
  }

  function onCopyPublicLink() {
    try {
      if (!event) return
      const url = `${window.location.origin}/events/${event.id}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <SidebarLayout>
        <OrganizerEventDetailsShimmer />
      </SidebarLayout>
    )
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-red-700 dark:text-red-200">Couldn’t load this event</div>
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
      </SidebarLayout>
    )
  }

  if (!event || !stats) {
    return (
      <SidebarLayout>
        <div className="w-full max-w-5xl mx-auto px-6 py-8">
          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Event not found</h1>
            <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t find an event with that ID.</p>
            <div className="mt-4">
              <Link href="/dashboard/organizer/events" className="text-sm text-sky-600 hover:underline">← Back to events</Link>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  const headerStatusClass =
    status === 'Published' ? pillClass('success') : status === 'Draft' ? pillClass('neutral') : status === 'Sold Out' ? pillClass('danger') : pillClass('warning')

  const netRevenue = Math.round(stats.totalRevenue * 0.95)

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{event.title}</h1>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', headerStatusClass)}>{status}</span>
              </div>
              <div className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <div>
                  {formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}
                </div>
                {event.location ? <div className="mt-1">{event.location}</div> : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                target="_blank"
                href={`/events/${event.id}`}
                className="inline-flex items-center rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20"
              >
                View public
              </Link>
              <button onClick={onCopyPublicLink} className="inline-flex items-center rounded-lg bg-brand-yellow px-3 py-2 text-sm font-medium text-white">
                <ClipboardIcon className="w-4 h-4 mr-1" />
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-2">
            <nav className="flex flex-wrap gap-2">
              {([
                ['overview', 'Overview'],
                ['tickets', 'Tickets'],
                ['orders', 'Orders'],
                ['attendees', 'Attendees'],
                ['settings', 'Settings'],
              ] as Array<[TabKey, string]>).map(([key, label]) => {
                const active = tab === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-semibold transition',
                      active
                        ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
                        : 'text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/5'
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Panels */}
        <div className="mt-6">
          {tab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Revenue" value={<>{currencySymbol(currency)}{formatNumber(stats.totalRevenue)}</>} sub="Gross ticket revenue" />
                <StatCard title="Net revenue" value={<>{currencySymbol(currency)}{formatNumber(netRevenue)}</>} sub="Estimated after 5% platform fee" />
                <StatCard
                  title="Tickets sold"
                  value={<>{formatNumber(stats.totalSold)}</>}
                  sub={stats.hasUnlimited ? 'Unlimited capacity' : `${formatNumber(stats.totalAvailable)} total available`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top customers</h2>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">People who bought the most tickets.</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topCustomers.length === 0 ? (
                      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">No sales yet.</div>
                    ) : (
                      topCustomers.map((c) => (
                        <div
                          key={c.email}
                          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 overflow-hidden"
                        >
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{c.email}</div>
                          </div>

                          <div className="max-sm:mt-4 sm:text-right">
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Tickets</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{c.tickets}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick insights</h2>
                  <div className="mt-4 space-y-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                    <div className="flex items-center justify-between">
                      <span>Ticket types</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{event.tickets.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Category</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{event.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Online event</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{event.isOnline ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'tickets' ? <TicketsPanel event={event} currency={currency} /> : null}

          {tab === 'orders' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orders</h2>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">All purchases for this event.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={orderSearch.query}
                    onChange={(e) => orderSearch.setQuery(e.target.value)}
                    placeholder="Search orders…"
                    className="w-full sm:w-72 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      exportToCsv(
                        `orders-${event.id}`,
                        orderSearch.filtered.map((o) => ({
                          order_id: o.id,
                          customer_name: o.customerName,
                          customer_email: o.customerEmail,
                          items: o.items,
                          quantity: o.qty,
                          amount: o.amount,
                          status: o.status,
                          date: o.date,
                        })),
                        [
                          { key: 'order_id', header: 'Order ID' },
                          { key: 'customer_name', header: 'Customer' },
                          { key: 'customer_email', header: 'Email' },
                          { key: 'items', header: 'Items' },
                          { key: 'quantity', header: 'Qty' },
                          { key: 'amount', header: 'Amount' },
                          { key: 'status', header: 'Status' },
                          { key: 'date', header: 'Date' },
                        ]
                      )
                    }}
                    className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <DataTable<OrderRow>
                columns={[
                  { key: 'id', header: 'Order ID', render: (o) => <span className="font-mono text-xs">{o.id}</span> },
                  {
                    key: 'customer',
                    header: 'Customer',
                    render: (o) => (
                      <div>
                        <div className="font-semibold">{o.customerName}</div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{o.customerEmail}</div>
                      </div>
                    ),
                  },
                  { key: 'items', header: 'Items', render: (o) => <span className="text-sm">{o.items}</span> },
                  { key: 'qty', header: 'Qty', className: 'whitespace-nowrap', render: (o) => formatNumber(o.qty) },
                  {
                    key: 'amount',
                    header: 'Amount',
                    className: 'whitespace-nowrap',
                    render: (o) => <span className="font-semibold">{currencySymbol(currency)}{formatNumber(o.amount)}</span>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    className: 'whitespace-nowrap',
                    render: (o) => (
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          String(o.status).toLowerCase().includes('refund') ? pillClass('warning') : pillClass('success')
                        )}
                      >
                        {o.status}
                      </span>
                    ),
                  },
                  { key: 'date', header: 'Date', className: 'whitespace-nowrap', render: (o) => (o.date ? formatDate(o.date) : '—') },
                ]}
                rows={orderSearch.filtered}
                rowKey={(o) => o.id}
                emptyTitle="No orders"
                emptyDescription="When people buy tickets, you’ll see the orders here."
              />
            </div>
          ) : null}

          {tab === 'attendees' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attendees</h2>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Everyone who has a ticket for this event.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={attendeeSearch.query}
                    onChange={(e) => attendeeSearch.setQuery(e.target.value)}
                    placeholder="Search attendees…"
                    className="w-full sm:w-72 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      exportToCsv(
                        `attendees-${event.id}`,
                        attendeeSearch.filtered.map((a) => ({
                          name: a.name,
                          email: a.email,
                          ticket_type: a.ticketType,
                          order_id: a.orderId,
                          check_in_status: a.checkedIn ? 'Checked in' : 'Not checked in',
                        })),
                        [
                          { key: 'name', header: 'Name' },
                          { key: 'email', header: 'Email' },
                          { key: 'ticket_type', header: 'Ticket type' },
                          { key: 'order_id', header: 'Order ID' },
                          { key: 'check_in_status', header: 'Check-in status' },
                        ]
                      )
                    }}
                    className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <DataTable<AttendeeRow>
                columns={[
                  { key: 'name', header: 'Name', render: (a) => <span className="font-semibold">{a.name}</span> },
                  { key: 'email', header: 'Email', render: (a) => <span className="text-sm">{a.email}</span> },
                  { key: 'ticket', header: 'Ticket type', render: (a) => a.ticketType },
                  {
                    key: 'checkin',
                    header: 'Check-in status',
                    className: 'whitespace-nowrap',
                    render: (a) => (
                      <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', a.checkedIn ? pillClass('success') : pillClass('neutral'))}>
                        {a.checkedIn ? 'Checked in' : 'Not checked in'}
                      </span>
                    ),
                  },
                ]}
                rows={attendeeSearch.filtered}
                rowKey={(a) => a.id}
                emptyTitle="No attendees"
                emptyDescription="Attendees will show up after someone gets a ticket."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Manual check-in */}
                <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Manual check-in</h3>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Enter an order ID (or email) to mark an attendee as checked in. (Demo only)</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={manualOrderId}
                      onChange={(e) => setManualOrderId(e.target.value)}
                      placeholder="Order ID"
                      className="rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                    <input
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      placeholder="Email"
                      className="rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert('This check-in tool is still demo-only. Wire it to your API to persist.')
                    }}
                    className="mt-3 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                  >
                    Check in
                  </button>
                </div>

                {/* Blast email */}
                <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Blast email</h3>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Send a message to attendees. (Demo UI — wire to your email provider later)</p>

                  <div className="mt-4 space-y-3">
                    <input
                      value={blastSubject}
                      onChange={(e) => setBlastSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                    <textarea
                      value={blastBody}
                      onChange={(e) => setBlastBody(e.target.value)}
                      placeholder="Write your message…"
                      rows={4}
                      className="w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const recipients = attendeeSearch.filtered.length
                        if (!blastSubject.trim() || !blastBody.trim()) return
                        alert(`Blast email queued to ${recipients} attendees (demo).`)
                        setBlastSubject('')
                        setBlastBody('')
                      }}
                      className="rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                      Send blast email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'settings' ? <SettingsPanel event={event} /> : null}
        </div>
      </div>
    </SidebarLayout>
  )
}

function TicketsPanel({ event, currency }: { event: OrganizerEvent; currency: string }) {
  // Tickets now use API-provided sold counts rather than deterministic demo logic.
  const [editEndDateForTicketId, setEditEndDateForTicketId] = useState<string | null>(null)
  const [endSellingDate, setEndSellingDate] = useState('')
  const [deleted, setDeleted] = useState<Record<string, boolean>>({})

  const rows = (event.tickets ?? []).filter((t) => !deleted[t.id])

  const statsByTicket = useMemo(() => {
    const map = new Map<string, { sold: number; revenue: number }>()
    for (const t of rows) {
      const sold = Number((t as any).sold ?? 0)
      map.set(t.id, { sold, revenue: sold * Number(t.price ?? 0) })
    }
    return map
  }, [rows])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tickets</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage ticket types, sales and selling dates.</p>
      </div>

      <DataTable<any>
        columns={[
          {
            key: 'name',
            header: 'Ticket',
            render: (t) => (
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                {t.description ? <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">{t.description}</div> : null}
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Price',
            className: 'whitespace-nowrap',
            render: (t) => <span className="font-semibold">{t.price === 0 ? 'Free' : `${currencySymbol(currency)}${formatNumber(t.price)}`}</span>,
          },
          {
            key: 'sales',
            header: 'Sales',
            className: 'whitespace-nowrap',
            render: (t) => {
              const s = statsByTicket.get(t.id) || { sold: 0, revenue: 0 }
              const cap = Number(t.quantity) === 0 ? '∞' : formatNumber(t.quantity)
              return (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(s.sold)} / {cap}</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Revenue: {currencySymbol(currency)}{formatNumber(s.revenue)}</div>
                </div>
              )
            },
          },
          {
            key: 'dates',
            header: 'Selling window',
            className: 'whitespace-nowrap',
            render: (t) => (
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                <div>
                  Start: <span className="text-gray-900 dark:text-white font-semibold">{formatDate(t.start_selling_date)}</span>
                </div>
                <div>
                  End: <span className="text-gray-900 dark:text-white font-semibold">{formatDate(t.end_selling_date)}</span>
                </div>
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'whitespace-nowrap',
            render: (t) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditEndDateForTicketId(t.id)
                    setEndSellingDate(t.end_selling_date)
                  }}
                  className="rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                >
                  Edit end date
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this ticket type? (Demo only)')) setDeleted((d) => ({ ...d, [t.id]: true }))
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        rows={rows as any}
        rowKey={(t) => t.id}
        emptyTitle="No tickets"
        emptyDescription="Create your first ticket type to start selling."
      />

      {editEndDateForTicketId ? (
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit end selling date</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">This only updates local UI for now.</p>
            </div>
            <button type="button" onClick={() => setEditEndDateForTicketId(null)} className="text-sm text-sky-600 hover:underline">
              Close
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              value={endSellingDate}
              onChange={(e) => setEndSellingDate(e.target.value)}
              className="rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              type="button"
              onClick={() => {
                alert('Saved (demo). Wire this to your API to persist the change.')
                setEditEndDateForTicketId(null)
              }}
              className="rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SettingsPanel({ event }: { event: OrganizerEvent }) {
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description ?? '')
  const [date, setDate] = useState(event.date)
  const [time, setTime] = useState(event.time ?? '')
  const [location, setLocation] = useState(event.location ?? '')
  const [category, setCategory] = useState(event.category)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Update event details and save changes.</p>
      </div>

      <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Time</label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 19:00"
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setTitle(event.title)
              setDescription(event.description ?? '')
              setDate(event.date)
              setTime(event.time ?? '')
              setLocation(event.location ?? '')
              setCategory(event.category)
            }}
            className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              alert('Saved (demo). Wire this to your API to persist changes.')
            }}
            className="rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

