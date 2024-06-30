export interface CardHeaderProps {
  title: string
}

export interface OverviewDataProps {
  title: string
  value: number
  className?: string
}

export interface EventProps {
  logo: string
  title: string
  type: string
  ticketSold: number
}

export interface OrganizerTableRowProps {
  name: string
  ticket: {
    name: string
    sold: number
  }
}

export interface CustomerProps {
  avatar?: string
  name: string
  email: string
  id: string
  totalTicket?: number
}

export interface RevenueOverviewData {
  net_revenue: number
  net_commision: number
}

export interface EventsOverviewData {
  tickets_sold: number
  events_created: number
  staffs: number
  users: number
  organizers: number
}

export interface RevenueData {
  net_revenue: number
  net_commision: number
}

export interface Organizer {
  title: string
  organizer: string
  tickets_sold: number
  id: string
}
export interface Customer {
  id: string
  email: string
  avatar?: string
  total_tickets: number
  name: string
}

export interface EventData {
  id: string
  title: string
  logo: string
  type: string
  tickets_sold: number
}
export interface OverviewData {
  revenue: RevenueData[]
  top_organizers: Organizer[]
  top_customers: Customer[]
  latest_events: EventData[]
}

export interface RevenueCardProps {
  title: string
  value: number
}
