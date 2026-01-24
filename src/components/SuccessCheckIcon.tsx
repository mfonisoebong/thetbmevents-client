import React from 'react'
import {cn} from '@lib/utils'

type SuccessCheckIconProps = {
    /** Pixel size for both width and height. */
    size?: number
    /** Extra classes for the svg element. */
    className?: string
    /** Accessible label announced by screen readers. */
    label?: string
}

export default function SuccessCheckIcon({
    size = 36,
    className,
    label = 'Success',
}: SuccessCheckIconProps) {
    return (
        <svg
            role="img"
            aria-label={label}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={cn('text-emerald-500', className ?? '')}
        >
            <title>{label}</title>
            <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.2 14.2-3.4-3.4a1 1 0 0 1 1.414-1.414l2.693 2.693 5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0z"
            />
        </svg>
    )
}
