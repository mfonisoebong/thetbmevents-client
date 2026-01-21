'use client'

import React, { useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { useTableSearch } from '../../../../hooks/useTableSearch'
import { currencySymbol, formatNumber } from '@lib/utils'
import { makeMockAttendees, type AdminAttendeeRow } from '@lib/adminAttendeesMock'

function Modal({ open, onClose, row }: { open: boolean; onClose: () => void; row: AdminAttendeeRow | null }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 shadow-xl">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">Attendee</div>
                <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Search result</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
              >
                Close
              </button>
            </div>

            {row ? (
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Name</div>
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">{row.name}</div>
                </div>

                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Email</div>
                  <a className="mt-1 block text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Event</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{row.event}</div>
                  </div>
                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Ticket</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{row.ticketPurchased}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Total spent</div>
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                    {currencySymbol('NGN')}
                    {formatNumber(row.totalSpent)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">No attendee selected.</div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default function AdminAttendeesPage() {
  const all = useMemo(() => makeMockAttendees(60), [])
  const recent = useMemo(() => all.slice(0, 10), [all])

  const columns = useMemo((): DataTableColumn<AdminAttendeeRow>[] => {
    return [
      {
        key: 'name',
        header: 'Name',
        render: (r) => (
          <div className="min-w-[180px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.name}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">{r.email}</div>
          </div>
        ),
      },
      {
        key: 'event',
        header: 'Event',
        render: (r) => <span className="text-gray-900 dark:text-white">{r.event}</span>,
      },
      {
        key: 'ticketPurchased',
        header: 'Ticket purchased',
        className: 'whitespace-nowrap',
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{r.ticketPurchased}</span>,
      },
      {
        key: 'totalSpent',
        header: 'Total spent',
        className: 'whitespace-nowrap',
        render: (r) => (
          <span className="font-semibold">
            {currencySymbol('NGN')}
            {formatNumber(r.totalSpent)}
          </span>
        ),
      },
    ]
  }, [])

  const { query, setQuery, filtered } = useTableSearch(all, (row, q) => {
    const hay = `${row.name} ${row.email}`.toLowerCase()
    return hay.includes(q)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<AdminAttendeeRow | null>(null)
  const [notFound, setNotFound] = useState(false)

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()

    const q = query.trim().toLowerCase()
    if (!q) return

    const first = filtered[0] ?? null
    setSelected(first)
    setNotFound(!first)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setNotFound(false)
  }

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Attendees</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Recent activity and quick attendee lookup.</p>
          </div>

          <form onSubmit={onSearchSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full sm:w-[340px] rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button type="submit" className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
              Search
            </button>
          </form>
        </div>

        <GlassCard className="mt-6 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">10 recent attendees</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Last 10 attendee purchases (demo data).</p>
            </div>

            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Total in list: <span className="font-semibold">{recent.length}</span>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<AdminAttendeeRow>
              columns={columns}
              rows={recent}
              rowKey={(r) => r.id}
              emptyTitle="No attendees yet"
              emptyDescription="Attendees will appear once ticket purchases happen."
            />
          </div>
        </GlassCard>

        <Modal open={modalOpen} onClose={closeModal} row={selected} />

        {modalOpen && notFound ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            No attendee matched that search.
          </div>
        ) : null}
      </div>
    </SidebarLayout>
  )
}
