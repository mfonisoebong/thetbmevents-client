import { SameType } from "@common/typings"

export type RevenueOverview = SameType<
  "net_revenue" | "net_commision" | "revenue_rate" | "commision_rate",
  number
>

export interface RevenueCardProps {
  title: string
  value: number
  rate: number
  theme: "light" | "dark"
}
export interface Customer {
  id: string
  email: string
  avatar?: string
  total_tickets: number
  name: string
}

export interface Organizer {
  title: string
  organizer: string
  email: string

  tickets_sold: number
  id: string
  avatar?: string
}

export interface OrganizerProps extends Organizer {}
