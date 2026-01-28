'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import AdminFinanceShimmer from '../../../../components/dashboard/AdminFinanceShimmer'
import HTTP from '@lib/HTTP'
import { cn, currencySymbol, formatNumber, getEndpoint, getErrorMessage } from '@lib/utils'
import type { ApiData, AdminFinanceSummary, RecentTransaction, TopOrganizer } from '@lib/types'

function StatCard({ title, value, sub }: { title: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm')}>
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{sub}</div> : null}
    </div>
  )
}

type UiTransactionRow = {
  id: string
  reference: string
  eventName: string
  email?: string
  chargedAmount: number
  currency: any
  status: string
  createdAt: string
}

type UiTopOrganizerRow = {
  organizerId: string
  organizerName: string
  ticketsSold: string
  eventTitle: string
  email: string
}

function normalizeTxStatus(status: string): 'success' | 'pending' | 'failed' {
  const s = (status ?? '').toLowerCase().trim()
  if (['success', 'successful', 'paid', 'completed', 'complete'].includes(s)) return 'success'
  if (['pending', 'processing', 'waiting'].includes(s)) return 'pending'
  return 'failed'
}

function statusPill(status: 'success' | 'pending' | 'failed') {
  if (status === 'success') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
  if (status === 'pending') return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200'
  return 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200'
}

function mapRecentTransaction(tx: RecentTransaction): UiTransactionRow {
  return {
    id: tx.id,
    reference: tx.reference,
    eventName: tx.event_name,
    email: tx.email,
    chargedAmount: tx.amount,
    currency: tx.currency,
    status: normalizeTxStatus(tx.status),
    createdAt: tx.created_at,
  }
}

function sfNumber(input: string): number {
  const n = Number.parseFloat(String(input ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default function AdminFinancePage() {
  const [overview, setOverview] = useState<AdminFinanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const loadOverview = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<AdminFinanceSummary>, undefined>({
      url: getEndpoint('/dashboard/admin/finance/overview'),
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

  const transactions: UiTransactionRow[] = useMemo(() => {
    return (overview?.recent_transactions ?? []).map(mapRecentTransaction)
  }, [overview])

  const topOrganizers: UiTopOrganizerRow[] = useMemo(() => {
    return (overview?.top_organizers ?? []).map((o: TopOrganizer) => ({
      organizerId: o.id,
      organizerName: o.organizer,
      ticketsSold: o.tickets_sold,
      eventTitle: o.title,
      email: o.email,
    }))
  }, [overview])

  const columns = useMemo((): DataTableColumn<UiTransactionRow>[] => {
    return [
      {
        key: 'id',
        header: 'Order ID',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{r.id}</span>,
      },
      {
        key: 'event',
        header: 'Event',
        render: (r) => <span className="text-gray-900 dark:text-white">{r.eventName}</span>,
      },
      {
        key: 'email',
        header: 'Email',
        className: 'whitespace-nowrap',
        render: (r) =>
          r.email ? (
            <a className="text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${r.email}`}>
              {r.email}
            </a>
          ) : (
            <span className="text-text-muted-light dark:text-text-muted-dark">—</span>
          ),
      },
      {
        key: 'chargedAmount',
        header: 'Charged amount',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="font-semibold">
            {currencySymbol(String(r.currency ?? ''))}
            {formatNumber(r.chargedAmount)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusPill(r.status as any))}>
            {r.status}
          </span>
        ),
      },
    ]
  }, [])

  const topOrganizerColumns = useMemo((): DataTableColumn<UiTopOrganizerRow>[] => {
    return [
      {
        key: 'organizer',
        header: 'Organizer',
        render: (r) => <span className="font-semibold text-gray-900 dark:text-white">{r.organizerName}</span>,
      },
      {
        key: 'ticketsSold',
        header: 'Tickets sold',
        className: 'whitespace-nowrap',
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{r.ticketsSold}</span>,
      },
      {
        key: 'revenue',
        header: 'Event',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{r.eventTitle}</span>,
      },
    ]
  }, [])

  const [reference, setReference] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<UiTransactionRow | null>(null)
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()

    const ref = reference.trim()
    if (!ref) {
      setVerifyResult(null)
      setVerifyMessage({ type: 'error', text: 'Please enter a transaction reference.' })
      return
    }

    setVerifying(true)
    setVerifyMessage(null)

    const resp = await HTTP<ApiData<RecentTransaction>, undefined>({
      url: getEndpoint(`/dashboard/admin/verify-transaction/${encodeURIComponent(ref)}`),
      method: 'get',
    })

    setVerifying(false)

    if (!resp.ok || !resp.data) {
      setVerifyResult(null)
      setVerifyMessage({ type: 'error', text: getErrorMessage(resp.error) })
      return
    }

    const tx = mapRecentTransaction(resp.data.data)
    setVerifyResult(tx)
    setVerifyMessage({ type: 'success', text: `Transaction found: ${tx.status.toUpperCase()}` })
  }

  const allTimeRevenue = useMemo(() => sfNumber(overview?.all_time_revenue ?? '0'), [overview?.all_time_revenue])

  if (loading) {
    return (
      <SidebarLayout>
        <AdminFinanceShimmer />
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Finance</h1>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t load finance overview right now.</p>
                <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                  {error}
                </div>
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
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Finance</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Revenue overview, transaction verification, and top organizers.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total revenue (all time)"
            value={
              <>
                {currencySymbol('NGN')}
                {formatNumber(allTimeRevenue)}
              </>
            }
            sub="Gross ticket revenue"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-5 lg:col-span-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Verify a transaction</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Enter a reference to manually check transaction status.</p>
            </div>

            <form onSubmit={onVerify} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. TBM_1_0_123456"
                className="w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                disabled={verifying}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={verifying}
              >
                {verifying ? 'Verifying…' : 'Verify'}
              </button>
            </form>

            {verifyMessage ? (
              <div
                className={cn(
                  'mt-4 rounded-xl border p-3 text-sm',
                  verifyMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-200'
                )}
              >
                {verifyMessage.text}
              </div>
            ) : null}

            {verifyResult ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Order ID</div>
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">{verifyResult.id}</div>
                </div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Status</div>
                  <div className="mt-1">
                    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusPill(verifyResult.status as any))}>
                      {verifyResult.status}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Event</div>
                  <div className="mt-1 text-gray-900 dark:text-white">{verifyResult.eventName}</div>
                </div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Charged amount</div>
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                    {currencySymbol(String(verifyResult.currency ?? ''))}
                    {formatNumber(verifyResult.chargedAmount)}
                  </div>
                </div>
              </div>
            ) : null}
          </GlassCard>

          <GlassCard className="p-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top organizers</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">By all-time ticket sales.</p>
            </div>

            <div className="mt-4">
              <DataTable<UiTopOrganizerRow>
                columns={topOrganizerColumns}
                rows={topOrganizers}
                rowKey={(r) => r.organizerId}
                emptyTitle="No organizers"
                emptyDescription="Organizer revenue will appear once tickets are sold."
              />
            </div>
          </GlassCard>
        </div>

        <GlassCard className="mt-6 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent transactions</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">10 most recent transactions.</p>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<UiTransactionRow>
              columns={columns}
              rows={transactions}
              rowKey={(r) => r.id || r.reference}
              emptyTitle="No transactions"
              emptyDescription="Transactions will appear once payments are processed."
              pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50] }}
            />
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
