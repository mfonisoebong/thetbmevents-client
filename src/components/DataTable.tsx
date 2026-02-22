import React, { useEffect, useMemo, useState } from 'react'
import { cn } from '@lib/utils'

export type DataTableColumn<T> = {
  key: string
  header: React.ReactNode
  className?: string
  render: (row: T) => React.ReactNode
}

type PaginationConfig = {
  /** Enable pagination. If omitted/false, DataTable behaves exactly as before. */
  enabled?: boolean
  /** Initial items per page. Defaults to 25. */
  pageSize?: number
  /** Page size dropdown options. Defaults to [10, 25, 50, 100]. */
  pageSizeOptions?: number[]
  /** Whether to show the page size selector. Defaults to true when enabled. */
  showPageSizeSelector?: boolean
  /** Whether to show the "x–y of z" range text. Defaults to true when enabled. */
  showRange?: boolean
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  pagination,
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  pagination?: PaginationConfig
}) {
  const paginationEnabled = Boolean(pagination?.enabled)

  const pageSizeOptions = useMemo(() => {
    const defaults = [10, 25, 50, 100]
    const raw = pagination?.pageSizeOptions?.length ? pagination.pageSizeOptions : defaults
    // Ensure unique, sorted, positive
    return Array.from(new Set(raw.filter((n) => Number.isFinite(n) && n > 0))).sort((a, b) => a - b)
  }, [pagination?.pageSizeOptions])

  const initialPageSize = useMemo(() => {
    const provided = pagination?.pageSize
    return typeof provided === 'number' && provided > 0 ? provided : 25
  }, [pagination?.pageSize])

  const [pageSize, setPageSize] = useState(initialPageSize)
  const [page, setPage] = useState(1)

  // Keep state in sync with prop changes.
  useEffect(() => {
    setPageSize(initialPageSize)
    setPage(1)
  }, [initialPageSize])

  // If rows shrink due to search/filter, keep page in-bounds.
  useEffect(() => {
    if (!paginationEnabled) return
    const totalPages = Math.max(1, Math.ceil(rows.length / Math.max(1, pageSize)))
    if (page > totalPages) setPage(totalPages)
  }, [paginationEnabled, rows.length, page, pageSize])

  const total = rows.length
  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(total / Math.max(1, pageSize))) : 1

  const pagedRows = useMemo(() => {
    if (!paginationEnabled) return rows
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [paginationEnabled, rows, page, pageSize])

  const rangeText = useMemo(() => {
    if (!paginationEnabled) return null
    if (total === 0) return '0 of 0'
    const start = (page - 1) * pageSize + 1
    const end = Math.min(total, page * pageSize)
    return `${start}–${end} of ${total}`
  }, [paginationEnabled, total, page, pageSize])

  const showFooter = paginationEnabled && total > 0
  const showPageSizeSelector = pagination?.showPageSizeSelector ?? true
  const showRange = pagination?.showRange ?? true

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black/10 dark:divide-white/10">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark',
                    c.className ?? ''
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{emptyTitle}</div>
                  {emptyDescription ? (
                    <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{emptyDescription}</div>
                  ) : null}
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-black/5 dark:hover:bg-white/5">
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-4 py-3 text-sm text-gray-900 dark:text-white', c.className ?? '')}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFooter ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            {showRange ? (
              <div className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">{rangeText}</div>
            ) : null}

            {showPageSizeSelector ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Rows</span>
                <select
                  className="rounded-lg bg-white/60 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 px-2 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={pageSize}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setPageSize(next)
                    setPage(1)
                  }}
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {!pageSizeOptions.includes(pageSize) ? <option value={pageSize}>{pageSize}</option> : null}
                </select>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page <= 1}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border border-black/10 dark:border-white/10',
                page <= 1
                  ? 'opacity-50 cursor-not-allowed text-text-muted-light dark:text-text-muted-dark bg-white/10 dark:bg-white/5'
                  : 'text-gray-900 dark:text-white bg-white/10 dark:bg-white/5 hover:bg-white/20'
              )}
            >
              First
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border border-black/10 dark:border-white/10',
                page <= 1
                  ? 'opacity-50 cursor-not-allowed text-text-muted-light dark:text-text-muted-dark bg-white/10 dark:bg-white/5'
                  : 'text-gray-900 dark:text-white bg-white/10 dark:bg-white/5 hover:bg-white/20'
              )}
            >
              Prev
            </button>

            <div className="px-2 text-xs font-semibold text-gray-900 dark:text-white">
              Page {page} / {totalPages}
            </div>

            <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold border border-black/10 dark:border-white/10',
                    page >= totalPages
                        ? 'opacity-50 cursor-not-allowed text-text-muted-light dark:text-text-muted-dark bg-white/10 dark:bg-white/5'
                        : 'text-gray-900 dark:text-white bg-white/10 dark:bg-white/5 hover:bg-white/20'
                )}
            >
              Next
            </button>

            <button
                type="button"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold border border-black/10 dark:border-white/10',
                    page >= totalPages
                        ? 'opacity-50 cursor-not-allowed text-text-muted-light dark:text-text-muted-dark bg-white/10 dark:bg-white/5'
                        : 'text-gray-900 dark:text-white bg-white/10 dark:bg-white/5 hover:bg-white/20'
                )}
            >
              Last
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
