import type { EventItem } from './types'
import { computeEventStats } from './eventStats'
import { makeMockOrganizers } from './organizersMock'

export type AdminTransactionStatus = 'success' | 'pending' | 'failed'

export type AdminTransactionRow = {
  id: string
  reference: string
  orderId: string
  eventName: string
  email: string
  chargedAmount: number
  currency: string
  status: AdminTransactionStatus
  createdAt: string
}

export type AdminTopOrganizerByRevenueRow = {
  organizerId: string
  organizerName: string
  revenue: number
  ticketsSold: number
}

export type AdminFinanceSummary = {
  totalRevenueAllTime: number
  recentTransactions: AdminTransactionRow[]
  topOrganizersByRevenue: AdminTopOrganizerByRevenueRow[]
}

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function pickStatus(seed: number): AdminTransactionStatus {
  const r = seed % 10
  if (r < 7) return 'success'
  if (r < 9) return 'pending'
  return 'failed'
}

function buildAllTransactions(events: EventItem[], now = new Date()): AdminTransactionRow[] {
  const organizers = makeMockOrganizers(18)

  const organizerForEvent = (eventId: string) => {
    const idx = Math.abs(Number(eventId) || 0) % organizers.length
    return organizers[idx] ?? organizers[0]
  }

  const eventStats = events.map((e) => {
    const stats = computeEventStats(e)
    const org = organizerForEvent(e.id)
    return {
      event: e,
      organizer: org,
      sold: stats.totalSold,
      revenue: stats.totalRevenue,
    }
  })

  const txs: AdminTransactionRow[] = []

  for (const x of eventStats) {
    const baseSeed = hashStringToNumber(`tx:${x.event.id}`)
    const txCount = (baseSeed % 4) + 1

    for (let i = 0; i < txCount; i++) {
      const seed = hashStringToNumber(`tx:${x.event.id}:${i}`)
      const email = `buyer${(seed % 9000) + 1000}@mail.com`
      const status = pickStatus(seed)

      // create some variation in charged amount
      const chargedAmount = Math.max(0, Math.round(((seed % 50000) + 1500) / 10) * 10)

      // distribute within last 21 days
      const createdAt = new Date(now.getTime() - ((seed % 21) * 24 + (seed % 24)) * 60 * 60 * 1000).toISOString()

      const reference = `TBM_${x.event.id}_${i}_${String(seed).slice(0, 6)}`
      const orderId = `ORD-${x.event.id}-${String(seed).slice(0, 8)}`

      txs.push({
        id: `${x.event.id}_${i}`,
        reference,
        orderId,
        eventName: x.event.title,
        email,
        chargedAmount,
        currency: 'NGN',
        status,
        createdAt,
      })
    }
  }

  txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return txs
}

export function buildAdminFinanceSummary(events: EventItem[], now = new Date()): AdminFinanceSummary {
  const organizers = makeMockOrganizers(18)

  const organizerForEvent = (eventId: string) => {
    const idx = Math.abs(Number(eventId) || 0) % organizers.length
    return organizers[idx] ?? organizers[0]
  }

  const eventStats = events.map((e) => {
    const stats = computeEventStats(e)
    const org = organizerForEvent(e.id)
    return {
      event: e,
      organizer: org,
      sold: stats.totalSold,
      revenue: stats.totalRevenue,
    }
  })

  const totalRevenueAllTime = eventStats.reduce((sum, x) => sum + x.revenue, 0)

  const txs = buildAllTransactions(events, now)
  const recentTransactions = txs.slice(0, 10)

  // Top organizers by revenue
  const byOrganizer = new Map<string, { organizerId: string; organizerName: string; revenue: number; ticketsSold: number }>()

  for (const x of eventStats) {
    const org = x.organizer
    const prev = byOrganizer.get(org.id) ?? { organizerId: org.id, organizerName: org.businessName, revenue: 0, ticketsSold: 0 }
    prev.revenue += x.revenue
    prev.ticketsSold += x.sold
    byOrganizer.set(org.id, prev)
  }

  const topOrganizersByRevenue = Array.from(byOrganizer.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  return {
    totalRevenueAllTime,
    recentTransactions,
    topOrganizersByRevenue,
  }
}

export function findTransactionByReference(events: EventItem[], reference: string, now = new Date()): AdminTransactionRow | null {
  const q = reference.trim().toLowerCase()
  if (!q) return null

  const txs = buildAllTransactions(events, now)
  return txs.find((t) => t.reference.toLowerCase() === q) ?? null
}
