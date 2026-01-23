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

export type PaymentGateway = "paystack" | "flutterwave" | "chainpal";

export interface ApiData<T> {
    data: T;
    message: string;
}

export type Role = "admin" | "organizer" | (string & {});

