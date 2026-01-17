"use client"

import React, {useEffect, useState} from 'react'
import {currencySymbol} from '../../utils'
import {useRouter} from 'next/navigation'

type Group = { qty: number; name?: string; price?: number; currency?: string }

export default function Summary({ticketInstances, onContinueAction, disabled}: {
    ticketInstances: Array<{ id: string; name?: string; price?: number; currency?: string }>;
    onContinueAction?: () => void;
    disabled?: boolean
}) {
    const grouped: Record<string, Group> = {}
    ticketInstances.forEach((t) => {
        const key = t.name ?? t.id
        if (!grouped[key]) grouped[key] = {qty: 0, name: t.name, price: t.price, currency: t.currency}
        grouped[key].qty += 1
    })

    const [invalidVisit, setInvalidVisit] = useState<boolean>(false);

    const subtotal = ticketInstances.reduce((s, t) => s + (t.price ?? 0), 0)

    const router = useRouter()

    useEffect(() => {
        if (subtotal === 0) setInvalidVisit(true)

        if (invalidVisit && subtotal === 0) router.replace("/")
    }, [invalidVisit]);

    return (
        <div
            className="sticky top-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl p-5">
            <h3 className="text-sm text-slate-700 dark:text-slate-200">Your order</h3>
            <div className="mt-3 space-y-2">
                {Object.entries(grouped).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-300">{v.qty} x {v.name}</div>
                        <div className="font-medium">{v.price === 0 ? 'Free' : `${currencySymbol(v.currency)}${(v.price ?? 0).toLocaleString()}`}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-3 text-sm">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div>Fees</div>
                    <div>TBD</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div>Subtotal</div>
                    <div className="font-medium">{currencySymbol(ticketInstances[0]?.currency)}{subtotal.toLocaleString()}</div>
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Coupon code</label>
                <input disabled className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm" placeholder="Available at payment (step 3)"/>
            </div>

            <div className="mt-4 border-t bborder-black/10 dark:border-white/10 pt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-300">Total</div>
                <div className="text-lg font-semibold">{currencySymbol(ticketInstances[0]?.currency)}{subtotal.toLocaleString()}</div>
            </div>

            <div className="mt-4">
                <button onClick={onContinueAction} disabled={disabled} aria-disabled={disabled} className={`w-full inline-flex items-center justify-center gap-2 rounded-lg ${disabled ? 'bg-gray-400/60 cursor-not-allowed' : 'bg-brand-teal'} text-white px-6 py-2 font-medium`}>Continue</button>
            </div>
        </div>
    )
}
