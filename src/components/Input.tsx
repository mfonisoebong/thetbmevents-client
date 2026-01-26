import React from "react";
import {cn} from "@lib/utils";

export default function Input({ label, note, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, note?: string }) {
    return (
        <label className="block">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
            <input
                {...props}
                className={cn(
                    'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                    props.className ?? ''
                )}
            />
            {note && <span className="mt-1 ml-2 block text-xs text-text-muted-light dark:text-text-muted-dark">{note}</span>}
        </label>
    )
}
