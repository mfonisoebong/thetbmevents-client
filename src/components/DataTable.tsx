import React from 'react'
import { cn } from '@lib/utils'

export type DataTableColumn<T> = {
  key: string
  header: React.ReactNode
  className?: string
  render: (row: T) => React.ReactNode
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
}) {
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
              rows.map((row) => (
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
    </div>
  )
}
