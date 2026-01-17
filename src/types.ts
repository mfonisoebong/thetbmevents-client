import React from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode; // Optional icon for the option
    [key: string]: any; // Allow for extensibility
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
    image?: string;
    tags?: string[];
    isOnline?: boolean;
}
