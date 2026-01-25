'use client'

import React from 'react'
import GlassCard from '../GlassCard'

export default function OrganizerRevenueShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl animate-pulse" />
          <div className="h-10 w-36 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <GlassCard key={i} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-7 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-44 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="h-4 w-72 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>
          <div className="mt-6 grid grid-cols-12 gap-2 items-end h-48">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="col-span-3 sm:col-span-1 flex flex-col items-center gap-2">
                <div className="w-full">
                  <div className="w-full rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" style={{ height: `${Math.max(8, ((i % 6) + 1) * 12)}%` }} />
                </div>
                <div className="h-3 w-6 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-4 w-56 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              </div>
              <div className="mt-4 h-9 w-24 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="mt-2 h-4 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard className="mt-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-80 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>
          <div className="h-4 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2 space-y-2">
                  <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                </div>
                <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2 space-y-2">
                  <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
