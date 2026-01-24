"use client"

import React from 'react'
import {currencySymbol} from '@lib/utils'

type Group = { qty: number; name?: string; price?: number; currency?: string }

export default function Summary(
    {
        ticketInstances,
        onContinueAction,
        disabled,
        buttonText,
        couponApplied,
        couponAmount = 0,
        platformFee = 0,
        gatewayFee = 0,
        total = 0,
        step
    }: {
        ticketInstances: Array<{ id: string; name?: string; price?: number; currency?: string }>;
        onContinueAction?: () => void;
        disabled?: boolean;
        buttonText?: string;
        couponApplied?: boolean;
        couponAmount?: number;
        platformFee?: number;
        gatewayFee?: number;
        total?: number;
        step: number;
    }) {
    const grouped: Record<string, Group> = {}

    ticketInstances.forEach((t) => {
        const key = t.name ?? t.id

        if (!grouped[key]) grouped[key] = {qty: 0, name: t.name, price: t.price, currency: t.currency}

        grouped[key].qty += 1
    })

    const moneySymbol = currencySymbol(ticketInstances[0]?.currency)
    const subtotal = ticketInstances.reduce((s, t) => s + (t.price ?? 0), 0)
    const effectiveDiscount = couponApplied ? couponAmount : 0

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

            <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-3 text-sm space-y-2">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div>Subtotal</div>
                    <div className="font-medium">{moneySymbol}{subtotal.toLocaleString()}</div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div>Platform fee</div>
                    <div className="font-medium">{moneySymbol}{platformFee.toLocaleString()}</div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div>Discount</div>
                    <div className="font-medium">{couponApplied ? `-${moneySymbol}${effectiveDiscount.toLocaleString()}` : '—'}</div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div>Gateway fee</div>
                    <div className="font-medium">{gatewayFee || step === 3 ? `${moneySymbol}${(gatewayFee ?? 0).toLocaleString()}` : 'TBD'}</div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-2 border-t border-black/10 dark:border-white/10">
                    <div className="text-sm">Total</div>
                    <div className="text-lg font-semibold">{moneySymbol}{(total).toLocaleString()}</div>
                </div>
            </div>

            <div className="mt-4">
                <button onClick={onContinueAction} disabled={disabled} aria-disabled={disabled} className={`w-full inline-flex items-center justify-center gap-2 rounded-lg ${disabled ? 'bg-gray-400/60 cursor-not-allowed' : 'bg-brand-teal'} text-white px-6 py-2 font-medium`}>{buttonText ?? 'Continue'}</button>
            </div>
        </div>
    )
}
