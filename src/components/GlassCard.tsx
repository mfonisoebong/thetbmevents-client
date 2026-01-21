import {cn} from "@lib/utils";
import React from "react";

export default function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm shadow-sm',
                className ?? ''
            )}
        >
            {children}
        </div>
    )
}
