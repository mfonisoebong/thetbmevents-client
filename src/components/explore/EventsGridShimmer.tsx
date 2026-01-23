'use client'

import React from 'react'

export default function EventsGridShimmer({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-md"
        >
          <div className="w-full h-40 sm:h-44 lg:h-36 bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="pt-2 flex items-center justify-between">
              <div className="space-y-2 w-1/2">
                <div className="h-4 w-2/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              </div>
              <div className="h-9 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
