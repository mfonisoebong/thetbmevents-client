import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-black/10 dark:bg-white/10', className)} />
}

export default function AdminFinanceShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <ShimmerBlock className="h-7 w-40" />
          <ShimmerBlock className="mt-3 h-4 w-96 max-w-full" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-4 w-40" />
          <ShimmerBlock className="mt-4 h-8 w-48" />
          <ShimmerBlock className="mt-3 h-4 w-28" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
          <ShimmerBlock className="h-5 w-56" />
          <ShimmerBlock className="mt-3 h-4 w-96 max-w-full" />
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

        <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
          <ShimmerBlock className="h-5 w-36" />
          <ShimmerBlock className="mt-3 h-4 w-44" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <ShimmerBlock className="h-4 w-44" />
                <ShimmerBlock className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
        <ShimmerBlock className="h-5 w-52" />
        <ShimmerBlock className="mt-3 h-4 w-72" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <ShimmerBlock className="h-4 w-32" />
              <ShimmerBlock className="h-4 w-40" />
              <ShimmerBlock className="h-4 w-28" />
              <ShimmerBlock className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
