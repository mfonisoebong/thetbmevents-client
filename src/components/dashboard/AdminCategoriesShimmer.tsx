import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-black/10 dark:bg-white/10', className)} />
}

export default function AdminCategoriesShimmer({ count = 10 }: { count?: number }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <ShimmerBlock className="h-7 w-40" />
          <ShimmerBlock className="mt-3 h-4 w-96 max-w-full" />
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
          <ShimmerBlock className="h-10 w-full sm:w-[320px]" />
          <ShimmerBlock className="h-10 w-32" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <ShimmerBlock className="h-5 w-44" />
            <ShimmerBlock className="mt-2 h-4 w-72" />
          </div>
          <ShimmerBlock className="h-4 w-40" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
            <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-3">
              <div className="flex-1 space-y-2">
                <ShimmerBlock className="h-5 w-56" />
                <ShimmerBlock className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <ShimmerBlock className="h-4 w-12" />
                <ShimmerBlock className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
