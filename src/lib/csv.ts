type CsvValue = string | number | boolean | null | undefined

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  // Wrap in quotes if it contains a quote, comma, or newline
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function exportToCsv(filename: string, rows: Record<string, CsvValue>[], columns?: { key: string; header?: string }[]) {
  const cols = columns && columns.length > 0
    ? columns
    : Object.keys(rows[0] ?? {}).map((k) => ({ key: k, header: k }))

  const headerLine = cols.map((c) => escapeCsvValue(c.header ?? c.key)).join(',')
  const bodyLines = rows.map((row) => cols.map((c) => escapeCsvValue(row[c.key])).join(','))

  const csv = [headerLine, ...bodyLines].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}
