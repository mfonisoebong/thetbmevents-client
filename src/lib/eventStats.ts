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

/**
 * Computes organizer dashboard stats using API-provided aggregates when present.
 *
 * This is used by dashboard screens that already receive `total_tickets_sold`
 * and `total_revenue` from the backend.
 */
export function computeEventStatsFromApi(
  event: Pick<EventItem, 'tickets' | 'total_tickets_sold' | 'total_revenue'>,
): EventStats {
  const totalSold = Number((event as any)?.total_tickets_sold ?? 0)
  const totalRevenue = Number((event as any)?.total_revenue ?? 0)

  const totalAvailable = ((event as any)?.tickets ?? []).reduce(
    (s: number, t: any) => s + Number(t?.quantity ?? 0),
    0,
  )

  const hasUnlimited = ((event as any)?.tickets ?? []).some((t: any) => Number(t?.quantity ?? 0) === 0)

  return { totalSold, totalRevenue, totalAvailable, hasUnlimited }
}

export type EventStatus = 'Ended' | 'Draft' | 'Sold Out' | 'Published'
