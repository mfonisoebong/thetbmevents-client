'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import SidebarLayout from '../../../../../components/layouts/SidebarLayout'
import { events as mockEvents } from '../../../../../lib/mockEvents'
import type { EventItem, Ticket } from '@lib/types'
import { cn, currencySymbol, formatDate, formatNumber } from '@lib/utils'
import { computeEventStats, eventStatus } from '@lib/eventStats'
import { exportToCsv } from '@lib/csv'
import { useTableSearch } from "../../../../../hooks/useTableSearch"
import DataTable from "../../../../../components/DataTable";

type TabKey = 'overview' | 'tickets' | 'orders' | 'attendees' | 'settings'

type OrderRow = {
  id: string
  customerName: string
  customerEmail: string
  items: string
  qty: number
  amount: number
  status: 'Paid' | 'Refunded'
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

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const FIRST_NAMES = ['Amina', 'Chidi', 'Zainab', 'Tunde', 'Ife', 'Kelechi', 'Seyi', 'Mariam', 'Emeka', 'Ada']
const LAST_NAMES = ['Okoro', 'Balogun', 'Ojo', 'Ibrahim', 'Eze', 'Adeniyi', 'Nwosu', 'Yakubu', 'Olawale', 'Umeh']

function makePerson(seed: number) {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length]
  const last = LAST_NAMES[(seed >> 3) % LAST_NAMES.length]
  const name = `${first} ${last}`
  const email = `${first}.${last}.${seed % 97}@example.com`.toLowerCase()
  return { name, email }
}

function pillClass(variant: 'success' | 'warning' | 'danger' | 'neutral') {
  if (variant === 'success') return 'bg-emerald-100 text-emerald-800'
  if (variant === 'warning') return 'bg-amber-100 text-amber-800'
  if (variant === 'danger') return 'bg-rose-100 text-rose-800'
  return 'bg-slate-100 text-slate-800'
}

