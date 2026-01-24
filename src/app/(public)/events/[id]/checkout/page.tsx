"use client"

import React, {useEffect, useMemo, useCallback, useReducer} from 'react'
import {useRouter, useParams, useSearchParams, usePathname} from 'next/navigation'
import {useTicketContext} from '../../../../../contexts/TicketContext'
import Stepper from '../../../../../components/checkout/Stepper'
import Summary from '../../../../../components/checkout/Summary'
import {validateEmail, validatePhone} from '../../../../../hooks/useFormValidation'
import {
    calculatePlatformFee, cn,
    currencySymbol,
    getEndpoint,
    getErrorMessage,
    getGatewayFee,
    roundToTwo
} from "@lib/utils";
import {ApiData, PaymentGateway} from "@lib/types";
import HTTP from "@lib/HTTP";

type TicketInstanceLocal = { id: string; name?: string; price?: number; currency?: string }
type AttendeeLocal = { fullname: string; email: string; phone?: string; sendToMe?: boolean }

type PurchaserErrors = { fullname?: string; email?: string; phone?: string }
type AttendeeErrors = Array<{ fullname?: string; email?: string }>

type ApplyCouponData = {
    coupon_id: number
    coupon_code: string
    type: 'percentage' | 'fixed' | (string & {})
    value: number
    amount: number
    discount: number
    total: number
}

type CheckoutState = {
    purchaser: { fullname: string; email: string; phone: string }
    sendToSomeoneElse: boolean
    attendees: AttendeeLocal[]
    touchedAny: boolean
    purchaserErrors: PurchaserErrors
    attendeeErrors: AttendeeErrors
    coupon: {
        code: string
        applied: boolean
        discount: number
        serverTotal: number | null
        applying: boolean
        error: string | null
    }
    gateway: PaymentGateway | null
}

type CheckoutAction =
    | { type: 'INIT_FROM_CONTEXT'; payload: { purchaser: CheckoutState['purchaser']; attendees?: AttendeeLocal[] } }
    | { type: 'SET_PURCHASER_FIELD'; field: keyof CheckoutState['purchaser']; value: string }
    | { type: 'SET_SEND_TO_SOMEONE_ELSE'; value: boolean }
    | { type: 'SET_ATTENDEE_FIELD'; idx: number; field: 'fullname' | 'email' | 'phone'; value: string }
    | { type: 'TOGGLE_ATTENDEE_SEND_TO_ME'; idx: number; checked: boolean }
    | { type: 'SET_TOUCHED'; value: boolean }
    | { type: 'SET_GATEWAY'; value: PaymentGateway | null }
    | { type: 'SET_COUPON_CODE'; value: string }
    | { type: 'COUPON_APPLY_START' }
    | { type: 'COUPON_APPLY_SUCCESS'; payload: { discount: number; total: number } }
    | { type: 'COUPON_APPLY_ERROR'; payload: { error: string } }
    | { type: 'COUPON_CLEAR' }
    | { type: 'SET_ERRORS'; payload: { purchaserErrors: PurchaserErrors; attendeeErrors: AttendeeErrors } }

function makeEmptyAttendees(count: number): AttendeeLocal[] {
    return Array.from({length: count}, () => ({
        fullname: '',
        email: '',
        phone: '',
        sendToMe: false,
    }))
}

