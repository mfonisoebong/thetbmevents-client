"use client"

import React from 'react'
import { currencySymbol } from '../../utils'

type Group = { qty: number; name?: string; price?: number; currency?: string }

export default function Summary({ ticketInstances, onContinueAction }: { ticketInstances: Array<{ id: string; name?: string; price?: number; currency?: string }>; onContinueAction?: () => void }) {
  const grouped: Record<string, Group> = {}
  ticketInstances.forEach((t) => {
    const key = t.name ?? t.id
    if (!grouped[key]) grouped[key] = { qty: 0, name: t.name, price: t.price, currency: t.currency }
    grouped[key].qty += 1
  })
  const subtotal = ticketInstances.reduce((s, t) => s + (t.price ?? 0), 0)

  return (
    <div className="sticky top-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm text-text-muted-light">Your order</h3>
      <div className="mt-3 space-y-2">
        {Object.entries(grouped).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <div className="text-sm text-text-muted-light">{v.qty} x {v.name}</div>
            <div className="font-medium">{v.price === 0 ? 'Free' : `${currencySymbol(v.currency)}${(v.price ?? 0).toLocaleString()}`}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-sm">
        <div className="flex items-center justify-between text-text-muted-light"><div>Fees</div><div>TBD</div></div>
        <div className="flex items-center justify-between mt-2"><div>Subtotal</div><div className="font-medium">{currencySymbol(ticketInstances[0]?.currency)}{subtotal.toLocaleString()}</div></div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Coupon code</label>
        <input disabled className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" placeholder="Enter coupon code (step 3)" />
      </div>

      <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between">
        <div className="text-sm text-text-muted-light">Total</div>
        <div className="text-lg font-semibold">{currencySymbol(ticketInstances[0]?.currency)}{subtotal.toLocaleString()}</div>
      </div>

      <div className="mt-4">
        <button onClick={onContinueAction} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-teal text-white px-6 py-2 font-medium">Continue</button>
      </div>
    </div>
  )
}