function GlassCard({ title, value, sub }: { title: string; value: React.ReactNode; sub?: React.ReactNode }) {
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

  const event = useMemo(() => (id ? (mockEvents.find((e) => e.id === id) as EventItem | undefined) : undefined), [id])

  const stats = useMemo(() => (event ? computeEventStats(event) : null), [event])
  const status = useMemo(() => (event && stats ? eventStatus(event, stats) : null), [event, stats])

  const currency = event?.tickets?.[0]?.currency ?? 'NGN'

  const { attendees, orders, topCustomers } = useMemo(() => {
    if (!event) return { attendees: [] as AttendeeRow[], orders: [] as OrderRow[], topCustomers: [] as { name: string; email: string; tickets: number }[] }

    // Deterministic attendee + order generation based on ticket ids
    const rows: AttendeeRow[] = []
    const orderMap = new Map<string, { customerName: string; customerEmail: string; qty: number; amount: number; items: string[]; status: 'Paid' | 'Refunded'; date: string }>()

    for (const t of event.tickets ?? []) {
      const seedBase = hashStringToNumber(`${event.id}:${t.id}:attendees`)
      const soldApprox = (t.quantity === 0 ? (seedBase % 35) + 8 : Math.min(t.quantity, Math.round(((seedBase % 65) / 100) * t.quantity)))

      for (let i = 0; i < soldApprox; i++) {
        const seed = seedBase + i * 17
        const person = makePerson(seed)
        const orderId = `ORD-${event.id}-${(seed % 9000) + 1000}`
        const checkedIn = (seed % 5) === 0

        rows.push({
          id: `${event.id}-${t.id}-${i}`,
          name: person.name,
          email: person.email,
          ticketType: t.name,
          orderId,
          checkedIn,
        })

        // group attendees into orders
        const existing = orderMap.get(orderId)
        const status: 'Paid' | 'Refunded' = (seed % 23) === 0 ? 'Refunded' : 'Paid'
        const orderDate = new Date(new Date(event.date).getTime() - ((seed % 20) + 1) * 24 * 60 * 60 * 1000)
        const date = orderDate.toISOString().slice(0, 10)

        if (!existing) {
          orderMap.set(orderId, {
            customerName: person.name,
            customerEmail: person.email,
            qty: 1,
            amount: (t.price ?? 0),
            items: [t.name],
            status,
            date,
          })
        } else {
          existing.qty += 1
          existing.amount += (t.price ?? 0)
          if (!existing.items.includes(t.name)) existing.items.push(t.name)
        }
      }
    }

    const orders: OrderRow[] = Array.from(orderMap.entries())
      .map(([id, o]) => ({
        id,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        qty: o.qty,
        amount: o.amount,
        items: o.items.join(', '),
        status: o.status,
        date: o.date,
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    // Top customers by tickets bought
    const counts = new Map<string, { name: string; email: string; tickets: number }>()
    for (const a of rows) {
      const key = a.email
      const prev = counts.get(key)
      if (prev) prev.tickets += 1
      else counts.set(key, { name: a.name, email: a.email, tickets: 1 })
    }

    const topCustomers = Array.from(counts.values())
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 6)

    return { attendees: rows, orders, topCustomers }
  }, [event])

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

  if (!event || !stats || !status) {
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

  const headerStatusClass = status === 'Published' ? pillClass('success') : status === 'Draft' ? pillClass('neutral') : status === 'Sold Out' ? pillClass('danger') : pillClass('warning')

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
                <div>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</div>
                {event.location ? <div className="mt-1">{event.location}</div> : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link target="_blank" href={`/events/${event.id}`} className="inline-flex items-center rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20">
                View public
              </Link>
              <Link href={`/dashboard/organizer/events/${event.id}/edit`} className="inline-flex items-center rounded-lg bg-brand-teal px-3 py-2 text-sm font-medium text-white hover:opacity-95">
                Edit event
              </Link>
              <button onClick={onCopyPublicLink} className="inline-flex items-center rounded-lg bg-brand-yellow px-3 py-2 text-sm font-medium text-white">
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
                <GlassCard title="Revenue" value={<>{currencySymbol(currency)}{formatNumber(stats.totalRevenue)}</>} sub="Gross ticket revenue" />
                <GlassCard title="Net revenue" value={<>{currencySymbol(currency)}{formatNumber(netRevenue)}</>} sub="Estimated after 5% platform fee" />
                <GlassCard title="Tickets sold" value={<>{formatNumber(stats.totalSold)}</>} sub={stats.hasUnlimited ? 'Unlimited capacity' : `${formatNumber(stats.totalAvailable)} total available`} />
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
                        <div key={c.email} className="flex items-center justify-between rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{c.email}</div>
                          </div>
                          <div className="text-right">
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

          {tab === 'tickets' ? (
            <TicketsPanel event={event} currency={currency} />
          ) : null}

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
                  { key: 'customer', header: 'Customer', render: (o) => (
                      <div>
                        <div className="font-semibold">{o.customerName}</div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{o.customerEmail}</div>
                      </div>
                    )
                  },
                  { key: 'items', header: 'Items', render: (o) => <span className="text-sm">{o.items}</span> },
                  { key: 'qty', header: 'Qty', className: 'whitespace-nowrap', render: (o) => formatNumber(o.qty) },
                  { key: 'amount', header: 'Amount', className: 'whitespace-nowrap', render: (o) => (
                      <span className="font-semibold">{currencySymbol(currency)}{formatNumber(o.amount)}</span>
                    )
                  },
                  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (o) => (
                      <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', o.status === 'Paid' ? pillClass('success') : pillClass('warning'))}>{o.status}</span>
                    )
                  },
                  { key: 'date', header: 'Date', className: 'whitespace-nowrap', render: (o) => formatDate(o.date) },
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
                  { key: 'order', header: 'Order ID', render: (a) => <span className="font-mono text-xs">{a.orderId}</span> },
                  { key: 'checkin', header: 'Check-in status', className: 'whitespace-nowrap', render: (a) => (
                      <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', a.checkedIn ? pillClass('success') : pillClass('neutral'))}>
                        {a.checkedIn ? 'Checked in' : 'Not checked in'}
                      </span>
                    )
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
                      // This is a client-only mock. In a real app this calls an API.
                      const target = (manualOrderId || manualEmail).trim().toLowerCase()
                      if (!target) return
                      const match = attendees.find((a) => a.orderId.toLowerCase() === target || a.email.toLowerCase() === target)
                      if (match) alert(`Checked in: ${match.name}`)
                      else alert('No attendee found for that Order ID / Email')
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

          {tab === 'settings' ? (
            <SettingsPanel event={event} />
          ) : null}
        </div>
      </div>
    </SidebarLayout>
  )
}

function TicketsPanel({ event, currency }: { event: EventItem; currency: string }) {
  const [editEndDateForTicketId, setEditEndDateForTicketId] = useState<string | null>(null)
  const [endSellingDate, setEndSellingDate] = useState('')
  const [deleted, setDeleted] = useState<Record<string, boolean>>({})

  const rows = (event.tickets ?? []).filter((t) => !deleted[t.id])

  const statsByTicket = useMemo(() => {
    const map = new Map<string, { sold: number; revenue: number }>()
    for (const t of rows) {
      const seed = hashStringToNumber(`${event.id}:${t.id}:sold`)
      const sold = t.quantity === 0 ? (seed % 40) + 6 : Math.min(t.quantity, Math.round(((seed % 70) / 100) * t.quantity))
      map.set(t.id, { sold, revenue: sold * t.price })
    }
    return map
  }, [event.id, rows])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tickets</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage ticket types, sales and selling dates.</p>
      </div>

      <DataTable<Ticket>
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
          { key: 'price', header: 'Price', className: 'whitespace-nowrap', render: (t) => (
              <span className="font-semibold">{t.price === 0 ? 'Free' : `${currencySymbol(currency)}${formatNumber(t.price)}`}</span>
            )
          },
          { key: 'sales', header: 'Sales', className: 'whitespace-nowrap', render: (t) => {
              const s = statsByTicket.get(t.id)!
              const cap = t.quantity === 0 ? '∞' : formatNumber(t.quantity)
              return (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(s.sold)} / {cap}</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Revenue: {currencySymbol(currency)}{formatNumber(s.revenue)}</div>
                </div>
              )
            }
          },
          { key: 'dates', header: 'Selling window', className: 'whitespace-nowrap', render: (t) => (
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                <div>Start: <span className="text-gray-900 dark:text-white font-semibold">{formatDate(t.start_selling_date)}</span></div>
                <div>End: <span className="text-gray-900 dark:text-white font-semibold">{formatDate(t.end_selling_date)}</span></div>
              </div>
            )
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
        rows={rows}
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
            <button type="button" onClick={() => setEditEndDateForTicketId(null)} className="text-sm text-sky-600 hover:underline">Close</button>
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

function SettingsPanel({ event }: { event: EventItem }) {
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description ?? '')
  const [date, setDate] = useState(event.date)
  const [time, setTime] = useState(event.time ?? '')
  const [location, setLocation] = useState(event.location ?? '')
  const [category, setCategory] = useState(event.category)

  // todo: re-upload image

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

