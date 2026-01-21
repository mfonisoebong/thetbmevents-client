'use client'

import React, { useCallback, useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { useTableSearch } from '../../../../hooks/useTableSearch'
import { exportToCsv } from '@lib/csv'
import HTTP from '@lib/HTTP'
import { cn, formatDate } from '@lib/utils'
import { makeMockOrganizers, type Organizer } from '@lib/organizersMock'

type OrganizerRow = Organizer

type HttpResp<T> = { ok: boolean; data: T | null; error: unknown | null }

async function http<T = any>(args: {
  url: string
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete'
  data?: any
  headers?: Record<string, string>
}): Promise<HttpResp<T>> {
  // HTTP.js requires `data` and `headers` keys but they’re optional for GETs.
  return (await (HTTP as any)({
    url: args.url,
    method: args.method,
    data: args.data ?? null,
    headers: args.headers ?? null,
  })) as HttpResp<T>
}

function pillClass(active: boolean) {
  return active
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
    : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
}

function normalizeOrganizer(raw: any): OrganizerRow {
  // Best-effort mapping across API variants.
  const id = String(raw?.id ?? raw?._id ?? raw?.uuid ?? '')
  const businessName = String(raw?.businessName ?? raw?.business_name ?? raw?.companyName ?? raw?.company_name ?? raw?.name ?? '')
  const email = String(raw?.email ?? raw?.user?.email ?? '')
  const phone = String(raw?.phone ?? raw?.phoneNumber ?? raw?.phone_number ?? raw?.user?.phone ?? '')
  const createdAt = String(raw?.createdAt ?? raw?.created_at ?? raw?.dateJoined ?? raw?.date_joined ?? raw?.created ?? '')
  const isActive = Boolean(raw?.isActive ?? raw?.active ?? raw?.is_active ?? raw?.status === 'active')

  return {
    id: id || `${businessName}:${email}`,
    businessName: businessName || '—',
    email: email || '—',
    phone: phone || '—',
    createdAt: createdAt || new Date().toISOString(),
    isActive,
  }
}

async function fetchOrganizers(): Promise<OrganizerRow[]> {
  // Assumption: backend exposes an admin organizers list endpoint.
  // We try a couple of common routes and gracefully fall back to mock data.
  const candidates = ['/admin/organizers', '/organizers', '/api/admin/organizers']

  for (const url of candidates) {
    const resp = await http<any>({ url, method: 'get' })
    if (resp.ok) {
      const data = (resp.data ?? {}) as any
      const raw = (data?.data ?? data?.organizers ?? data ?? []) as any[]
      if (Array.isArray(raw)) {
        return raw.map(normalizeOrganizer)
      }
    }
  }

  return makeMockOrganizers(18)
}

export default function AdminOrganizersPage() {
  const [rows, setRows] = useState<OrganizerRow[]>(() => makeMockOrganizers(18))
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setMessage(null)

    try {
      const data = await fetchOrganizers()
      setRows(data)
    } catch (e) {
      console.error(e)
      setRows(makeMockOrganizers(18))
      setMessage({ type: 'error', text: 'Could not load organizers. Showing demo data.' })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void load()
  }, [load])

  const { query, setQuery, filtered } = useTableSearch(rows, (row: OrganizerRow, q: string) => {
    const hay = `${row.businessName} ${row.email} ${row.phone} ${row.isActive ? 'active' : 'inactive'}`.toLowerCase()
    return hay.includes(q)
  })

  const columns = useMemo((): DataTableColumn<OrganizerRow>[] => {
    return [
      {
        key: 'businessName',
        header: 'Business name',
        render: (r: OrganizerRow) => (
          <div className="min-w-[160px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.businessName}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">{r.isActive ? 'Active' : 'Inactive'}</div>
          </div>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        className: 'whitespace-nowrap',
        render: (r: OrganizerRow) => (
          <a className="text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${r.email}`}>
            {r.email}
          </a>
        ),
      },
      {
        key: 'phone',
        header: 'Phone',
        className: 'whitespace-nowrap',
        render: (r: OrganizerRow) => <span className="text-sm">{r.phone}</span>,
      },
      {
        key: 'createdAt',
        header: 'Date joined',
        className: 'whitespace-nowrap',
        render: (r: OrganizerRow) => <span className="text-sm text-text-muted-light dark:text-text-muted-dark">{formatDate(r.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'whitespace-nowrap',
        render: (r: OrganizerRow) => {
          const busy = actionId === r.id
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void onLoginAs(r)}
                className={cn(
                  'rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                  busy ? 'opacity-60 cursor-not-allowed' : ''
                )}
              >
                Login as
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void onToggleActive(r)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold',
                  r.isActive
                    ? 'bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                    : 'bg-brand-teal text-white hover:opacity-95',
                  busy ? 'opacity-60 cursor-not-allowed' : ''
                )}
              >
                {r.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          )
        },
      },
    ]

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionId])

  async function onExport() {
    const exportRows = filtered.map((r: OrganizerRow) => ({
      businessName: r.businessName,
      email: r.email,
      phone: r.phone,
      dateJoined: formatDate(r.createdAt),
      status: r.isActive ? 'Active' : 'Inactive',
    }))

    exportToCsv(`organizers-${new Date().toISOString().slice(0, 10)}`, exportRows, [
      { key: 'businessName', header: 'Business name' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
      { key: 'dateJoined', header: 'Date joined' },
      { key: 'status', header: 'Status' },
    ])
  }

  async function onToggleActive(r: OrganizerRow) {
    setActionId(r.id)
    setMessage(null)

    // Optimistic UI
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, isActive: !x.isActive } : x)))

    try {
      const nextActive = !r.isActive
      const candidates = [
        { url: `/admin/organizers/${encodeURIComponent(r.id)}/${nextActive ? 'activate' : 'deactivate'}`, method: 'post' as const },
        { url: `/admin/organizers/${encodeURIComponent(r.id)}`, method: 'patch' as const, data: { isActive: nextActive } },
        { url: `/organizers/${encodeURIComponent(r.id)}`, method: 'patch' as const, data: { isActive: nextActive } },
      ]

      let ok = false
      for (const c of candidates) {
        const resp = await http<any>({ url: c.url, method: c.method, data: (c as any).data })
        if (resp.ok) {
          ok = true
          break
        }
      }

      if (!ok) throw new Error('toggle failed')

      setMessage({ type: 'success', text: `Organizer ${nextActive ? 'activated' : 'deactivated'}.` })
    } catch (e) {
      console.error(e)
      // Revert
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, isActive: r.isActive } : x)))
      setMessage({ type: 'error', text: 'Could not update organizer status.' })
    } finally {
      setActionId(null)
    }
  }

  async function onLoginAs(r: OrganizerRow) {
    setActionId(r.id)
    setMessage(null)

    try {
      // We’ll try a few plausible endpoints. If the backend returns a token, we’ll store it like the app does.
      const candidates = [
        { url: `/admin/organizers/${encodeURIComponent(r.id)}/login-as`, method: 'post' as const },
        { url: `/admin/impersonate`, method: 'post' as const, data: { organizerId: r.id } },
        { url: `/admin/organizers/impersonate`, method: 'post' as const, data: { organizerId: r.id } },
      ]

      let token: string | null = null

      for (const c of candidates) {
        const resp = await http<any>({ url: c.url, method: c.method, data: (c as any).data })
        if (!resp.ok) continue

        const data = (resp.data ?? {}) as any
        token = data?.token ?? data?.data?.token ?? data?.impersonationToken ?? null

        if (token) break
      }

      if (token) {
        // Store token similarly to other parts of the app.
        document.cookie = `token=${encodeURIComponent(token)}; path=/; samesite=lax`
        window.location.href = '/organizer/dashboard'
        return
      }

      // If backend isn’t ready, we still provide a helpful UX.
      setMessage({ type: 'error', text: 'Impersonation endpoint not available (no token returned).' })
    } catch (e) {
      console.error(e)
      setMessage({ type: 'error', text: 'Could not login as organizer.' })
    } finally {
      setActionId(null)
    }
  }

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Organizers</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Manage organizer accounts and access.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className={cn(
                'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                loading ? 'opacity-60 cursor-not-allowed' : ''
              )}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>

            <button type="button" onClick={() => void onExport()} className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
              Export CSV
            </button>
          </div>
        </div>

        <GlassCard className="mt-6 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search organizers by name, email, phone…"
                className="w-full sm:w-[360px] rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />

              <div className="inline-flex items-center gap-2">
                <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', pillClass(true))}>Active</span>
                <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', pillClass(false))}>Inactive</span>
              </div>
            </div>

            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{rows.length}</span>
            </div>
          </div>

          {message ? (
            <div
              className={cn(
                'mt-4 rounded-xl border p-3 text-sm',
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-200'
              )}
            >
              {message.text}
            </div>
          ) : null}

          <div className="mt-4">
            <DataTable<OrganizerRow>
              columns={columns}
              rows={filtered}
              rowKey={(r: OrganizerRow) => r.id}
              emptyTitle="No organizers"
              emptyDescription="When organizers sign up, they’ll appear here."
            />
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
