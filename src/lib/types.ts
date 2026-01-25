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

export type PaymentGateway = "paystack" | "flutterwave" | "chainpal";

export interface ApiData<T> {
    data: T;
    message: string;
}

export type Role = "admin" | "organizer" | (string & {});

type EventStatus = 'Ended' | 'Draft' | 'Sold Out' | 'Published' | (string & {})
