import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-black/10 dark:bg-white/10', className)} />
}

export default function AdminDashboardShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div>
        <ShimmerBlock className="h-7 w-48" />
        <ShimmerBlock className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
          <div key={i} className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
            <ShimmerBlock className="h-4 w-28" />
            <ShimmerBlock className="mt-4 h-8 w-24" />
            <ShimmerBlock className="mt-3 h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-5 w-44" />
          <ShimmerBlock className="mt-2 h-4 w-72" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
              <div key={i} className="flex items-center justify-between gap-3">
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="h-4 w-28" />
                <ShimmerBlock className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-5 w-32" />
          <ShimmerBlock className="mt-2 h-4 w-44" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
              <div key={i} className="flex items-center justify-between gap-3">
                <ShimmerBlock className="h-4 w-44" />
                <ShimmerBlock className="h-4 w-44" />
                <ShimmerBlock className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
