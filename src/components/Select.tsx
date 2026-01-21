import {cn} from "@lib/utils";
import React from "react";

export default function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
            <select
                {...props}
                className={cn(
                    'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                    props.className ?? ''
                )}
            >
                {children}
            </select>
        </label>
    )
}
