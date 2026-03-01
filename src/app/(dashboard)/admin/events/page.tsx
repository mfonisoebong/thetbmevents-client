'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import AdminEventsShimmer from '../../../../components/dashboard/AdminEventsShimmer'
import HTTP from '@lib/HTTP'
import { cn, formatDate, getCookie, getEndpoint, getErrorMessage, setCookie } from '@lib/utils'
import type { ApiData, OrganizerEvent } from '@lib/types'
import { errorToast, successToast } from '@components/Toast'

type EventStatus = 'draft' | 'published' | 'ended'

type AdminEventRow = {
  id: string
  title: string
  date: string
  organizerId: string
  organizerName: string
  organizerEmail: string
  revenue: number
  status: string
}

function toRow(e: OrganizerEvent): AdminEventRow {
  const org = e.organizer
  const organizerName =
    (org?.business_name && String(org.business_name)) ||
    (org?.full_name && String(org.full_name)) ||
    (org?.email && String(org.email)) ||
    '—'

  return {
    id: String(e.id),
    title: String(e.title ?? '—'),
    date: String(e.date ?? e.created_at ?? new Date().toISOString()),
    organizerId: String(org?.id ?? ''),
    organizerName,
    organizerEmail: String(org?.email ?? '—'),
    revenue: Number(e.total_revenue ?? 0),
    status: String(e.status ?? '—'),
  }
}

function formatMoney(amount: number) {
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount)
}

function statusPill(status: string) {
  const s = String(status || '').toLowerCase().trim()

  if (s === 'published') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
  if (s === 'ended') return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
  return 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100'
}

export default function AdminEventsPage() {
  const [rows, setRows] = useState<AdminEventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<OrganizerEvent[]>, undefined>({
      url: getEndpoint('/dashboard/admin/events'),
      method: 'get',
    })

    if (!resp.ok || !resp.data) {
      setRows([])
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    const list = Array.isArray(resp.data.data) ? resp.data.data : []
    setRows(list.map(toRow))
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents, reloadToken])

  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const hay = `${r.title} ${r.organizerName} ${r.organizerEmail} ${r.status}`.toLowerCase()
      return hay.includes(q)
    })
  }, [rows, query])

  async function onChangeStatus(row: AdminEventRow, status: EventStatus) {
    if (!row?.id) return

    setActionId(row.id)

    try {
      const resp = await HTTP<ApiData<unknown>, undefined>({
        url: getEndpoint(`/dashboard/event/${encodeURIComponent(row.id)}/change-status/${encodeURIComponent(status)}`),
        method: 'put',
      })

      if (!resp.ok) {
        errorToast(getErrorMessage(resp.error))
        return
      }

      setRows((prev) => prev.map((x) => (x.id === row.id ? { ...x, status } : x)))
      successToast(`Event status updated to “${status}”.`)
    } catch (e) {
      console.error(e)
      errorToast(getErrorMessage(e))
    } finally {
      setActionId(null)
    }
  }

  async function onImpersonate(row: AdminEventRow) {
    if (!row.organizerId) {
      errorToast('Missing organizer id')
      return
    }

    setActionId(row.id)

    try {
      const resp = await HTTP<ApiData<{ token: string; user: any }>, undefined>({
        url: getEndpoint(`/dashboard/admin/impersonate/${encodeURIComponent(row.organizerId)}`),
        method: 'post',
      })

      if (!resp.ok || !resp.data) {
        errorToast(getErrorMessage(resp.error))
        return
      }

      const { token, user } = resp.data.data ?? ({} as any)
      if (!token || !user) {
        errorToast('Impersonation failed: missing token or user')
        return
      }

      setCookie('admin_token', getCookie('token'))
      setCookie('token', token)
      setCookie('user', JSON.stringify(user))
      setCookie('role', 'organizer')

      window.location.href = '/organizer/dashboard'
    } catch (e) {
      console.error(e)
      errorToast(getErrorMessage(e))
    } finally {
      setActionId(null)
    }
  }

  const columns = useMemo((): DataTableColumn<AdminEventRow>[] => {
    return [
      {
        key: 'title',
        header: 'Name',
        render: (r) => (
          <div className="min-w-[240px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.title}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">{formatDate(r.date)}</div>
          </div>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        className: 'whitespace-nowrap',
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{formatDate(r.date)}</span>,
      },
      {
        key: 'organizer',
        header: 'Organizer',
        render: (r) => {
          const busy = actionId === r.id
          return (
            <div className="min-w-[220px]">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">{r.organizerName}</div>
                <button
                  type="button"
                  onClick={() => void onImpersonate(r)}
                  disabled={busy}
                  title="Login as organizer"
                  className={cn(
                    'inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/5 p-1.5 hover:bg-white/20',
                    busy ? 'opacity-60 cursor-not-allowed' : ''
                  )}
                >
                  <ArrowRightOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">{r.organizerEmail}</div>
            </div>
          )
        },
      },
      {
        key: 'revenue',
        header: 'Revenue',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{formatMoney(r.revenue)}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusPill(r.status))}>
            {String(r.status || '—')}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'whitespace-nowrap',
        render: (r) => {
          const busy = actionId === r.id
          const current = String(r.status || '').toLowerCase().trim() as EventStatus

          const opts: EventStatus[] = ['draft', 'published', 'ended']

          return (
            <div className="flex items-center gap-2">
              <select
                value={opts.includes(current) ? current : 'draft'}
                disabled={busy}
                onChange={(e) => void onChangeStatus(r, e.target.value as EventStatus)}
                className={cn(
                  'rounded-lg bg-white/60 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                  busy ? 'opacity-60 cursor-not-allowed' : ''
                )}
              >
                {opts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )
        },
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionId])

  if (loading) {
    return (
      <SidebarLayout>
        <AdminEventsShimmer />
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Events</h1>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t load events right now.</p>
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Events</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">All events across organizers.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setReloadToken((n) => n + 1)}
              className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
            >
              Refresh
            </button>
          </div>
        </div>

        <GlassCard className="mt-6 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, organizers, status…"
              className="w-full lg:w-[420px] rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{rows.length}</span>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<AdminEventRow>
              columns={columns}
              rows={filtered}
              rowKey={(r) => r.id}
              emptyTitle="No events"
              emptyDescription="When organizers create events, they’ll appear here."
              pagination={{ enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
            />
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}

