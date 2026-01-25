'use client'

import React from 'react'

export default function OrganizerEventsListShimmer({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          <div className="h-4 w-72 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 p-4">
            <div className="h-4 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="mt-3 h-7 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-44 sm:h-auto flex-shrink-0 bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />

              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-2/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="pt-2 space-y-2">
                      <div className="h-4 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                      <div className="h-4 w-56 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="w-40 space-y-3">
                    <div className="h-7 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse ml-auto" />
                    <div className="h-4 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse ml-auto" />
                    <div className="h-5 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse ml-auto" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-44 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse" />
                  <div className="h-8 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 w-32 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-9 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
