import { OverviewCardProps } from "@lib/dashboard-overview/typings"
import { WithClickAwayActionProps } from "@common/typings"

export interface CommonCardProps extends OverviewCardProps {
  body: string
}

export interface CustomerRowProps {
  username: string
  tickets: number
}

export interface DatePickerContextValues {
  date: Date
  nextDate: () => void
  prevDate: () => void
}

export interface FinanceData {
  tickets_sold: number
  commision_rate: number
  revenue_overview: RevenueOverview
  highest_selling_events: HighestSellingEvent[]
  overview: RevenueOverview[]
  topCustomers: TopCustomer[]
}

export interface TopCustomer {
  total_tickets: number
  name: string
}

export interface HighestSellingEvent {
  id: string
  title: string
  logo: string
  tickets: number
  created_at: string
}

export interface RevenueOverview {
  commision: number
  profit: number
  revenue: number
}

export interface DateOptionsProps extends WithClickAwayActionProps {
  from?: string
  to?: string
  className?: string
}

export interface FromToDate {
  from: string
  to: string
}

export interface EventProps {
  name: string
  tickets: number
  image: string
}
