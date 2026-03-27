import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-r from-black/10 via-black/5 to-black/10 dark:from-white/10 dark:via-white/5 dark:to-white/10 bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  )
}

export default function AdminFinanceShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <ShimmerBlock className="h-8 w-40" />
          <ShimmerBlock className="mt-3 h-4 w-[32rem] max-w-full" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-4 w-48" />
          <ShimmerBlock className="mt-4 h-9 w-40" />
          <ShimmerBlock className="mt-3 h-4 w-32" />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
        <ShimmerBlock className="h-5 w-52" />
        <ShimmerBlock className="mt-3 h-4 w-64" />

        {/* Table header */}
        <div className="mt-5 grid grid-cols-12 gap-3">
          <ShimmerBlock className="h-4 col-span-3" />
          <ShimmerBlock className="h-4 col-span-3" />
          <ShimmerBlock className="h-4 col-span-3" />
          <ShimmerBlock className="h-4 col-span-3" />
        </div>

        {/* Table rows */}
        <div className="mt-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
            <div key={i} className="grid grid-cols-12 gap-3 items-center">
              <ShimmerBlock className="h-4 col-span-3" />
              <ShimmerBlock className="h-4 col-span-3" />
              <ShimmerBlock className="h-4 col-span-3" />
              <ShimmerBlock className="h-4 col-span-2" />
              <ShimmerBlock className="h-6 col-span-1 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Verify transaction */}
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-5 w-52" />
          <ShimmerBlock className="mt-3 h-4 w-[28rem] max-w-full" />

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <ShimmerBlock className="h-10 w-full" />
            <ShimmerBlock className="h-10 w-28" />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
                key={i}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4"
              >
                <ShimmerBlock className="h-3 w-24" />
                <ShimmerBlock className="mt-3 h-5 w-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Top organizers */}
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-5 w-44" />
          <ShimmerBlock className="mt-3 h-4 w-56" />

          {/* List/table rows */}
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <ShimmerBlock className="h-4 col-span-1" />
                <ShimmerBlock className="h-4 col-span-5" />
                <ShimmerBlock className="h-4 col-span-3" />
                <ShimmerBlock className="h-4 col-span-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
