import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-black/10 dark:bg-white/10', className)} />
}

export default function AdminAttendeesShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <ShimmerBlock className="h-7 w-44" />
          <ShimmerBlock className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <ShimmerBlock className="h-10 w-full sm:w-[340px]" />
          <ShimmerBlock className="h-10 w-24" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <ShimmerBlock className="h-5 w-56" />
            <ShimmerBlock className="mt-2 h-4 w-80 max-w-full" />
          </div>
          <ShimmerBlock className="h-4 w-32" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
            <div key={i} className="flex items-center justify-between gap-3">
              <ShimmerBlock className="h-4 w-56" />
              <ShimmerBlock className="h-4 w-40" />
              <ShimmerBlock className="h-4 w-44" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
