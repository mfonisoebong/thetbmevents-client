'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import AdminAttendeesShimmer from '../../../../components/dashboard/AdminAttendeesShimmer'
import HTTP from '@lib/HTTP'
import { getEndpoint, getErrorMessage } from '@lib/utils'
import type { ApiData, Attendee } from '@lib/types'

type AttendeeRow = {
  id: string
  full_name: string
  email: string
  ticket_name: string
}

function Modal({ open, onClose, row }: { open: boolean; onClose: () => void; row: AttendeeRow | null }) {
  return (
    <Dialog open={open} onClose={onClose} transition className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in">
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
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Full name</div>
                  <div className="mt-1 text-gray-900 dark:text-white font-semibold">{row.full_name}</div>
                </div>

                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Email</div>
                  <a className="mt-1 block text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                </div>

                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">Ticket</div>
                  <div className="mt-1 text-gray-900 dark:text-white">{row.ticket_name}</div>
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

function toAttendeeRow(a: Attendee): AttendeeRow {
  return {
    id: String(a.id),
    full_name: a.full_name,
    email: a.email,
    ticket_name: a.ticket_name,
  }
}

export default function AdminAttendeesPage() {
  const [rows, setRows] = useState<AttendeeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const loadAttendees = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<Attendee[]>, undefined>({
      url: getEndpoint('/dashboard/admin/attendees'),
      method: 'get',
    })

    if (!resp.ok || !resp.data) {
      setRows([])
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    const list = Array.isArray(resp.data.data) ? resp.data.data : []
    setRows(list.map(toAttendeeRow))
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadAttendees()
  }, [loadAttendees, reloadToken])

  const columns = useMemo((): DataTableColumn<AttendeeRow>[] => {
    return [
      {
        key: 'email',
        header: 'Email',
        render: (r) => (
          <a className="text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${r.email}`}>
            {r.email}
          </a>
        ),
      },
      {
        key: 'full_name',
        header: 'Full name',
        render: (r) => <span className="font-semibold text-gray-900 dark:text-white">{r.full_name}</span>,
      },
      {
        key: 'ticket_name',
        header: 'Ticket name',
        className: 'whitespace-nowrap',
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{r.ticket_name}</span>,
      },
    ]
  }, [])

  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => {
      const hay = `${row.full_name} ${row.email} ${row.ticket_name}`.toLowerCase()
      return hay.includes(q)
    })
  }, [rows, query])

  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<AttendeeRow | null>(null)
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

  if (loading) {
    return (
      <SidebarLayout>
        <AdminAttendeesShimmer />
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Attendees</h1>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t load attendees right now.</p>
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
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Attendees</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Recent activity and quick attendee lookup.</p>
          </div>

          <form onSubmit={onSearchSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or ticket…"
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attendees</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">All attendee purchases.</p>
            </div>

            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Total in list: <span className="font-semibold">{filtered.length}</span>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<AttendeeRow>
              columns={columns}
              rows={filtered}
              rowKey={(r) => r.id}
              emptyTitle="No attendees yet"
              emptyDescription="Attendees will appear once ticket purchases happen."
              pagination={{ enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
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
