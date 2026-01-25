'use client'

import React from 'react'

export default function OrganizerEventDetailsShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-72 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-60 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg animate-pulse" />
            <div className="h-10 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-2">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
              <div className="h-4 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-3 h-7 w-32 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-2 h-4 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5">
              <div className="h-5 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-3 h-4 w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-2 h-4 w-5/6 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-2 h-4 w-2/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
