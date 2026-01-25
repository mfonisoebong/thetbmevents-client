'use client'

import React, {Suspense, useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import LoadingSpinner from '@components/LoadingSpinner'
import SuccessCheckIcon from '@components/SuccessCheckIcon'
import HTTP from '@lib/HTTP'
import {getEndpoint} from '@lib/utils'

type Status = 'loading' | 'success' | 'error'

function PaymentCompleteContent() {
    const searchParams = useSearchParams()

    const reference = useMemo(() => searchParams?.get('reference') ?? '', [searchParams])
    const [status, setStatus] = useState<Status>('loading')

    useEffect(() => {
        // Missing/invalid reference – don't hit the API.
        if (!reference) {
            setStatus('error')
            return
        }

        let isCurrent = true

        ;(async () => {
            const response = await HTTP({url: getEndpoint(`/manual-verify-payment/${reference}`), method: 'GET'})

            if (!isCurrent) return

            if (response.ok) {
                setStatus('success')
            } else {
                setStatus('error')
            }
        })()

        return () => {
            isCurrent = false
        }
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
                            Your payment was successful. Please check your email for the ticket and event details.
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

export default function PaymentCompletePage() {
    return (
        <Suspense
            fallback={
                <div className="w-full max-w-4xl mx-auto px-6 py-16 min-h-[75vh]">
                    <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200/60 dark:border-white/10 rounded-2xl p-8">
                        <div aria-busy="true" aria-live="polite">
                            <div className="flex items-center gap-3">
                                <LoadingSpinner size={40} label="Confirming payment" />
                                <h1 className="text-xl font-semibold text-text-light dark:text-text-dark">
                                    Confirming payment…
                                </h1>
                            </div>
                            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                                Please wait while we confirm your transaction.
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <PaymentCompleteContent />
        </Suspense>
    )
}
