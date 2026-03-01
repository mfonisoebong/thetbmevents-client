import React from 'react'
import { cn } from '@lib/utils'

function ShimmerBlock({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-black/10 dark:bg-white/10', className)} />
}

export default function AdminEventsShimmer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <ShimmerBlock className="h-7 w-36" />
          <ShimmerBlock className="mt-3 h-4 w-[520px] max-w-full" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <ShimmerBlock className="h-10 w-28" />
          <ShimmerBlock className="h-10 w-28" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-10 w-[360px] max-w-full" />
          </div>
          <ShimmerBlock className="h-4 w-40" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholder
              key={i}
              className="grid grid-cols-12 gap-3 items-center"
            >
              <div className="col-span-4">
                <ShimmerBlock className="h-4 w-64" />
                <ShimmerBlock className="mt-2 h-3 w-32" />
              </div>
              <div className="col-span-2">
                <ShimmerBlock className="h-4 w-28" />
              </div>
              <div className="col-span-3">
                <ShimmerBlock className="h-4 w-44" />
              </div>
              <div className="col-span-1">
                <ShimmerBlock className="h-6 w-20" />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <ShimmerBlock className="h-8 w-20" />
                <ShimmerBlock className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

