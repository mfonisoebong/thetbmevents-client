import React from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode; // Optional icon for the option
    [key: string]: any; // Allow for extensibility
}

// Ticket type for events (removed `isFree` — price === 0 indicates free ticket)
export interface Ticket {
    id?: string; // optional unique id for the ticket
    name: string; // ticket name (e.g., "General Admission", "Early Bird")
    price: number; // price when paid (store as a number, e.g., in local currency units). 0 means free.
    currency?: string; // optional currency code (e.g., "NGN", "USD")
    start_selling_date: string; // ISO date string when ticket sales start
    end_selling_date: string; // ISO date string when ticket sales end
    description?: string; // optional description
    quantity: number; // number of tickets available (0 means unlimited)
}

// Added Event type for explore page and event components
export interface EventItem {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO date
    time?: string;
    location?: string;
    category: string;
    image: string;
    tags?: string[];
    isOnline?: boolean;
    tickets: Ticket[]; // optional array of tickets for the event
}
