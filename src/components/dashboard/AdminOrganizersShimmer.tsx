'use client'

import React from 'react'

export default function AdminOrganizersShimmer({ count = 8 }: { count?: number }) {
    return (
        <div className="mt-6" aria-busy="true" aria-live="polite">
            <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="h-10 w-full sm:w-[360px] rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                        <div className="h-8 w-56 rounded-full bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                    </div>
                    <div className="h-5 w-44 rounded bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                </div>

                <div className="mt-4 space-y-3">
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-3"
                        >
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-48 rounded bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                                <div className="h-4 w-64 rounded bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-24 rounded-lg bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                                <div className="h-8 w-28 rounded-lg bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
