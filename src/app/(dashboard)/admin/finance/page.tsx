'use client'

import React, { useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { events as mockEvents } from '@lib/mockEvents'
import {
  buildAdminFinanceSummary,
  findTransactionByReference,
  type AdminTopOrganizerByRevenueRow,
  type AdminTransactionRow,
} from '@lib/adminFinanceMock'
import { cn, currencySymbol, formatNumber } from '@lib/utils'

function StatCard({ title, value, sub }: { title: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm')}>
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{sub}</div> : null}
    </div>
  )
}

function statusPill(status: AdminTransactionRow['status']) {
  if (status === 'success') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
  if (status === 'pending') return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200'
  return 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200'
}

export default function AdminFinancePage() {
  const summary = useMemo(() => buildAdminFinanceSummary(mockEvents, new Date()), [])

  const columns = useMemo((): DataTableColumn<AdminTransactionRow>[] => {
    return [
      {
        key: 'orderId',
        header: 'Order ID',
        className: 'whitespace-nowrap',
        render: (r) => <span className="font-semibold">{r.orderId}</span>,
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
        render: (r) => (
          <a className="text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${r.email}`}>
            {r.email}
          </a>
        ),
      },
      {
        key: 'chargedAmount',
        header: 'Charged amount',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="font-semibold">
            {currencySymbol(r.currency)}
            {formatNumber(r.chargedAmount)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusPill(r.status))}>{r.status}</span>
        ),
      },
    ]
  }, [])

  const topOrganizerColumns = useMemo((): DataTableColumn<AdminTopOrganizerByRevenueRow>[] => {
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
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{formatNumber(r.ticketsSold)}</span>,
      },
      {
        key: 'revenue',
        header: 'Revenue',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="font-semibold">
            {currencySymbol('NGN')}
            {formatNumber(r.revenue)}
          </span>
        ),
      },
    ]
  }, [])

  const [reference, setReference] = useState('')
  const [verifyResult, setVerifyResult] = useState<AdminTransactionRow | null>(null)
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function onVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifyMessage(null)

    const tx = findTransactionByReference(mockEvents, reference, new Date())

    if (!tx) {
      setVerifyResult(null)
      setVerifyMessage({ type: 'error', text: 'No transaction found for that reference (demo lookup).' })
      return
    }

    setVerifyResult(tx)
    setVerifyMessage({ type: 'success', text: `Transaction found: ${tx.status.toUpperCase()}` })
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
                {formatNumber(summary.totalRevenueAllTime)}
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
              />
              <button type="submit" className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
                Verify
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
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">{verifyResult.orderId}</div>
                </div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Status</div>
                  <div className="mt-1">
                    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusPill(verifyResult.status))}>
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
                    {currencySymbol(verifyResult.currency)}
                    {formatNumber(verifyResult.chargedAmount)}
                  </div>
                </div>
              </div>
            ) : null}
          </GlassCard>

          <GlassCard className="p-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top organizers</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">By all-time revenue.</p>
            </div>

            <div className="mt-4">
              <DataTable<AdminTopOrganizerByRevenueRow>
                columns={topOrganizerColumns}
                rows={summary.topOrganizersByRevenue}
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
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">10 most recent transactions (demo data).</p>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<AdminTransactionRow>
              columns={columns}
              rows={summary.recentTransactions}
              rowKey={(r) => r.id}
              emptyTitle="No transactions"
              emptyDescription="Transactions will appear once payments are processed."
            />
          </div>
        </GlassCard>
      </div>
    </SidebarLayout>
  )
}
