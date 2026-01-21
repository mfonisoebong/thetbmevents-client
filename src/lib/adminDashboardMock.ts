import type { EventItem } from './types'
import { computeEventStats } from './eventStats'
import { makeMockOrganizers } from './organizersMock'

const ADMIN_NET_REVENUE_RATE = 0.08

function computeAdminNetRevenue(grossRevenue: number) {
  // For the admin dashboard, "net revenue" represents the platform's take.
  return Math.round(grossRevenue * ADMIN_NET_REVENUE_RATE)
}

export type AdminRevenueMonth = {
  month: string // YYYY-MM
  revenue: number
  netRevenue: number
}

export type AdminTopEventRow = {
  eventId: string
  organizerName: string
  eventName: string
  ticketsSold: number
  revenue: number
}

export type AdminDashboardSummary = {
  revenueThisMonth: number
  netRevenueThisMonth: number
  totalEventsOverall: number
  totalEventsThisMonth: number
  totalOrganizers: number
  revenueByMonth: AdminRevenueMonth[]
  topEvents: AdminTopEventRow[]
}

function monthKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function addMonths(date: Date, delta: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + delta)
  return d
}

export function buildAdminDashboardSummary(events: EventItem[], now = new Date()): AdminDashboardSummary {
  const organizers = makeMockOrganizers(18)

  // Assign a deterministic organizer per event.
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
      month: monthKey(new Date(e.date)),
    }
  })

  const thisMonthKey = monthKey(now)

  const revenueThisMonth = eventStats
    .filter((x) => x.month === thisMonthKey)
    .reduce((sum, x) => sum + x.revenue, 0)

  const netRevenueThisMonth = computeAdminNetRevenue(revenueThisMonth)

  const totalEventsOverall = events.length
  const totalEventsThisMonth = eventStats.filter((x) => x.month === thisMonthKey).length
  const totalOrganizers = organizers.length

  // Revenue by month (last 12 months incl. current)
  const months = Array.from({ length: 12 }).map((_, i) => monthKey(addMonths(now, -(11 - i))))

  const revenueByMonth = months.map((m) => {
    const revenue = eventStats.filter((x) => x.month === m).reduce((sum, x) => sum + x.revenue, 0)
    const netRevenue = computeAdminNetRevenue(revenue)
    return { month: m, revenue, netRevenue }
  })

  const topEvents = [...eventStats]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8)
    .map((x) => ({
      eventId: x.event.id,
      organizerName: x.organizer.businessName,
      eventName: x.event.title,
      ticketsSold: x.sold,
      revenue: x.revenue,
    }))

  return {
    revenueThisMonth,
    netRevenueThisMonth,
    totalEventsOverall,
    totalEventsThisMonth,
    totalOrganizers,
    revenueByMonth,
    topEvents,
  }
}
