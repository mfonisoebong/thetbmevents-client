"use client"

import React, { FormEvent, useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTicketContext } from '../../../../../contexts/TicketContext'
import Stepper from '../../../../../components/checkout/Stepper'
import Summary from '../../../../../components/checkout/Summary'

type TicketInstanceLocal = { id: string; name?: string; price?: number; currency?: string }
type AttendeeLocal = { fullname: string; email: string; phone?: string; sendToMe?: boolean }

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

  // keep localAttendees in sync if ticketInstances change
  useEffect(() => {
    if (ticketInstances.length !== localAttendees.length) {
      setLocalAttendees(ticketInstances.map(() => ({ fullname: '', email: '', phone: '', sendToMe: false })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketInstances.length])

  function onToggleSendToMe(idx: number, checked: boolean) {
    const next = [...localAttendees]
    next[idx] = { ...next[idx], sendToMe: checked }
    if (checked) {
      next[idx].fullname = fullname
      next[idx].email = email
      next[idx].phone = phone
    }
    setLocalAttendees(next)
  }

  function onChangeAttendee(idx: number, field: 'fullname' | 'email' | 'phone', value: string) {
    const next = [...localAttendees]
    next[idx] = { ...next[idx], [field]: value }
    setLocalAttendees(next)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    // save customer and attendees to context and go to next step
    setCustomer({ fullname, email, phone })
    setAttendees(localAttendees.map((a: AttendeeLocal) => ({ fullname: a.fullname, email: a.email, phone: a.phone, sendToMe: a.sendToMe })))
    // navigate to next step (payment)
    if (id) router.push(`/events/${id}/checkout/payment`)
  }

  function onSummaryContinue() {
    // same action as form submit's finalizing step, but doesn't need to preventDefault
    setCustomer({ fullname, email, phone })
    setAttendees(localAttendees.map((a: AttendeeLocal) => ({ fullname: a.fullname, email: a.email, phone: a.phone, sendToMe: a.sendToMe })))
    if (id) router.push(`/events/${id}/checkout/payment`)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <Stepper step={2} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-6">
            <section className="bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold dark:text-white">Contact information</h2>
              <p className="text-sm text-text-muted-light mt-2">Enter the purchaser&apos;s contact info — tickets and receipts will be sent here.</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                  <input value={fullname} onChange={(e) => setFullname(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-text-muted-light">Send ticket to someone else?</div>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="sendToSomeone" checked={!sendToSomeoneElse} onChange={() => setSendToSomeoneElse(false)} />
                    <span className="text-sm text-text-muted-light">No</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="sendToSomeone" checked={sendToSomeoneElse} onChange={() => setSendToSomeoneElse(true)} />
                    <span className="text-sm text-text-muted-light">Yes</span>
                  </label>
                </div>
              </div>

              {sendToSomeoneElse && (
                <div className="mt-4 space-y-4">
                  {ticketInstances.map((t: TicketInstanceLocal, idx: number) => (
                    <div key={`${t.id}-${idx}`} className="bg-white/5 dark:bg-black/30 border border-white/5 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Ticket {idx + 1} - {t.name ?? 'Ticket'}</div>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={localAttendees[idx]?.sendToMe ?? false} onChange={(e) => onToggleSendToMe(idx, e.target.checked)} />
                          <span className="text-sm text-text-muted-light">send to me</span>
                        </label>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                          <input value={localAttendees[idx]?.fullname ?? ''} onChange={(e) => onChangeAttendee(idx, 'fullname', e.target.value)} required={!localAttendees[idx]?.sendToMe} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                          <input value={localAttendees[idx]?.email ?? ''} onChange={(e) => onChangeAttendee(idx, 'email', e.target.value)} type="email" required={!localAttendees[idx]?.sendToMe} className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-teal text-white px-6 py-2 font-medium">Continue</button>
            </div>
          </form>
        </main>

        <aside className="lg:col-span-1">
          <Summary ticketInstances={ticketInstances} onContinueAction={onSummaryContinue} />
        </aside>
      </div>
    </div>
  )
}
