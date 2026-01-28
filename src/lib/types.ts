import React from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    [key: string]: any;
}

export interface Ticket {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    start_selling_date: string;
    end_selling_date: string;
    quantity: number;
}

export interface EventItem {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    date: string;
    time?: string;
    location?: string;
    category: string;
    image: string;
    tags?: string[];
    isOnline?: boolean;
    tickets: Ticket[];
    [key: string]: any;
}

export interface OrganizerTicket {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    start_selling_date: string;
    end_selling_date: string;
    quantity: number;
    sold: number;
    organizer_id: string;
    event_id: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizerEvent {
    id: string
    title: string
    slug: string
    description: string
    date: string
    time: string
    location: string
    category: string
    tags: any
    image: string
    isOnline: boolean
    tickets: OrganizerTicket[]
    status: string
    created_at: string
    updated_at: string
    total_tickets_sold: number
    total_revenue: number
}

export interface OrdersAndAttendees {
    orders: Order[]
    attendees: Attendee[]
}

export interface Order {
    id: string
    items: string[]
    amount: number
    status: string
    customer: Customer
    quantity: number
    date: string
}

export interface Customer {
    full_name: string
    email: string
    phone_number: string
}

export interface Attendee {
    id: number
    full_name: string
    email: string
    ticket_name: string
    checked_in: boolean
}

export type PaymentGateway = "paystack" | "flutterwave" | "chainpal";

export interface ApiData<T> {
    data: T;
    message: string;
}

export type Role = "admin" | "organizer" | (string & {});

export interface AdminFinanceSummary {
    all_time_revenue: string;
    recent_transactions: RecentTransaction[];
    top_organizers: TopOrganizer[];
}

export interface RecentTransaction {
    id: string;
    reference: string;
    event_name: string;
    email?: string;
    amount: number;
    currency: any;
    status: string;
    created_at: string;
}

export interface TopOrganizer {
    title: string;
    organizer: string;
    avatar?: string;
    email: string;
    tickets_sold: number;
    total_sales: number;
    id: string;
}

export interface AdminDashboardOverview {
    revenue_this_month: string;
    total_events: number;
    events_this_month: number;
    total_organizers: number;
    revenue_past_12_months: RevenuePast12Month[];
    top_organizers: TopOrganizer[];
}

export interface RevenuePast12Month {
    month: string;
    year: number;
    revenue: number;
}

export interface Category {
    id: string;
    slug: string;
    category: string;
    icon?: any;
    events_count: number;
}