function makeInitialState(ticketCount: number): CheckoutState {
    return {
        purchaser: {fullname: '', email: '', phone: ''},
        sendToSomeoneElse: false,
        attendees: makeEmptyAttendees(ticketCount),
        touchedAny: false,
        purchaserErrors: {},
        attendeeErrors: Array.from({length: ticketCount}, () => ({})),
        coupon: {
            code: '',
            applied: false,
            discount: 0,
            serverTotal: null,
            applying: false,
            error: null,
        },
        gateway: null,
    }
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case 'INIT_FROM_CONTEXT': {
            const nextAttendees = action.payload.attendees ?? state.attendees
            return {
                ...state,
                purchaser: action.payload.purchaser,
                attendees: nextAttendees,
            }
        }

        case 'SET_PURCHASER_FIELD': {
            const purchaser = {...state.purchaser, [action.field]: action.value}

            // Keep attendee rows in sync when "send to me" is checked.
            const attendees = state.attendees.map((a) => {
                if (!a.sendToMe) return a
                return {
                    ...a,
                    fullname: purchaser.fullname,
                    email: purchaser.email,
                    phone: purchaser.phone,
                }
            })

            return {
                ...state,
                purchaser,
                attendees,
                touchedAny: true,
            }
        }

        case 'SET_SEND_TO_SOMEONE_ELSE':
            return {...state, sendToSomeoneElse: action.value, touchedAny: true}

        case 'SET_ATTENDEE_FIELD': {
            const attendees = [...state.attendees]
            attendees[action.idx] = {...attendees[action.idx], [action.field]: action.value}
            return {...state, attendees, touchedAny: true}
        }

        case 'TOGGLE_ATTENDEE_SEND_TO_ME': {
            const attendees = [...state.attendees]
            const current = attendees[action.idx]
            const next = {...current, sendToMe: action.checked}

            if (action.checked) {
                next.fullname = state.purchaser.fullname
                next.email = state.purchaser.email
                next.phone = state.purchaser.phone
            }

            attendees[action.idx] = next
            return {...state, attendees, touchedAny: true}
        }

        case 'SET_TOUCHED':
            return {...state, touchedAny: action.value}

        case 'SET_GATEWAY':
            return {...state, gateway: action.value}

        case 'SET_COUPON_CODE':
            return {
                ...state,
                coupon: {
                    ...state.coupon,
                    code: action.value,
                },
            }

        case 'COUPON_APPLY_START':
            return {
                ...state,
                coupon: {
                    ...state.coupon,
                    applying: true,
                    error: null,
                },
            }

        case 'COUPON_APPLY_SUCCESS':
            return {
                ...state,
                coupon: {
                    ...state.coupon,
                    applied: true,
                    applying: false,
                    error: null,
                    discount: action.payload.discount,
                    serverTotal: action.payload.total,
                },
            }

        case 'COUPON_APPLY_ERROR':
            return {
                ...state,
                coupon: {
                    ...state.coupon,
                    applied: false,
                    applying: false,
                    discount: 0,
                    serverTotal: null,
                    error: action.payload.error,
                },
            }

        case 'COUPON_CLEAR':
            return {
                ...state,
                coupon: {
                    ...state.coupon,
                    applied: false,
                    discount: 0,
                    serverTotal: null,
                    error: null,
                    applying: false,
                },
            }

        case 'SET_ERRORS':
            return {
                ...state,
                purchaserErrors: action.payload.purchaserErrors,
                attendeeErrors: action.payload.attendeeErrors,
            }

        default:
            return state
    }
}

