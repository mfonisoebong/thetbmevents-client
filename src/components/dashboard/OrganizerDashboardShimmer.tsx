'use client'

import React from 'react'
import GlassCard from '../GlassCard'

export default function OrganizerDashboardShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={i} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-28 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-7 w-32 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                <div className="h-3 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
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
              <div className="h-5 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="h-4 w-56 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2 space-y-2">
                    <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="h-5 w-12 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  </div>
                  <div className="rounded-xl bg-black/5 dark:bg-black/30 px-3 py-2 space-y-2">
                    <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-4 w-56 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-7 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded-full animate-pulse" />
            <div className="h-4 w-16 ml-auto bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          </div>

          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-14 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 p-6">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4 space-y-2">
              <div className="h-3 w-20 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
