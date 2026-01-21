'use client'

import React, { useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { cn } from '@lib/utils'
import { useTableSearch } from '../../../../hooks/useTableSearch'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import GlassCard from "../../../../components/GlassCard";
import Select from "../../../../components/Select";
import Input from "../../../../components/Input"

type CouponType = 'fixed' | 'percentage'

type CouponRow = {
  id: string
  code: string
  type: CouponType
  value: number
  event: string
  status: 'active' | 'inactive'
  invoicesUsed: number
  limit: number
  startAt: string
  endAt: string
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`
}

export default function OrganizerCouponsPage() {
  const mockCoupons: CouponRow[] = useMemo(
    () => [
      {
        id: 'c1',
        code: 'TBM10',
        type: 'percentage',
        value: 10,
        event: 'Tech Meetup Lagos',
        status: 'active',
        invoicesUsed: 18,
        limit: 100,
        startAt: new Date().toISOString().slice(0, 16),
        endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      },
      {
        id: 'c2',
        code: 'WELCOME500',
        type: 'fixed',
        value: 500,
        event: 'Poetry Night',
        status: 'inactive',
        invoicesUsed: 2,
        limit: 20,
        startAt: new Date().toISOString().slice(0, 16),
        endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      },
    ],
    []
  )

  const [coupons, setCoupons] = useState<CouponRow[]>(mockCoupons)
  const [isOpen, setIsOpen] = useState(false)

  const [form, setForm] = useState({
    code: '',
    startAt: '',
    endAt: '',
    type: 'percentage' as CouponType,
    value: 0,
    event: '',
    limit: 0,
  })

  const { query, setQuery, filtered } = useTableSearch(coupons, (row, q) => {
    const hay = `${row.code} ${row.type} ${row.event} ${row.status}`.toLowerCase()
    return hay.includes(q)
  })

  const columns = useMemo((): DataTableColumn<CouponRow>[] => {
    return [
      { key: 'code', header: 'Code', render: (c) => <span className="font-mono text-xs font-semibold">{c.code}</span> },
      {
        key: 'type',
        header: 'Type',
        render: (c) => (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-black/30">
            {c.type}
          </span>
        ),
      },
      { key: 'event', header: 'Event', render: (c) => <span className="font-semibold">{c.event}</span> },
      {
        key: 'status',
        header: 'Status',
        render: (c) => (
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
            )}
          >
            {c.status}
          </span>
        ),
      },
      {
        key: 'invoicesUsed',
        header: 'Invoices used',
        className: 'whitespace-nowrap',
        render: (c) => (
          <span>
            {c.invoicesUsed}
            {c.limit > 0 ? <span className="text-text-muted-light dark:text-text-muted-dark">/{c.limit}</span> : null}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'whitespace-nowrap',
        render: (c) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)))}
              className="rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20"
            >
              {c.status === 'active' ? 'Make inactive' : 'Activate'}
            </button>
            <button
              type="button"
              onClick={() => setCoupons((prev) => prev.filter((x) => x.id !== c.id))}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Delete
            </button>
          </div>
        ),
      },
    ]
  }, [setCoupons])

  const mockEvents = useMemo(() => ['Tech Meetup Lagos', 'Poetry Night', 'Design Sprint'], [])

  function openModal() {
    setForm({
      code: '',
      startAt: '',
      endAt: '',
      type: 'percentage',
      value: 0,
      event: mockEvents[0] ?? '',
      limit: 0,
    })
    setIsOpen(true)
  }

  function onCreate() {
    const next: CouponRow = {
      id: randomId('coupon'),
      code: form.code.trim() || `COUPON-${coupons.length + 1}`,
      type: form.type,
      value: Number(form.value) || 0,
      event: form.event || mockEvents[0] || 'All events',
      status: 'active',
      invoicesUsed: 0,
      limit: Number(form.limit) || 0,
      startAt: form.startAt,
      endAt: form.endAt,
    }

    setCoupons((prev) => [next, ...prev])
    console.log('Create coupon', next)
    setIsOpen(false)
  }

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Coupons</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create and manage discount codes.</p>
          </div>

          <button type="button" onClick={openModal} className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
            + Add new coupon
          </button>
        </div>

        <GlassCard className="mt-6 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coupons..."
              className="w-full sm:max-w-sm rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {filtered.length} coupon{filtered.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="mt-4">
            <DataTable<CouponRow>
              columns={columns}
              rows={filtered}
              rowKey={(c) => c.id}
              emptyTitle="No coupons"
              emptyDescription="Create your first coupon to start offering discounts."
            />
          </div>
        </GlassCard>

        <Dialog open={isOpen} onClose={setIsOpen} transition className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in">
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
              <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white">New coupon</DialogTitle>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Fill in the details to create a coupon.</p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Code" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. TBM10" />
                <Select label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CouponType }))}>
                  <option value="fixed">fixed</option>
                  <option value="percentage">percentage</option>
                </Select>

                <Input label="Start date time" type="datetime-local" value={form.startAt} onChange={(e) => setForm((p) => ({ ...p, startAt: e.target.value }))} />
                <Input label="End date time" type="datetime-local" value={form.endAt} onChange={(e) => setForm((p) => ({ ...p, endAt: e.target.value }))} />

                <Input label="Value" type="number" value={String(form.value)} onChange={(e) => setForm((p) => ({ ...p, value: Number(e.target.value) }))} />

                <Input label="Limit" type="number" value={String(form.limit)} onChange={(e) => setForm((p) => ({ ...p, limit: Number(e.target.value) }))} />

                <Select label="Event" value={form.event} onChange={(e) => setForm((p) => ({ ...p, event: e.target.value }))}>
                  {mockEvents.map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button type="button" onClick={onCreate} className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
                  Create coupon
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </SidebarLayout>
  )
}
