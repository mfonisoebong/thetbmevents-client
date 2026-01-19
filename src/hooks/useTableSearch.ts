import { useMemo, useState } from 'react'

export function useTableSearch<T>(rows: T[], matcher: (row: T, query: string) => boolean) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return rows

    return rows.filter((r) => matcher(r, q))
  }, [rows, matcher, query])

  return { query, setQuery, filtered }
}
