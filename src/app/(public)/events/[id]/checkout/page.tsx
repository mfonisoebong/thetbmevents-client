"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTicketContext } from '../../../../../contexts/TicketContext'
import Stepper from '../../../../../components/checkout/Stepper'
import Summary from '../../../../../components/checkout/Summary'
import { validateEmail, validatePhone } from '../../../../../hooks/useFormValidation'

type TicketInstanceLocal = { id: string; name?: string; price?: number; currency?: string }
type AttendeeLocal = { fullname: string; email: string; phone?: string; sendToMe?: boolean }

type PurchaserErrors = { fullname?: string; email?: string; phone?: string }
type AttendeeErrors = Array<{ fullname?: string; email?: string }>

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const id = (params as any)?.id as string | undefined
  const { ticketInstances, customer, setCustomer, setAttendees } = useTicketContext()
  // local contact fields
  const [fullname, setFullname] = useState(customer.fullname)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone ?? '')
  const [sendToSomeoneElse, setSendToSomeoneElse] = useState(false)

  // attendees state mirrors ticketInstances
  const initialAttendees: AttendeeLocal[] = ticketInstances.map(() => ({ fullname: '', email: '', phone: '', sendToMe: false }))
  const [localAttendees, setLocalAttendees] = useState<AttendeeLocal[]>(initialAttendees)

  // errors & touched
  const [purchaserErrors, setPurchaserErrors] = useState<PurchaserErrors>({})
  const [attendeeErrors, setAttendeeErrors] = useState<AttendeeErrors>(ticketInstances.map(() => ({})))
  const [touchedAny, setTouchedAny] = useState(false)

  // keep localAttendees & attendeeErrors in sync if ticketInstances change
  useEffect(() => {
    if (ticketInstances.length !== localAttendees.length) {
      setLocalAttendees(ticketInstances.map(() => ({ fullname: '', email: '', phone: '', sendToMe: false })))
    }
    if (ticketInstances.length !== attendeeErrors.length) {
      setAttendeeErrors(ticketInstances.map(() => ({})))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketInstances.length])

  // run validation in an effect to avoid setState during render
  useEffect(() => {
    const pErrs: PurchaserErrors = {}
    const fullErr = getPurchaserError('fullname', fullname)
    if (fullErr) pErrs.fullname = fullErr
    const emailErr = getPurchaserError('email', email)
    if (emailErr) pErrs.email = emailErr
    const phoneErr = getPurchaserError('phone', phone)
    if (phoneErr) pErrs.phone = phoneErr
    setPurchaserErrors(prev => {
      try {
        if (JSON.stringify(prev) === JSON.stringify(pErrs)) return prev
      } catch (_) {}
      return pErrs
    })

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
    setAttendeeErrors(prev => {
      try {
        if (JSON.stringify(prev) === JSON.stringify(aErrs)) return prev
      } catch (_) {}
      return aErrs
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullname, email, phone, localAttendees, sendToSomeoneElse])

  function onChangeFullname(v: string) {
    setFullname(v)
    setTouchedAny(true)
    // validation moved to effect
  }
  function onChangeEmail(v: string) {
    setEmail(v)
    setTouchedAny(true)
    // validation moved to effect
  }
  function onChangePhone(v: string) {
    setPhone(v)
    setTouchedAny(true)
    // validation moved to effect
  }

  function onToggleSendToMe(idx: number, checked: boolean) {
    const next = [...localAttendees]
    next[idx] = { ...next[idx], sendToMe: checked }
    if (checked) {
      next[idx].fullname = fullname
      next[idx].email = email
      next[idx].phone = phone
      // skip immediate validate; effect will run
    }
    setLocalAttendees(next)
    setTouchedAny(true)
  }

  function onChangeAttendee(idx: number, field: 'fullname' | 'email' | 'phone', value: string) {
    const next = [...localAttendees]
    next[idx] = { ...next[idx], [field]: value }
    setLocalAttendees(next)
    setTouchedAny(true)
    // validation moved to effect
  }

  // Pure validators that DO NOT set state (safe to call during render)
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

  // overall validity
  function isFormValid() {
    // purchaser (use pure validators only)
    const fullErr = getPurchaserError('fullname', fullname)
    const emailErr = getPurchaserError('email', email)
    const phoneErr = getPurchaserError('phone', phone)
    if (fullErr || emailErr || phoneErr) return false

    if (sendToSomeoneElse) {
      // every attendee must have fullname and email or be sendToMe (pure check)
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

  async function onSummaryContinue() {
    setTouchedAny(true)
    // run full validation
    const valid = isFormValid()
    if (!valid) return
    // save and proceed
    setCustomer({ fullname, email, phone })
    setAttendees(localAttendees.map((a: AttendeeLocal) => ({ fullname: a.fullname, email: a.email, phone: a.phone, sendToMe: a.sendToMe })))
    if (id) router.push(`/events/${id}/checkout/payment`)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <Stepper step={2} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <section className="bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold dark:text-white">Contact information</h2>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">Enter the purchaser&apos;s contact info — tickets and receipts will be sent here.</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                  <input type="text" value={fullname} onChange={(e) => onChangeFullname(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none" />
                  {purchaserErrors.fullname && <div className="mt-1 text-sm text-rose-500">{purchaserErrors.fullname}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                  <input type="email" value={email} onChange={(e) => onChangeEmail(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none" />
                  {purchaserErrors.email && <div className="mt-1 text-sm text-rose-500">{purchaserErrors.email}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => onChangePhone(e.target.value)} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none" />
                  {purchaserErrors.phone && <div className="mt-1 text-sm text-rose-500">{purchaserErrors.phone}</div>}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-600 dark:text-slate-300">Send ticket to someone else?</div>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input type="radio" name="sendToSomeone" checked={!sendToSomeoneElse} onChange={() => { setSendToSomeoneElse(false); setTouchedAny(true); }} />
                    <span className="text-sm">No</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input type="radio" name="sendToSomeone" checked={sendToSomeoneElse} onChange={() => { setSendToSomeoneElse(true); setTouchedAny(true); }} />
                    <span className="text-sm">Yes</span>
                  </label>
                </div>
              </div>

              {sendToSomeoneElse && (
                <div className="mt-4 space-y-4">
                  {ticketInstances.map((t: TicketInstanceLocal, idx: number) => (
                    <div key={`${t.id}-${idx}`} className="bg-white/5 dark:bg-black/30 border border-white/5 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-slate-700 dark:text-slate-200">Ticket {idx + 1} - {t.name ?? 'Ticket'}</div>
                        <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <input type="checkbox" checked={localAttendees[idx]?.sendToMe ?? false} onChange={(e) => onToggleSendToMe(idx, e.target.checked)} />
                          <span className="text-sm">send to me</span>
                        </label>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                          <input type="text" value={localAttendees[idx]?.fullname ?? ''} onChange={(e) => onChangeAttendee(idx, 'fullname', e.target.value)} required={!localAttendees[idx]?.sendToMe} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none" />
                          {attendeeErrors[idx]?.fullname && <div className="mt-1 text-sm text-rose-500">{attendeeErrors[idx]?.fullname}</div>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                          <input value={localAttendees[idx]?.email ?? ''} onChange={(e) => onChangeAttendee(idx, 'email', e.target.value)} type="email" required={!localAttendees[idx]?.sendToMe} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:duration-200 focus:ring-offset-0 shadow-sm dark:border dark:border-white/50 focus:border-none" />
                          {attendeeErrors[idx]?.email && <div className="mt-1 text-sm text-rose-500">{attendeeErrors[idx]?.email}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </form>
        </main>

        <aside className="lg:col-span-1">
          <Summary ticketInstances={ticketInstances} onContinueAction={onSummaryContinue} disabled={!touchedAny || !isFormValid()} />
        </aside>
      </div>
    </div>
  )
}
