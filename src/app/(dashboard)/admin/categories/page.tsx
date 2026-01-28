'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import AdminCategoriesShimmer from '../../../../components/dashboard/AdminCategoriesShimmer'
import HTTP from '@lib/HTTP'
import { cn, getEndpoint, getErrorMessage } from '@lib/utils'
import type { ApiData, Category } from '@lib/types'

type CategoryRow = {
  id: string
  slug: string
  name: string
  eventsCount: number
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

function toRow(c: Category): CategoryRow {
  return {
    id: c.id,
    slug: c.slug,
    name: c.category,
    eventsCount: c.events_count ?? 0,
  }
}

function CategoryModal({
  open,
  onClose,
  onCreate,
  existingNames,
  isSubmitting,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void> | void
  existingNames: string[]
  isSubmitting?: boolean
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setError(null)
  }

  function close() {
    if (isSubmitting) return
    reset()
    onClose()
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    const n = normalizeName(name)
    if (!n) {
      setError('Please enter a category name.')
      return
    }

    const exists = existingNames.some((x) => normalizeName(x).toLowerCase() === n.toLowerCase())
    if (exists) {
      setError('That category already exists.')
      return
    }

    await onCreate(n)
    close()
  }

  return (
    <Dialog open={open} onClose={close} transition className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 shadow-xl">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">New category</div>
                <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create a category for organizing events.</div>
              </div>
              <button
                type="button"
                onClick={close}
                disabled={isSubmitting}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>

            <form onSubmit={submit} className="mt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                Category name
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="e.g. Sports"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:opacity-60 disabled:cursor-not-allowed"
              />

              {error ? (
                <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</div>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={isSubmitting}
                  className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [query, setQuery] = useState('')

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    const resp = await HTTP<ApiData<Category[]>, undefined>({
      url: getEndpoint('/dashboard/admin/categories'),
      method: 'get',
    })

    if (!resp.ok || !resp.data) {
      setRows([])
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    const items = Array.isArray(resp.data.data) ? resp.data.data : []
    setRows(items.map(toRow).sort((a, b) => a.name.localeCompare(b.name)))
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories, reloadToken])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => row.name.toLowerCase().includes(q))
  }, [rows, query])

  const existingNames = useMemo(() => rows.map((r) => r.name), [rows])

  const columns = useMemo((): DataTableColumn<CategoryRow>[] => {
    return [
      {
        key: 'name',
        header: 'Category',
        render: (r) => (
          <div className="min-w-[220px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.name}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">Slug: {r.slug}</div>
          </div>
        ),
      },
      {
        key: 'eventsCount',
        header: 'Events',
        className: 'whitespace-nowrap',
        render: (r) => <span className="text-text-muted-light dark:text-text-muted-dark">{r.eventsCount}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'whitespace-nowrap',
        render: (r) => {
          const cannotDelete = r.eventsCount > 0

          return (
            <button
              type="button"
              onClick={() => {
                if (cannotDelete) return
                void onDelete(r)
              }}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200 hover:bg-rose-500/15 disabled:opacity-60 disabled:cursor-not-allowed'
              )}
              title={cannotDelete ? 'Can’t delete a category with events.' : 'Delete category'}
              disabled={cannotDelete}
            >
              Delete
            </button>
          )
        },
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  async function onCreate(name: string) {
    setToast(null)
    setCreating(true)

    const resp = await HTTP<ApiData<Category>, { name: string }>({
      url: getEndpoint('/dashboard/admin/categories'),
      method: 'post',
      // Backend says only required field is name.
      data: { name },
    })

    setCreating(false)

    if (!resp.ok || !resp.data) {
      setToast({ type: 'error', text: getErrorMessage(resp.error) })
      return
    }

    const created = resp.data.data
    setRows((prev) => [toRow(created), ...prev].sort((a, b) => a.name.localeCompare(b.name)))
    setToast({ type: 'success', text: `Category “${normalizeName(name)}” created.` })
  }

  async function onDelete(r: CategoryRow) {
    setToast(null)

    const ok = window.confirm(`Delete category “${r.name}”? This can’t be undone.`)
    if (!ok) return

    const resp = await HTTP<ApiData<any>, undefined>({
      url: getEndpoint(`/dashboard/admin/categories/${encodeURIComponent(r.id)}`),
      method: 'delete',
    })

    if (!resp.ok) {
      setToast({ type: 'error', text: getErrorMessage(resp.error) })
      return
    }

    setRows((prev) => prev.filter((x) => x.id !== r.id))
    setToast({ type: 'success', text: `Category “${r.name}” deleted.` })
  }

  if (loading) {
    return (
      <SidebarLayout>
        <AdminCategoriesShimmer />
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Categories</h1>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">We couldn’t load categories right now.</p>
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
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Categories</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create and manage event categories.</p>
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              className="w-full sm:w-[320px] rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              New category
            </button>
          </div>
        </div>

        {toast ? (
          <div
            className={cn(
              'mt-5 rounded-xl border p-3 text-sm',
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-200'
            )}
          >
            {toast.text}
          </div>
        ) : null}

        <GlassCard className="mt-6 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">All categories</h2>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{rows.length}</span>.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <DataTable<CategoryRow>
              columns={columns}
              rows={filtered}
              rowKey={(r) => r.id}
              emptyTitle="No categories"
              emptyDescription="Create your first category to organize events."
              pagination={{ enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
            />
          </div>
        </GlassCard>

        <CategoryModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={onCreate}
          existingNames={existingNames}
          isSubmitting={creating}
        />
      </div>
    </SidebarLayout>
  )
}
