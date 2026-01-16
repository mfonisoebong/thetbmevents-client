import React from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode; // Optional icon for the option
    [key: string]: any; // Allow for extensibility
}
