'use client'

import React, {useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import LoadingSpinner from '@components/LoadingSpinner'
import SuccessCheckIcon from '@components/SuccessCheckIcon'

type Status = 'loading' | 'success' | 'error'

export default function PaymentCompletePage() {
    const searchParams = useSearchParams()

    const reference = useMemo(() => searchParams?.get('reference') ?? '', [searchParams])
    const [status, setStatus] = useState<Status>('loading')

    useEffect(() => {
        // TODO: verify transaction reference with backend.
        // For now, always transition to success once the page has loaded.
        if (!reference) {
            setStatus('error')
            return
        }

        setStatus('success')
    }, [reference])

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 min-h-[75vh]">
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200/60 dark:border-white/10 rounded-2xl p-8">
                {status === 'loading' && (
                    <div aria-busy="true" aria-live="polite">
                        <div className="flex items-center gap-3">
                            <LoadingSpinner size={40} label="Confirming payment" />
                            <h1 className="text-xl font-semibold text-text-light dark:text-text-dark">Confirming payment…</h1>
                        </div>
                        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                            Please wait while we confirm your transaction.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="mb-4 flex justify-center">
                            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                                <SuccessCheckIcon size={34} label="Payment successful" />
                            </div>
                        </div>

                        <h1 className="text-xl font-semibold text-text-light dark:text-text-dark text-center">Payment successful</h1>
                        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark text-center">
                            Your payment was successful. Reference:{' '}
                            <span className="font-medium text-text-light dark:text-text-dark">{reference}</span>
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                            <Link
                                href="/explore"
                                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white bg-brand-teal"
                            >
                                Explore events
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 px-4 py-2 text-sm font-semibold text-text-light dark:text-text-dark hover:bg-white/80 dark:hover:bg-slate-900/60"
                            >
                                Go home
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <h1 className="text-xl font-semibold text-text-light dark:text-text-dark">We couldn’t confirm your payment</h1>
                        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                            Missing or invalid reference. Please try again.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black-1c text-white font-medium shadow"
                            >
                                Back to explore
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
