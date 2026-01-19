import type { EventItem } from './types'

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export type EventStats = {
  totalSold: number
  totalAvailable: number
  totalRevenue: number
  hasUnlimited: boolean
}

export function computeEventStats(event: EventItem): EventStats {
  // Deterministic sold counts for demo purposes based on ids
  let totalSold = 0
  let totalRevenue = 0
  let totalAvailable = 0
  let hasUnlimited = false

  for (const t of event.tickets ?? []) {
    const seed = hashStringToNumber(`${event.id}:${t.id}`)

    // if quantity === 0 treat as unlimited; show a modest sold number
    let sold = 0
    if ((t.quantity ?? 0) === 0) {
      hasUnlimited = true
      sold = (seed % 50) + 5
    } else {
      // sold between 0 and quantity
      sold = Math.min(t.quantity, Math.round(((seed % 70) / 100) * t.quantity))
    }

    totalSold += sold
    totalAvailable += t.quantity ?? 0
    totalRevenue += sold * (t.price ?? 0)
  }

  return { totalSold, totalAvailable, totalRevenue, hasUnlimited }
}

export type EventStatus = 'Ended' | 'Draft' | 'Sold Out' | 'Published'

export function eventStatus(event: EventItem, stats: Pick<EventStats, 'totalSold' | 'totalAvailable' | 'hasUnlimited'>): EventStatus {
  const today = new Date()
  const evDate = new Date(event.date)

  // Compare against start-of-today so the event stays "Published" on the day.
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  if (evDate.getTime() < startOfToday) return 'Ended'

  if (!event.tickets || event.tickets.length === 0) return 'Draft'

  if (!stats.hasUnlimited && stats.totalAvailable > 0 && stats.totalSold >= stats.totalAvailable) return 'Sold Out'

  return 'Published'
}
