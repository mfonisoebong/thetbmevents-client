'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { cn, getEndpoint, getErrorMessage } from '@lib/utils'
import { useTableSearch } from '../../../../hooks/useTableSearch'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import GlassCard from '../../../../components/GlassCard'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
import HTTP from '@lib/HTTP'
import type { ApiData, OrganizerEvent } from '@lib/types'
import {errorToast} from "@components/Toast";

type CouponType = 'fixed' | 'percentage'

export interface Coupon {
  id: number
  code: string
  type: 'fixed' | 'percentage'
  value: number
  limit: number
  event_name: string
  start_date_time: string
  end_date_time: string
  used_count: number
  status: string
  created_at: string
  updated_at: string
}

type CouponRow = Coupon

type CreateCouponPayload = {
  code: string
  type: CouponType
  value: number
  limit: number
  event_id: string
  start_date_time: string
  end_date_time: string
}

export default function OrganizerCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [events, setEvents] = useState<OrganizerEvent[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const [actionId, setActionId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [form, setForm] = useState({
    code: '',
    startAt: '',
    endAt: '',
    type: 'percentage' as CouponType,
    value: 0,
    eventId: '',
    limit: -1,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [couponsResp, eventsResp] = await Promise.all([
      HTTP<ApiData<CouponRow[]>, undefined>({
        url: getEndpoint('/dashboard/organizer/coupon'),
        method: 'get',
      }),
      HTTP<ApiData<OrganizerEvent[]>, undefined>({
        url: getEndpoint('/dashboard/organizer/event'),
        method: 'get',
      }),
    ])

    if (!couponsResp.ok) {
      setCoupons([])
      setEvents([])
      setError(getErrorMessage(couponsResp.error))
      errorToast(getErrorMessage(couponsResp.error))
      setLoading(false)
      return
    }

    if (!eventsResp.ok) {
      setCoupons(Array.isArray(couponsResp.data?.data) ? (couponsResp.data?.data ?? []) : [])
      setEvents([])
      setError(getErrorMessage(eventsResp.error))
      errorToast(getErrorMessage(eventsResp.error))
      setLoading(false)
      return
    }

    const listCoupons = couponsResp.data?.data ?? []
    const listEvents = eventsResp.data?.data ?? []

    setCoupons(Array.isArray(listCoupons) ? listCoupons : [])
    setEvents(Array.isArray(listEvents) ? listEvents : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load, reloadToken])

  const { query, setQuery, filtered } = useTableSearch(coupons, (row, q) => {
    const hay = `${row.code} ${row.type} ${row.event_name} ${row.status}`.toLowerCase()
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
      { key: 'event', header: 'Event', render: (c) => <span className="font-semibold">{c.event_name}</span> },
      {
        key: 'status',
        header: 'Status',
        render: (c) => (
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              String(c.status).toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
            )}
          >
            {String(c.status).toLowerCase() === 'active' ? 'active' : 'inactive'}
          </span>
        ),
      },
      {
        key: 'invoicesUsed',
        header: 'Invoices used',
        className: 'whitespace-nowrap',
        render: (c) => (
          <span>
            {Number(c.used_count ?? 0)}
            {Number(c.limit ?? 0) > 0 ? <span className="text-text-muted-light dark:text-text-muted-dark">/{Number(c.limit)}</span> : null}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'whitespace-nowrap',
        render: (c) => {
          const busy = actionId === c.id
          const isActive = String(c.status).toLowerCase() === 'active'

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setActionId(c.id)
                  try {
                    const resp = await HTTP<ApiData<CouponRow>, any>({
                      url: getEndpoint(`/dashboard/organizer/coupon/update-status/${encodeURIComponent(String(c.id))}`),
                      method: 'put',
                      data: { status: isActive ? 'inactive' : 'active' },
                    })

                    if (!resp.ok) {
                      errorToast(getErrorMessage(resp.error))
                      return
                    }

                    // optimistic local toggle
                    setCoupons((prev) =>
                      prev.map((x) => (x.id === c.id ? { ...x, status: isActive ? 'inactive' : 'active' } : x))
                    )
                  } finally {
                    setActionId(null)
                  }
                }}
                className={cn(
                  'rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                  busy && 'opacity-60 cursor-not-allowed'
                )}
              >
                {busy ? 'Working…' : isActive ? 'Make inactive' : 'Activate'}
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  const ok = confirm('Delete this coupon?')
                  if (!ok) return

                  setActionId(c.id)
                  try {
                    const resp = await HTTP<ApiData<unknown>, undefined>({
                      url: getEndpoint(`/dashboard/organizer/coupon/${encodeURIComponent(String(c.id))}`),
                      method: 'delete',
                    })

                    if (!resp.ok) {
                      errorToast(getErrorMessage(resp.error))
                      return
                    }

                    setCoupons((prev) => prev.filter((x) => x.id !== c.id))
                  } finally {
                    setActionId(null)
                  }
                }}
                className={cn('rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white', busy && 'opacity-60 cursor-not-allowed')}
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )
        },
      },
    ]
  }, [actionId])

  const eventOptions = useMemo(() => {
    return (events ?? []).map((e) => ({ id: String(e.id), name: e.title }))
  }, [events])

  function openModal() {
    setCreateError(null)
    setForm({
      code: '',
      startAt: '',
      endAt: '',
      type: 'percentage',
      value: 0,
      eventId: eventOptions[0]?.id ?? '',
      limit: -1,
    })
    setIsOpen(true)
  }

  async function onCreate() {
    setCreateError(null)

    const payload: CreateCouponPayload = {
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value) || 0,
      limit: Number(form.limit),
      event_id: String(form.eventId),
      start_date_time: form.startAt,
      end_date_time: form.endAt,
    }

    if (!payload.code) {
      setCreateError('Coupon code is required.')
      return
    }
    if (!payload.event_id) {
      setCreateError('Please select an event.')
      return
    }
    if (!payload.start_date_time || !payload.end_date_time) {
      setCreateError('Start and end date/time are required.')
      return
    }

    setCreating(true)

    const resp = await HTTP<ApiData<CouponRow>, CreateCouponPayload>({
      url: getEndpoint('/dashboard/organizer/coupon'),
      method: 'post',
      data: payload,
    })

    if (!resp.ok) {
      setCreateError(getErrorMessage(resp.error))
      setCreating(false)
      return
    }

    // If API returns only a message, fallback to reload.
    const created = resp.data?.data
    if (created) {
      setCoupons((prev) => [created, ...prev])
    } else {
      setReloadToken((t) => t + 1)
    }

    setCreating(false)
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

          <button
            type="button"
            onClick={openModal}
            disabled={loading || Boolean(error)}
            className={cn('rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white', (loading || Boolean(error)) && 'opacity-60 cursor-not-allowed')}
          >
            + Add new coupon
          </button>
        </div>

        <GlassCard className="mt-6 p-5">
          {loading ? (
            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">Loading coupons…</div>
          ) : error ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-red-700 dark:text-red-200">Couldn’t load coupons</div>
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
          ) : (
            <>
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
                  rowKey={(c) => String(c.id)}
                  emptyTitle="No coupons"
                  emptyDescription="Create your first coupon to start offering discounts."
                />
              </div>
            </>
          )}
        </GlassCard>

        <Dialog
          open={isOpen}
          onClose={(open) => {
            if (!open && !creating) setIsOpen(false)
          }}
          transition
          className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
              <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white">New coupon</DialogTitle>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Fill in the details to create a coupon.</p>

              {createError ? (
                <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">
                  {createError}
                </div>
              ) : null}

              <div className={cn('mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4', creating && 'opacity-60 pointer-events-none')}>
                <Input label="Code" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. TBM10" />
                <Select label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CouponType }))}>
                  <option value="fixed">fixed</option>
                  <option value="percentage">percentage</option>
                </Select>

                <Input label="Start date time" type="datetime-local" value={form.startAt} onChange={(e) => setForm((p) => ({ ...p, startAt: e.target.value }))} />
                <Input label="End date time" type="datetime-local" value={form.endAt} onChange={(e) => setForm((p) => ({ ...p, endAt: e.target.value }))} />

                <Input label="Value" type="number" value={String(form.value)} onChange={(e) => setForm((p) => ({ ...p, value: Number(e.target.value) }))} />

                <Input label="Limit" note="-1 = unlimited" type="number" min="-1" value={String(form.limit)} onChange={(e) => setForm((p) => ({ ...p, limit: Number(e.target.value) }))} />

                <Select label="Event" value={form.eventId} onChange={(e) => setForm((p) => ({ ...p, eventId: e.target.value }))}>
                  {eventOptions.length === 0 ? <option value="">No events</option> : null}
                  {eventOptions.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={creating}
                  className={cn(
                    'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                    creating && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onCreate}
                  disabled={creating}
                  className={cn('rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white', creating && 'opacity-60 cursor-not-allowed')}
                >
                  {creating ? 'Creating…' : 'Create coupon'}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </SidebarLayout>
  )
}