export default function CheckoutPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const {
        ticketInstances,
        customer,
        attendees,
        setCustomer,
        setAttendees,
        sendToDifferentEmail,
        setSendToDifferentEmail
    } = useTicketContext()

    const id = (params as any)?.id as string | undefined

    const stepParam = searchParams?.get('step') ?? '2'
    const step = stepParam === '3' ? 3 : 2

    const [state, dispatch] = useReducer(checkoutReducer, ticketInstances.length, makeInitialState)

    const {purchaser, sendToSomeoneElse, attendeeErrors, purchaserErrors, touchedAny, gateway} = state
    const {
        code: coupon,
        applied: couponApplied,
        discount: couponDiscount,
        serverTotal: couponServerTotal,
        applying: couponApplying,
        error: couponError
    } = state.coupon
    const localAttendees = state.attendees

    const subtotal = useMemo(() => ticketInstances.reduce((s, t) => s + (t.price ?? 0), 0), [ticketInstances])
    const moneySymbol = useMemo(() => currencySymbol(ticketInstances[0]?.currency), [ticketInstances])

    const platformFee = useMemo(() => roundToTwo(calculatePlatformFee(subtotal)), [subtotal])

    // Gateway fee is computed on (subtotal + platformFee), BEFORE discount is applied.
    const feeForSelected = useMemo(() => {
        if (!gateway) return 0
        const base = Math.max(0, subtotal + platformFee)
        return roundToTwo(getGatewayFee(base, gateway))
    }, [gateway, subtotal, platformFee])

    const baseTotalWithFee = useMemo(() => {
        return roundToTwo(Math.max(0, subtotal + platformFee + feeForSelected))
    }, [subtotal, platformFee, feeForSelected])

    const totalWithFee = useMemo(() => {
        // If server returns a final total, trust it.
        if (couponApplied && couponServerTotal != null) {
            return roundToTwo(Math.max(0, couponServerTotal))
        }

        const discounted = baseTotalWithFee - (couponApplied ? couponDiscount : 0)
        return roundToTwo(Math.max(0, discounted))
    }, [baseTotalWithFee, couponApplied, couponDiscount, couponServerTotal])

    const isFreeCheckout = step === 3 && totalWithFee <= 0

    // Keep reducer state synced with TicketContext.
    useEffect(() => {
        const nextPurchaser = {
            fullname: customer.fullname,
            email: customer.email,
            phone: customer.phone ?? '',
        }

        const nextAttendees = attendees.length === ticketInstances.length
            ? attendees.map((a) => ({
                fullname: a.fullname,
                email: a.email,
                phone: a.phone,
                sendToMe: false,
            }))
            : undefined

        dispatch({
            type: 'INIT_FROM_CONTEXT',
            payload: {purchaser: nextPurchaser, attendees: nextAttendees},
        })
    }, [customer, attendees, ticketInstances.length])

    // validation effect (existing) kept — run on relevant deps
    useEffect(() => {
        const pErrs: PurchaserErrors = {}

        const fullErr = getPurchaserError('fullname', purchaser.fullname)
        if (fullErr) pErrs.fullname = fullErr

        const emailErr = getPurchaserError('email', purchaser.email)
        if (emailErr) pErrs.email = emailErr

        const phoneErr = getPurchaserError('phone', purchaser.phone)
        if (phoneErr) pErrs.phone = phoneErr

        const aErrs: AttendeeErrors = localAttendees.map((a) => {
            const obj: { fullname?: string; email?: string } = {}

            if (sendToSomeoneElse && !a.sendToMe) {
                const nameErr = getAttendeeError('fullname', a.fullname ?? '')
                if (nameErr) obj.fullname = nameErr

                const emailErrA = getAttendeeError('email', a.email ?? '')
                if (emailErrA) obj.email = emailErrA
            }

            return obj
        })

        dispatch({type: 'SET_ERRORS', payload: {purchaserErrors: pErrs, attendeeErrors: aErrs}})

    }, [purchaser.fullname, purchaser.email, purchaser.phone, localAttendees, sendToSomeoneElse])

    function onChangeFullname(v: string) {
        dispatch({type: 'SET_PURCHASER_FIELD', field: 'fullname', value: v})
    }

    function onChangeEmail(v: string) {
        dispatch({type: 'SET_PURCHASER_FIELD', field: 'email', value: v})
    }

    function onChangePhone(v: string) {
        dispatch({type: 'SET_PURCHASER_FIELD', field: 'phone', value: v})
    }

    function onToggleSendToMe(idx: number, checked: boolean) {
        dispatch({type: 'TOGGLE_ATTENDEE_SEND_TO_ME', idx, checked})
    }

    function onChangeAttendee(idx: number, field: 'fullname' | 'email' | 'phone', value: string) {
        dispatch({type: 'SET_ATTENDEE_FIELD', idx, field, value})
    }

    function getPurchaserError(field: 'fullname' | 'email' | 'phone', value: string) {
        if (field === 'fullname') {
            if (!value.trim()) return 'Full name is required'
            return ''
        }

        if (field === 'email') {
            return validateEmail(value) || ''
        }

        if (field === 'phone') {
            return validatePhone(value) || ''
        }

        return ''
    }

    function getAttendeeError(field: 'fullname' | 'email', value: string) {
        if (field === 'fullname') {
            if (!value.trim()) return 'Full name is required'
            return ''
        }

        if (field === 'email') {
            return validateEmail(value) || ''
        }

        return ''
    }

    function isFormValid() {
        // purchaser
        const fullErr = getPurchaserError('fullname', purchaser.fullname)
        const emailErr = getPurchaserError('email', purchaser.email)
        const phoneErr = getPurchaserError('phone', purchaser.phone)

        if (fullErr || emailErr || phoneErr) return false

        if (sendToSomeoneElse) {
            for (let i = 0; i < localAttendees.length; i++) {
                const a = localAttendees[i]

                if (a.sendToMe) continue

                const nameOk = a.fullname && a.fullname.trim().length > 0

                const emailErrA = getAttendeeError('email', a.email ?? '')

                if (!nameOk || emailErrA) return false
            }
        }

        return true
    }

    const pathname = usePathname()

    function goToStep3() {
        if (!isFormValid()) {
            dispatch({type: 'SET_TOUCHED', value: true})
            return
        }

        setCustomer({fullname: purchaser.fullname, email: purchaser.email, phone: purchaser.phone})
        setAttendees(localAttendees.map((a: AttendeeLocal) => ({
            fullname: a.fullname,
            email: a.email,
            phone: a.phone,
            sendToMe: a.sendToMe,
        })))

        const sp = new URLSearchParams(Array.from(searchParams ?? []))
        sp.set('step', '3')

        router.push(`${pathname}?${sp.toString()}`)
    }

    function goToStep2() {
        router.back()
    }

    async function onPayNow() {
        // final validation
        if (!isFormValid()) {
            dispatch({type: 'SET_TOUCHED', value: true})
            return
        }

        // If the order is free, no gateway is needed.
        if (!isFreeCheckout && !gateway) return

        // extract only id from ticketInstances
        const ticketInstancesLocal = ticketInstances.map((t) => t.id)

        const checkoutData = {
            gateway,
            is_free_checkout: isFreeCheckout,
            tickets: ticketInstancesLocal,
            customer,
            attendees,
            send_to_different_email: sendToDifferentEmail,
            coupon_applied: couponApplied,
            coupon_code: coupon
        }

        console.log('Processing payment', checkoutData)
        // TODO: integrate real gateways. For now, route to a confirmation page (placeholder)
        // router.push(`/events/${id}/checkout/success`)
    }

    const summaryDisabled = !touchedAny || !isFormValid() || (step === 3 && !isFreeCheckout && !gateway)

    const applyCoupon = useCallback(async () => {
        const code = coupon.trim()
        if (!code || !id) return

        dispatch({type: 'COUPON_APPLY_START'})

        type Resp = ApiData<ApplyCouponData>

        const resp = await HTTP<Resp, { coupon_code: string; event_id: string; amount: number }>({
            url: getEndpoint('/checkout/apply-coupon'),
            method: 'post',
            data: {
                coupon_code: code,
                event_id: id,
                // send totalWithFee as amount as requested
                amount: totalWithFee,
            },
        })

        if (!resp.ok) {
            dispatch({type: 'COUPON_APPLY_ERROR', payload: {error: getErrorMessage(resp.error)}})
            return
        }

        const payload = resp.data

        // API can reply with { data: null, message: "Invalid..." }
        if (!payload || !payload.data) {
            dispatch({
                type: 'COUPON_APPLY_ERROR',
                payload: {error: payload?.message ?? 'Invalid coupon code for this event'},
            })
            return
        }

        dispatch({
            type: 'COUPON_APPLY_SUCCESS',
            payload: {
                discount: Number(payload.data.discount),
                total: Number(payload.data.total),
            },
        })
    }, [coupon, id, totalWithFee])

    const clearCoupon = useCallback(() => {
        dispatch({type: 'COUPON_CLEAR'})
    }, [])

    // If totals (tickets/fees/gateway) change after applying a coupon, the coupon needs re-apply.
    useEffect(() => {
        if (!couponApplied) return
        clearCoupon()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseTotalWithFee])

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Stepper step={step}/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {step === 2 && (
                            <section
                                className={`bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 rounded-2xl p-6`}>
                                <h2 className="text-lg font-semibold dark:text-white">Contact information</h2>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">Enter the
                                    purchaser&apos;s contact info — tickets and receipts will be sent here.</p>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full
                                            name</label>
                                        <input type="text" value={purchaser.fullname}
                                               onChange={(e) => onChangeFullname(e.target.value)} required
                                               className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none"/>
                                        {purchaserErrors.fullname &&
                                          <div className="mt-1 text-sm text-rose-500">{purchaserErrors.fullname}</div>}
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                                        <input type="email" value={purchaser.email}
                                               onChange={(e) => onChangeEmail(e.target.value)} required
                                               className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none"/>
                                        {purchaserErrors.email &&
                                          <div className="mt-1 text-sm text-rose-500">{purchaserErrors.email}</div>}
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                                        <input type="tel" value={purchaser.phone}
                                               onChange={(e) => onChangePhone(e.target.value)}
                                               className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none"/>
                                        {purchaserErrors.phone &&
                                          <div className="mt-1 text-sm text-rose-500">{purchaserErrors.phone}</div>}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-sm text-slate-600 dark:text-slate-300">Send ticket to someone
                                        else?
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <label
                                            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <input type="radio" name="sendToSomeone" checked={!sendToSomeoneElse}
                                                   onChange={() => {
                                                       dispatch({
                                                           type: 'SET_SEND_TO_SOMEONE_ELSE',
                                                           value: false
                                                       })
                                                       setSendToDifferentEmail(false)
                                                   }}/>
                                            <span className="text-sm">No</span>
                                        </label>
                                        <label
                                            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <input type="radio" name="sendToSomeone" checked={sendToSomeoneElse}
                                                   onChange={() => {
                                                       dispatch({
                                                           type: 'SET_SEND_TO_SOMEONE_ELSE',
                                                           value: true
                                                       })
                                                       setSendToDifferentEmail(true)
                                                   }}/>
                                            <span className="text-sm">Yes</span>
                                        </label>
                                    </div>
                                </div>

                                {sendToSomeoneElse && (
                                    <div className="mt-4 space-y-4">
                                        {ticketInstances.map((t: TicketInstanceLocal, idx: number) => (
                                            <div key={`${t.id}-${idx}`}
                                                 className="bg-white/5 dark:bg-black/30 border border-white/5 rounded-2xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <div
                                                        className="font-medium text-slate-700 dark:text-slate-200">Ticket {idx + 1} - {t.name ?? 'Ticket'}</div>
                                                    <label
                                                        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                        <input type="checkbox"
                                                               checked={localAttendees[idx]?.sendToMe ?? false}
                                                               onChange={(e) => onToggleSendToMe(idx, e.target.checked)}/>
                                                        <span className="text-sm">send to me</span>
                                                    </label>
                                                </div>

                                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full
                                                            name</label>
                                                        <input type="text" value={localAttendees[idx]?.fullname ?? ''}
                                                               onChange={(e) => onChangeAttendee(idx, 'fullname', e.target.value)}
                                                               required={!localAttendees[idx]?.sendToMe}
                                                               className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none"/>
                                                        {attendeeErrors[idx]?.fullname && <div
                                                          className="mt-1 text-sm text-rose-500">{attendeeErrors[idx]?.fullname}</div>}
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                                                        <input value={localAttendees[idx]?.email ?? ''}
                                                               onChange={(e) => onChangeAttendee(idx, 'email', e.target.value)}
                                                               type="email" required={!localAttendees[idx]?.sendToMe}
                                                               className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none"/>
                                                        {attendeeErrors[idx]?.email && <div
                                                          className="mt-1 text-sm text-rose-500">{attendeeErrors[idx]?.email}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {step === 3 && !isFreeCheckout && (
                            <section
                                className={`bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 rounded-2xl p-6`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <button type="button" aria-label="Back to contact" onClick={goToStep2}
                                            className="text-slate-600 dark:text-slate-300">←
                                    </button>
                                    <h2 className="text-lg font-semibold dark:text-white">Payment</h2>
                                </div>

                                <div className="text-sm text-slate-700 dark:text-slate-200 mb-3">Choose a payment method
                                    — fees shown to help you pick the cheapest.
                                </div>

                                <div className="space-y-3">
                                    {(['paystack', 'flutterwave', /*'chainpal'*/] as PaymentGateway[]).map((g) => {
                                        const fee = roundToTwo(getGatewayFee(Math.max(0, subtotal + platformFee), g))
                                        return (
                                            <label key={g}
                                                   className="flex items-center justify-between gap-3 p-3 rounded-lg bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10">
                                                <div className="flex items-center gap-3 capitalize">
                                                    <input type="radio" name="gateway" checked={gateway === g}
                                                           onChange={() => dispatch({type: 'SET_GATEWAY', value: g})}/>
                                                    <div
                                                        className="text-sm text-slate-700 dark:text-slate-200">{g === 'chainpal' ? 'ChainPal (crypto)' : g}</div>
                                                </div>
                                                <div
                                                    className="text-sm text-slate-600 dark:text-slate-300">{fee === 0 ? 'Free' : `${moneySymbol}${fee.toLocaleString()}`}</div>
                                            </label>
                                        )
                                    })}
                                </div>

                                <div className="mt-8">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Coupon
                                        code</label>
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            value={coupon}
                                            onChange={(e) => {
                                                dispatch({type: 'SET_COUPON_CODE', value: e.target.value})
                                                if (couponApplied) clearCoupon()
                                            }}
                                            className="w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal dark:border dark:border-white/50 focus:border-none"
                                            placeholder="Enter coupon code"
                                        />
                                        <button
                                            type="button"
                                            disabled={couponApplying || !coupon.trim() || !id}
                                            onClick={applyCoupon}
                                            className="px-4 py-2 rounded-lg bg-brand-teal text-white disabled:opacity-60"
                                        >
                                            {couponApplying ? 'Applying…' : 'Apply'}
                                        </button>
                                    </div>

                                    {couponError && (
                                        <div className="mt-2 text-sm text-rose-500">{couponError}</div>
                                    )}

                                    {couponApplied && !couponError && (
                                        <div
                                            className="mt-2 text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between gap-3">
                                            <div>
                                                Coupon applied: {moneySymbol}{couponDiscount.toLocaleString()} discount
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearCoupon}
                                                className="text-sm text-slate-600 dark:text-slate-300 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </section>
                        )}

                    </form>
                </main>

                <aside
                    className={cn("lg:col-span-1", step === 3 ? isFreeCheckout ? 'lg:col-span-3' : '' : 'lg:sticky lg:top-20')}>
                    <Summary
                        ticketInstances={ticketInstances}
                        onContinueAction={step === 3 ? onPayNow : goToStep3}
                        disabled={summaryDisabled || couponApplying}
                        buttonText={step === 3 ? (isFreeCheckout ? 'Get tickets' : 'Pay now') : 'Continue'}
                        couponApplied={couponApplied}
                        couponAmount={couponDiscount}
                        platformFee={platformFee}
                        gatewayFee={feeForSelected}
                        total={totalWithFee}
                        step={step}
                    />
                </aside>
            </div>
        </div>
    )
}
