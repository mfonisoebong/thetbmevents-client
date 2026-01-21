'use client'

import React, { useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, { type DataTableColumn } from '../../../../components/DataTable'
import { useTableSearch } from '../../../../hooks/useTableSearch'
import { categories as mockCategories, events as mockEvents } from '@lib/mockEvents'
import { cn } from '@lib/utils'

type CategoryRow = {
  id: string
  name: string
  eventsCount: number
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

function slugId(name: string) {
  return normalizeName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function uid() {
  return `cat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function buildCategoryRows(): CategoryRow[] {
  const base = (mockCategories ?? []).filter((c) => c && c.toLowerCase() !== 'all')
  const unique = Array.from(new Set(base.map((c) => normalizeName(String(c)))))

  const countByCategory = new Map<string, number>()
  for (const e of mockEvents ?? []) {
    const c = normalizeName(String((e as any)?.category ?? ''))
    if (!c) continue
    countByCategory.set(c, (countByCategory.get(c) ?? 0) + 1)
  }

  return unique
    .map((name) => ({
      id: slugId(name) || name,
      name,
      eventsCount: countByCategory.get(name) ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function CategoryModal({
  open,
  onClose,
  onCreate,
  existingNames,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
  existingNames: string[]
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setError(null)
  }

  function close() {
    reset()
    onClose()
  }

  function submit(e: React.FormEvent) {
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

    onCreate(n)
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
                className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
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
                className="mt-2 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />

              {error ? (
                <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                  Create
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
  const [rows, setRows] = useState<CategoryRow[]>(() => buildCategoryRows())
  const [createOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { query, setQuery, filtered } = useTableSearch(rows, (row, q) => {
    const hay = `${row.name}`.toLowerCase()
    return hay.includes(q)
  })

  const columns = useMemo((): DataTableColumn<CategoryRow>[] => {
    return [
      {
        key: 'name',
        header: 'Category',
        render: (r) => (
          <div className="min-w-[200px]">
            <div className="font-semibold text-gray-900 dark:text-white">{r.name}</div>
            <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">ID: {r.id}</div>
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
        render: (r) => (
          <button
            type="button"
            onClick={() => onDelete(r)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold border',
              r.eventsCount > 0
                ? 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/15'
                : 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200 hover:bg-rose-500/15'
            )}
            title={r.eventsCount > 0 ? 'Cannot delete categories that are used by events in demo data.' : 'Delete category'}
          >
            Delete
          </button>
        ),
      },
    ]

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  const existingNames = useMemo(() => rows.map((r) => r.name), [rows])

  function onCreate(name: string) {
    setToast(null)

    const id = slugId(name) || uid()
    const next: CategoryRow = { id, name, eventsCount: 0 }

    setRows((prev) => [next, ...prev].sort((a, b) => a.name.localeCompare(b.name)))
    setToast({ type: 'success', text: `Category “${name}” created.` })
  }

  function onDelete(r: CategoryRow) {
    setToast(null)

    if (r.eventsCount > 0) {
      setToast({ type: 'error', text: 'This category is used by existing events and cannot be deleted (demo constraint).' })
      return
    }

    const ok = window.confirm(`Delete category “${r.name}”? This can’t be undone.`)
    if (!ok) return

    setRows((prev) => prev.filter((x) => x.id !== r.id))
    setToast({ type: 'success', text: `Category “${r.name}” deleted.` })
  }

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Categories</h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Create and manage event categories (demo data from mockEvents).</p>
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
            />
          </div>

          <div className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark">
            Note: In this demo, categories referenced by mock events can’t be deleted.
          </div>
        </GlassCard>

        <CategoryModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={onCreate}
          existingNames={existingNames}
        />
      </div>
    </SidebarLayout>
  )
}
