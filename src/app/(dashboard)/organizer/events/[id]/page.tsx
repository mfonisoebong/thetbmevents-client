'use client'

import React, { useMemo, useState, useEffect, useCallback, useRef, useReducer } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import SidebarLayout from '../../../../../components/layouts/SidebarLayout'
import type { ApiData, OrganizerEvent, OrdersAndAttendees } from '@lib/types'
import {
  cn,
  currencySymbol,
  formatDate,
  formatNumber,
  formatTime,
  getEndpoint,
  getErrorMessage,
  toDateTimeLocalValue
} from '@lib/utils'
import { exportToCsv } from '@lib/csv'
import { useTableSearch } from '../../../../../hooks/useTableSearch'
import DataTable from '../../../../../components/DataTable'
import { ClipboardIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import QRCode from 'qrcode'
import OrganizerEventDetailsShimmer from '../../../../../components/dashboard/OrganizerEventDetailsShimmer'
import GlassCard from '../../../../../components/GlassCard'
import HTTP from '@lib/HTTP'
import { computeEventStatsFromApi } from '@lib/eventStats'
import 'react-quill-new/dist/quill.snow.css';
import dynamic from 'next/dynamic'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { successToast, errorToast } from "@components/Toast";
import sanitizeHtml from "sanitize-html";
import { categories as mockCategories } from '@lib/mockEvents'

const ReactQuill = dynamic(() => import('react-quill-new'), {ssr: false})

type TabKey = 'overview' | 'tickets' | 'orders' | 'attendees' | 'settings'

type OrderRow = {
  id: string
  reference: string
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
  ticketBoughtCount: number
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

function normalizeTagsForInput(tags: unknown): string {
  if (Array.isArray(tags)) {
    return tags
      .filter((t) => typeof t === 'string')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
      .join(', ')
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
      .join(', ')
  }

  return ''
}

function parseTagsCsv(input: string): string[] {
  const out: string[] = []
  const seen = new Set<string>()

  for (const raw of input.split(',')) {
    const tag = raw.trim().replace(/^#/, '')
    const key = tag.toLowerCase()
    if (!tag || seen.has(key)) continue
    seen.add(key)
    out.push(tag)
  }

  return out
}

// ── Page-level state & reducer ──────────────────────────────────────────────
type PageState = {
  copied: boolean
  downloadingQr: boolean
  blastSubject: string
  blastBody: string
  sendingBlast: boolean
  deletingEvent: boolean
  event: OrganizerEvent | null
  ordersAndAttendees: OrdersAndAttendees | null
  loadingOverview: boolean
  loadingOrders: boolean
  error: string | null
  reloadToken: number
}

type PageAction =
  | { type: 'SET_COPIED'; payload: boolean }
  | { type: 'SET_DOWNLOADING_QR'; payload: boolean }
  | { type: 'SET_BLAST_SUBJECT'; payload: string }
  | { type: 'SET_BLAST_BODY'; payload: string }
  | { type: 'SET_SENDING_BLAST'; payload: boolean }
  | { type: 'SET_DELETING_EVENT'; payload: boolean }
  | { type: 'SET_EVENT'; payload: OrganizerEvent | null }
  | { type: 'SET_ORDERS_AND_ATTENDEES'; payload: OrdersAndAttendees | null }
  | { type: 'SET_LOADING_OVERVIEW'; payload: boolean }
  | { type: 'SET_LOADING_ORDERS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RELOAD' }
  | { type: 'RESET_DATA' }
  | { type: 'BLAST_SENT' }

const initialPageState: PageState = {
  copied: false,
  downloadingQr: false,
  blastSubject: '',
  blastBody: '',
  sendingBlast: false,
  deletingEvent: false,
  event: null,
  ordersAndAttendees: null,
  loadingOverview: true,
  loadingOrders: true,
  error: null,
  reloadToken: 0,
}

function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case 'SET_COPIED': return { ...state, copied: action.payload }
    case 'SET_DOWNLOADING_QR': return { ...state, downloadingQr: action.payload }
    case 'SET_BLAST_SUBJECT': return { ...state, blastSubject: action.payload }
    case 'SET_BLAST_BODY': return { ...state, blastBody: action.payload }
    case 'SET_SENDING_BLAST': return { ...state, sendingBlast: action.payload }
    case 'SET_DELETING_EVENT': return { ...state, deletingEvent: action.payload }
    case 'SET_EVENT': return { ...state, event: action.payload }
    case 'SET_ORDERS_AND_ATTENDEES': return { ...state, ordersAndAttendees: action.payload }
    case 'SET_LOADING_OVERVIEW': return { ...state, loadingOverview: action.payload }
    case 'SET_LOADING_ORDERS': return { ...state, loadingOrders: action.payload }
    case 'SET_ERROR': return { ...state, error: action.payload }
    case 'RELOAD': return { ...state, reloadToken: state.reloadToken + 1 }
    case 'RESET_DATA': return { ...state, event: null, ordersAndAttendees: null, error: null, loadingOverview: true, loadingOrders: true }
    case 'BLAST_SENT': return { ...state, blastSubject: '', blastBody: '', sendingBlast: false }
    default: return state
  }
}

export default function OrganizerEventDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams<{ id?: string | string[] }>()

  const id = useMemo(() => {
    const raw = routeParams?.id
    return Array.isArray(raw) ? raw[0] : raw
  }, [routeParams?.id])

  const [state, dispatch] = useReducer(pageReducer, initialPageState)
  const { copied, downloadingQr, blastSubject, blastBody, sendingBlast, deletingEvent, event, ordersAndAttendees, loadingOverview, loadingOrders, error, reloadToken } = state

  const tab = (searchParams.get('tab') as TabKey) || 'overview'

  const onSendBlastEmail = useCallback(async () => {
    if (!event?.id) return

    const subject = blastSubject.trim()
    const content = sanitizeHtml(blastBody)

    if (!subject) {
      errorToast('Please enter a subject.')
      return
    }

    if (!content || content === '<p><br></p>') {
      errorToast('Please enter an email message.')
      return
    }

    dispatch({ type: 'SET_SENDING_BLAST', payload: true })

    const payload = {
      subject,
      content,
      event_id: event.id,
    }

    const resp = await HTTP<ApiData<unknown>, typeof payload>({
      url: getEndpoint('/dashboard/organizer/send-blast-email'),
      method: 'post',
      data: payload,
    })

    if (!resp.ok) {
      errorToast(getErrorMessage(resp.error))
      dispatch({ type: 'SET_SENDING_BLAST', payload: false })
      return
    }

    successToast(resp.data?.message ?? 'Blast email sent successfully.')
    dispatch({ type: 'BLAST_SENT' })
  }, [blastBody, blastSubject, event?.id])

  const loadOverview = useCallback(async () => {
    if (!id) return

    dispatch({ type: 'SET_LOADING_OVERVIEW', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    const resp = await HTTP<ApiData<OrganizerEvent[]>, undefined>({
      url: getEndpoint('/dashboard/organizer/overview'),
      method: 'get',
    })

    if (!resp.ok) {
      dispatch({ type: 'SET_EVENT', payload: null })
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(resp.error) })
      dispatch({ type: 'SET_LOADING_OVERVIEW', payload: false })
      return
    }

    const list = resp.data?.data ?? []
    const found = Array.isArray(list) ? list.find((e) => String(e.id) === String(id)) ?? null : null

    dispatch({ type: 'SET_EVENT', payload: found })
    dispatch({ type: 'SET_LOADING_OVERVIEW', payload: false })
  }, [id])

  const loadOrdersAndAttendees = useCallback(async () => {
    if (!id) return

    dispatch({ type: 'SET_LOADING_ORDERS', payload: true })

    const resp = await HTTP<ApiData<OrdersAndAttendees>, undefined>({
      url: getEndpoint(`/dashboard/organizer/event-orders-and-attendees/${encodeURIComponent(id)}`),
      method: 'get',
    })

    if (!resp.ok) {
      dispatch({ type: 'SET_ORDERS_AND_ATTENDEES', payload: null })
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(resp.error) })
      dispatch({ type: 'SET_LOADING_ORDERS', payload: false })
      return
    }

    dispatch({ type: 'SET_ORDERS_AND_ATTENDEES', payload: resp.data?.data ?? null })
    dispatch({ type: 'SET_LOADING_ORDERS', payload: false })
  }, [id])

  useEffect(() => {
    // reset between event id changes or retries
    dispatch({ type: 'RESET_DATA' })

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
      ticketBoughtCount: a.tickets_bought_count,
      orderId: '',
      checkedIn: Boolean(a.checked_in),
    }))

    const oRows: OrderRow[] = (api?.orders ?? []).map((o) => ({
      id: o.id,
      reference: o.reference,
      customerName: o.customer.full_name ?? '',
      customerEmail: o.customer.email ?? '',
      items: (o.items ?? []).join(', '),
      qty: o.quantity,
      amount: o.amount,
      status: o.status,
      date: o.date,
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

  const publicEventUrl = useMemo(() => {
    if (!event) return ''

    if (typeof window === 'undefined') return ''

    return `${window.location.origin}/events/${event.slug || event.id}`
  }, [event])

  function onCopyPublicLink() {
    try {
      navigator.clipboard.writeText(publicEventUrl)
      dispatch({ type: 'SET_COPIED', payload: true })
      setTimeout(() => dispatch({ type: 'SET_COPIED', payload: false }), 1600)
    } catch {
      // ignore
    }
  }

  const onDownloadQrCode = useCallback(async () => {
    try {
      dispatch({ type: 'SET_DOWNLOADING_QR', payload: true })

      // Generate data URL PNG
      const dataUrl = await QRCode.toDataURL(publicEventUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 8,
        type: 'image/png',
        color: {
          dark: '#000000', // slate-900-ish
          light: '#FFFFFF',
        },
      })

      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `event-qr-${event?.slug}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()

      successToast('QR code downloaded.')
    } catch (e) {
      errorToast(getErrorMessage(e))
    } finally {
      dispatch({ type: 'SET_DOWNLOADING_QR', payload: false })
    }
  }, [event?.slug, publicEventUrl])

  const onDeleteEvent = useCallback(async () => {
    if (!event?.id) return

    // Only allow deletion when no tickets sold — server should also enforce this.
    const sold = (stats?.totalSold ?? computeEventStatsFromApi(event).totalSold)
    if (sold > 0) {
    errorToast('Cannot delete event: tickets have been sold.')
    return
    }

    const ok = confirm('Delete this event? This action cannot be undone.')
    if (!ok) return

    dispatch({ type: 'SET_DELETING_EVENT', payload: true })

    const resp = await HTTP<ApiData<unknown>, undefined>({
    url: getEndpoint(`/dashboard/organizer/event/${encodeURIComponent(String(event.id))}/delete`),
    method: 'delete',
    })

    if (!resp.ok) {
    errorToast(getErrorMessage(resp.error))
    dispatch({ type: 'SET_DELETING_EVENT', payload: false })
    return
    }

    successToast(resp.data?.message ?? 'Event deleted.')
    dispatch({ type: 'SET_DELETING_EVENT', payload: false })

    router.push('/organizer/events')
  }, [event, router, stats])

  // Settings editing state lives in SettingsPanel; keep page component focused on overview/tabs.

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
                onClick={() => dispatch({ type: 'RELOAD' })}
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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{event.title}</h1>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', headerStatusClass)}>{status}</span>
              </div>
              <div className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                <div>
                  {formatDate(event.date)}{event.time ? ` • ${formatTime(event.time)}` : ''}
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
              <button
                type="button"
                onClick={onDownloadQrCode}
                disabled={downloadingQr || !publicEventUrl}
                className={cn(
                  'inline-flex items-center rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20',
                  (downloadingQr || !publicEventUrl) && 'opacity-60 cursor-not-allowed'
                )}
                title={!publicEventUrl ? 'Public link not available yet' : undefined}
              >
                <QrCodeIcon className="w-4 h-4 mr-1" />
                {downloadingQr ? 'Generating…' : 'Get QR code'}
              </button>
              {/** Show delete only when there are no tickets sold */}
              {(stats?.totalSold ?? 0) === 0 ? (
                <button
                  type="button"
                  onClick={onDeleteEvent}
                  disabled={deletingEvent}
                  className={cn(
                    'rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700',
                    deletingEvent && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {deletingEvent ? 'Deleting…' : 'Delete event'}
                </button>
              ) : null}
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
                  { key: 'ref', header: 'Reference', render: (o) => <span className="font-mono text-xs">{o.reference}</span> },
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
                          o.status === 'success' ? pillClass('success') : o.status === 'pending' ? pillClass('warning') : pillClass('danger')
                        )}
                      >
                        {o.status}
                      </span>
                    ),
                  },
                  { key: 'date', header: 'Date', className: 'whitespace-nowrap', render: (o) => o.date}
                ]}
                rows={orderSearch.filtered}
                rowKey={(o) => o.id}
                emptyTitle="No orders"
                emptyDescription="When people buy tickets, you’ll see the orders here."
                pagination={{ enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
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
                  { key: 'quantity', header: 'Ticket Quantity', render: (a) => a.ticketBoughtCount },
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
                pagination={{ enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Manual check-in */}
                {/*<div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Manual check-in</h3>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Enter an order ID (or email) to mark an attendee as checked in.</p>

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
                </div>*/}

                {/* Blast email. temporarily spanning 2 columns */}
                <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 col-span-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Blast email</h3>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Send a message to attendees.</p>

                  <div className="mt-4 space-y-3">
                    <input
                      value={blastSubject}
                      onChange={(e) => dispatch({ type: 'SET_BLAST_SUBJECT', payload: e.target.value })}
                      placeholder="Subject"
                      className="w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      disabled={sendingBlast}
                    />

                    <ReactQuill
                      theme="snow"
                      value={blastBody}
                      onChange={(value) => dispatch({ type: 'SET_BLAST_BODY', payload: value })}
                      placeholder="Write your message…"
                      readOnly={sendingBlast}
                    />

                    <button
                      type="button"
                      className="rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                      onClick={onSendBlastEmail}
                      disabled={sendingBlast}
                    >
                      {sendingBlast ? 'Sending…' : 'Send blast email'}
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
  const [tickets, setTickets] = useState(() => event.tickets ?? [])

  useEffect(() => {
    setTickets(event.tickets ?? [])
  }, [event.tickets])

  // General ticket edit modal
  const [editTicketId, setEditTicketId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    endSellingDate: '',
  })

  const [deleted, setDeleted] = useState<Record<string, boolean>>({})

  const [savingTicketEdit, setSavingTicketEdit] = useState(false)
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const rows = tickets.filter((t) => !deleted[t.id])

  const statsByTicket = useMemo(() => {
    const map = new Map<string, { sold: number; revenue: number }>()
    for (const t of rows) {
      const sold = Number((t as any).sold ?? 0)
      map.set(t.id, { sold, revenue: sold * Number(t.price ?? 0) })
    }
    return map
  }, [rows])

  const editingTicket = useMemo(() => {
    if (!editTicketId) return null
    return tickets.find((t) => t.id === editTicketId)
  }, [editTicketId, tickets])

  const canCloseModal = !savingTicketEdit

  const openEditModal = useCallback((t: any) => {
      setActionError(null)
      setEditTicketId(t.id)

      setEditDraft({
        name: t.name,
        price: t.price,
        description: t.description,
        quantity: t.quantity,
        endSellingDate: toDateTimeLocalValue(t.end_selling_date),
      })
  }, [setEditTicketId])

  const onDeleteTicket = useCallback(
    async (ticketId: string) => {
      if (!ticketId) return

      const ok = confirm('Delete this ticket type?')
      if (!ok) return

      setActionError(null)
      setDeletingTicketId(ticketId)

      const resp = await HTTP<ApiData<unknown>, undefined>({
        url: getEndpoint(`/dashboard/organizer/ticket/delete/${encodeURIComponent(String(ticketId))}`),
        method: 'delete',
      })

      if (!resp.ok) {
        setActionError(getErrorMessage(resp.error))
        setDeletingTicketId(null)
        return
      }

      // Remove from UI immediately (backend is source of truth; a refresh will also reflect it).
      setDeleted((d) => ({ ...d, [ticketId]: true }))
      setDeletingTicketId(null)
    },
    [setDeleted]
  )

  const onSaveTicketEdit = useCallback(async () => {
    if (!editTicketId) return

    const name = editDraft.name.trim()
    const description = editDraft.description
    const priceNum = Number(editDraft.price)
    const quantityNum = Number(editDraft.quantity)
    const endSellingDate = editDraft.endSellingDate

    if (!name) {
      setActionError('Please enter a ticket name.')
      return
    }

    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setActionError('Please enter a valid price (0 or more).')
      return
    }

    if (!Number.isFinite(quantityNum) || quantityNum < 0) {
      setActionError('Please enter a valid quantity (0 or more).')
      return
    }

    if (!endSellingDate) {
      setActionError('Please select an end selling date.')
      return
    }

    setActionError(null)
    setSavingTicketEdit(true)

    const payload = {
      name,
      price: priceNum,
      description,
      quantity: quantityNum,
      end_selling_date: endSellingDate,
    }

    const resp = await HTTP<ApiData<any>, typeof payload>({
      url: getEndpoint(`/dashboard/organizer/ticket/${encodeURIComponent(editTicketId)}/edit`),
      method: 'put',
      data: payload,
    })

    if (!resp.ok) {
      setActionError(getErrorMessage(resp.error))
      setSavingTicketEdit(false)
      return
    }

    // Update local state so the table reflects the edits immediately.
    setTickets((prev) =>
      prev.map((t) =>
        t.id === editTicketId
          ? {
              ...t,
              name,
              price: priceNum,
              description,
              quantity: quantityNum,
              end_selling_date: endSellingDate,
            }
          : t
      )
    )

    setSavingTicketEdit(false)
    setEditTicketId(null)
    successToast(resp.data?.message ?? 'Ticket updated.')
  }, [editDraft, editTicketId])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tickets</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage ticket types, sales and selling dates.</p>
      </div>

      {actionError ? (
        <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {actionError}
        </div>
      ) : null}

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
            render: (t) => {
              const sold = statsByTicket.get(t.id)?.sold || 0
              const isDeleting = deletingTicketId === t.id

              return (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className={cn(
                      'rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                      savingTicketEdit && 'opacity-60 cursor-not-allowed'
                    )}
                    disabled={savingTicketEdit}
                  >
                    Edit ticket
                  </button>

                  <button
                    type="button"
                    onClick={() => sold === 0 && onDeleteTicket(t.id)}
                    disabled={isDeleting}
                    className={cn(
                      'rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700',
                      sold > 0 && 'hidden',
                      isDeleting && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              )
            },
          },
        ]}
        rows={rows as any}
        rowKey={(t) => t.id}
        emptyTitle="No tickets"
        emptyDescription="How come you created an event with no tickets? Contact support at admin@thetbmevents.com"
        pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50, 100] }}
      />

      <Dialog
        open={Boolean(editTicketId)}
        onClose={(open) => {
          if (!open && canCloseModal) {
            setEditTicketId(null)
            setActionError(null)
          }
        }}
        transition
        className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
            <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white">Edit ticket</DialogTitle>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Update details for <span className="font-semibold">{editingTicket?.name ?? 'this ticket'}</span>.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                <input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  disabled={savingTicketEdit}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editDraft.price}
                    onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    disabled={savingTicketEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">Quantity (0 = unlimited)</label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={editDraft.quantity}
                    onChange={(e) => setEditDraft((d) => ({ ...d, quantity: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    disabled={savingTicketEdit}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">End selling date</label>
                <input
                  type="datetime-local"
                  value={editDraft.endSellingDate}
                  onChange={(e) => setEditDraft((d) => ({ ...d, endSellingDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  disabled={savingTicketEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Description</label>
                <textarea
                  value={editDraft.description}
                  onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  disabled={savingTicketEdit}
                />
              </div>

              {actionError ? <div className="text-sm text-red-700 dark:text-red-200">{actionError}</div> : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!canCloseModal) return
                  setEditTicketId(null)
                  setActionError(null)
                }}
                disabled={!canCloseModal}
                className={cn(
                  'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                  !canCloseModal && 'opacity-60 cursor-not-allowed'
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSaveTicketEdit}
                disabled={savingTicketEdit}
                className={cn('rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white', savingTicketEdit && 'opacity-60 cursor-not-allowed')}
              >
                {savingTicketEdit ? 'Saving…' : 'Save'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

// ── Settings-level state & reducer ──────────────────────────────────────────
type SettingsState = {
  title: string
  description: string
  date: string
  time: string
  image: string
  type: 'physical' | 'virtual'
  eventLink: string
  location: string
  category: string
  tagsInput: string
  uploadedImageFile: File | null
  uploadedObjectUrl: string | null
  saving: boolean
  imageModified: boolean
}

type SettingsAction =
  | { type: 'SET_FIELD'; field: keyof SettingsState; payload: string }
  | { type: 'SET_TYPE'; payload: 'physical' | 'virtual' }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'UPLOAD_IMAGE'; file: File; objectUrl: string }
  | { type: 'SET_IMAGE_URL'; payload: string }
  | { type: 'RESET'; event: OrganizerEvent }
  | { type: 'SAVE_SUCCESS'; nextImage?: string }

function buildSettingsState(event: OrganizerEvent): SettingsState {
  return {
    title: event.title,
    description: event.description ?? '',
    date: event.date,
    time: event.time ?? '',
    image: event.image ?? '',
    type: event.isOnline ? 'virtual' : 'physical',
    eventLink: (event as any).virtual_link ?? (event.isOnline ? event.location ?? '' : ''),
    location: event.location ?? '',
    category: event.category,
    tagsInput: normalizeTagsForInput(event.tags),
    uploadedImageFile: null,
    uploadedObjectUrl: null,
    saving: false,
    imageModified: false,
  }
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload }
    case 'SET_TYPE':
      return { ...state, type: action.payload }
    case 'SET_SAVING':
      return { ...state, saving: action.payload }
    case 'UPLOAD_IMAGE':
      return {
        ...state,
        uploadedImageFile: action.file,
        uploadedObjectUrl: action.objectUrl,
        image: action.objectUrl,
        imageModified: true,
      }
    case 'SET_IMAGE_URL': {
      const needsClear = state.uploadedObjectUrl && action.payload !== state.uploadedObjectUrl
      return {
        ...state,
        image: action.payload,
        imageModified: true,
        uploadedObjectUrl: needsClear ? null : state.uploadedObjectUrl,
        uploadedImageFile: needsClear ? null : state.uploadedImageFile,
      }
    }
    case 'RESET':
      return buildSettingsState(action.event)
    case 'SAVE_SUCCESS': {
      const nextImage = action.nextImage
      return {
        ...state,
        image: (nextImage && nextImage.trim()) ? nextImage : state.image,
        uploadedImageFile: null,
        uploadedObjectUrl: null,
        saving: false,
        imageModified: false,
      }
    }
    default:
      return state
  }
}

function SettingsPanel({ event }: { event: OrganizerEvent }) {
  const [state, dispatch] = useReducer(settingsReducer, event, buildSettingsState)
  const { title, description, date, time, image, type, eventLink, location, category, tagsInput, uploadedImageFile, uploadedObjectUrl, saving, imageModified } = state

  const categories = useMemo(() => (mockCategories ?? []).filter((c) => c !== 'All'), [])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)
    }
  }, [uploadedObjectUrl])

  // Sync when the event prop changes
  useEffect(() => {
    if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)
    dispatch({ type: 'RESET', event })
  }, [event])

  const onReset = useCallback(() => {
    if (saving) return
    if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)
    dispatch({ type: 'RESET', event })
  }, [event, saving, uploadedObjectUrl])

  const onSave = useCallback(async () => {
    const eventId = (event as any).id
    if (!eventId) {
      errorToast('Missing event id.')
      return
    }

    const normalizedTitle = title.trim()
    const normalizedImage = image.trim()
    const normalizedEventLink = eventLink.trim()
    const normalizedLocation = location.trim()
    const tags = parseTagsCsv(tagsInput)

    if (!normalizedTitle) {
      errorToast('Please enter an event title.')
      return
    }

    if (type === 'virtual' && !normalizedEventLink) {
      errorToast('Please add an event link for a virtual event.')
      return
    }

    if (type === 'physical' && !normalizedLocation) {
      errorToast('Please add a location for a physical event.')
      return
    }

    dispatch({ type: 'SET_SAVING', payload: true })

    const formData = new FormData()
    formData.append('title', normalizedTitle)
    formData.append('description', description)
    formData.append('date', date)
    formData.append('time', time)
    formData.append('category', category)
    formData.append('type', type)

    if (tags.length !== 0) {
      tags.forEach((tag) => formData.append('tags[]', tag))
    }

    if (type === 'virtual') {
      formData.append('virtual_link', normalizedEventLink)
    } else {
      formData.append('location', normalizedLocation)
    }

    // Only send image data when the user has actually modified it
    if (imageModified) {
      if (uploadedImageFile) {
        formData.append('image', uploadedImageFile)
      } else if (normalizedImage) {
        formData.append('image_url', normalizedImage)
      }
    }

    const resp = await HTTP<ApiData<OrganizerEvent>, FormData>({
      url: getEndpoint(`/dashboard/organizer/event/${encodeURIComponent(eventId)}`),
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (!resp.ok) {
      errorToast(getErrorMessage(resp.error))
      dispatch({ type: 'SET_SAVING', payload: false })
      return
    }

    if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)

    successToast(resp.data?.message ?? 'Changes saved.')
    dispatch({ type: 'SAVE_SUCCESS', nextImage: (resp.data?.data as any)?.image })
  }, [category, date, description, event, eventLink, image, imageModified, location, tagsInput, time, title, type, uploadedImageFile, uploadedObjectUrl])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Update event details and save changes.</p>
      </div>

      <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Event banner image</label>
            <div className="mt-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3">
              <img
                src={uploadedObjectUrl || image || '/images/placeholder-event.svg'}
                alt="Event banner preview"
                className="w-full h-48 rounded-lg object-cover"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className={cn(
                    'rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95',
                    saving && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  Upload image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)

                    const url = URL.createObjectURL(file)
                    dispatch({ type: 'UPLOAD_IMAGE', file, objectUrl: url })
                  }}
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Image URL</label>
                <input
                  value={image}
                  onChange={(e) => dispatch({ type: 'SET_IMAGE_URL', payload: e.target.value })}
                  disabled={saving}
                  placeholder="https://..."
                  className={cn(
                    'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                    saving && 'opacity-60 cursor-not-allowed'
                  )}
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Title</label>
            <input
              value={title}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', payload: e.target.value })}
              disabled={saving}
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Description</label>
            <div className={cn(saving && 'pointer-events-none opacity-60')}>
              <ReactQuill theme="snow" value={description} onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'description', payload: value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'date', payload: e.target.value })}
              disabled={saving}
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'time', payload: e.target.value })}
              placeholder="e.g. 19:00"
              disabled={saving}
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Type</label>
            <select
              value={type}
              onChange={(e) => dispatch({ type: 'SET_TYPE', payload: e.target.value as 'physical' | 'virtual' })}
              disabled={saving}
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            >
              <option value="physical">Physical</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          {type === 'virtual' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Event link</label>
              <input
                value={eventLink}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'eventLink', payload: e.target.value })}
                disabled={saving}
                placeholder="https://meet.google.com/..."
                className={cn(
                  'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                  saving && 'opacity-60 cursor-not-allowed'
                )}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Location</label>
              <input
                value={location}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'location', payload: e.target.value })}
                disabled={saving}
                placeholder="Street, City, State"
                className={cn(
                  'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                  saving && 'opacity-60 cursor-not-allowed'
                )}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Category</label>
            <select
              value={category}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'category', payload: e.target.value })}
              disabled={saving}
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            >
              {!categories.includes(category) ? <option value={category}>{category}</option> : null}
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Tags</label>
            <input
              value={tagsInput}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'tagsInput', payload: e.target.value })}
              disabled={saving}
              placeholder="music, networking, startup"
              className={cn(
                'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            />
            <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">Separate tags with commas.</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={saving}
            className={cn(
              'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
              saving && 'opacity-60 cursor-not-allowed'
            )}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={cn(
              'rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95',
              saving && 'opacity-60 cursor-not-allowed'
            )}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

