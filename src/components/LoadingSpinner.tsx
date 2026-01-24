import React from 'react'
import {cn} from '@lib/utils'

type LoadingSpinnerProps = {
    /** Pixel size for both width and height. */
    size?: number
    /** Extra classes for the outer svg element. */
    className?: string
    /** Accessible label announced by screen readers. */
    label?: string
}

export default function LoadingSpinner({
    size = 20,
    className,
    label = 'Loading',
}: LoadingSpinnerProps) {
    return (
        <svg
            role="status"
            aria-label={label}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={cn('animate-spin text-text-muted-light dark:text-text-muted-dark', className ?? '')}
        >
            <title>{label}</title>
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    )
}
