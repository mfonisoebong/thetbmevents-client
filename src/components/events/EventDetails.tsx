'use client'

import React, { useMemo, useState } from 'react'
import type { EventItem, Ticket } from '../../types'
import { formatDate, currencySymbol } from '../../utils'
import { useRouter } from 'next/navigation'
import { useTicketContext } from '../../contexts/TicketContext'

interface Props {
  event: EventItem
}

// todo: Other Events You May Like section (idea from tix.africa)
export default function EventDetails({ event }: Props) {
  // store per-ticket selected quantities (0 = not selected)
  const initialSelectedQuantities: Record<string, number> = (() => {
    const init: Record<string, number> = {}
    const tickets: Ticket[] = (event.tickets ?? []) as Ticket[]
    for (const t of tickets) {
      init[t.id ?? ''] = 0
    }
    return init
  })()

  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>(initialSelectedQuantities)

  const selectedTicketIds = useMemo(() => Object.keys(selectedQuantities).filter(id => selectedQuantities[id] > 0), [selectedQuantities])

  const totalSelected = useMemo(() => selectedTicketIds.reduce((acc, id) => acc + (selectedQuantities[id] ?? 0), 0), [selectedTicketIds, selectedQuantities])

  const totalPrice = useMemo(() => {
    const tickets: Ticket[] = (event.tickets ?? []) as Ticket[]
    return tickets.reduce((sum, t) => {
      const id = t.id ?? ''
      const q = selectedQuantities[id] ?? 0
      const p = t.price ?? 0
      return sum + p * q
    }, 0)
  }, [event.tickets, selectedQuantities])

  const minPrice = (() => {
    const tickets: Ticket[] = (event.tickets ?? []) as Ticket[]
    const prices = tickets.map(t => (t.price ?? Infinity)).filter(p => p !== Infinity)
    return prices.length ? Math.min(...prices) : 0
  })()

  const router = useRouter()
  const { setSelectedQuantities: ctxSetSelected, setTicketMeta } = useTicketContext()

  function onContinue() {
    // set context quantities and metadata then navigate to checkout
    ctxSetSelected(selectedQuantities)
    const meta: Record<string, { name?: string; price?: number; currency?: string }> = {}
    for (const t of (event.tickets ?? []) as Ticket[]) {
      if (t.id) meta[t.id] = { name: t.name, price: t.price, currency: t.currency }
    }
    setTicketMeta(meta)
    router.push(`/events/${event.id}/checkout`)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="relative w-full h-72 sm:h-96 lg:h-[420px]">
          <img
            src={event.image ?? '/images/placeholder-event.svg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute left-6 bottom-6 right-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-block bg-black/40 text-white text-xs px-3 py-1 rounded-full">{event.category}</div>
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{event.title}</h1>
              <div className="mt-2 text-sm text-white/90">
                <span className="mr-3">{formatDate(event.date)}</span>
                <span className="mx-2">•</span>
                <span>{event.time}</span>
                <span className="mx-2">•</span>
                <span>{event.location}</span>
              </div>
            </div>

            <div className="w-fit ml-auto">
              <div className="text-white bg-white/5 dark:bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-right">
                <div className="text-xs">From</div>
                <div className="text-lg font-semibold">{minPrice === 0 ? 'Free' : `${currencySymbol((event.tickets ?? [])[0]?.currency)}${minPrice.toLocaleString()}`}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2">
            <section className="mb-6">
              <h2 className="text-lg font-semibold dark:text-white">About this event</h2>
              <p className="text-text-muted-light dark:text-text-muted-dark mt-3 whitespace-pre-line">{event.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(event.tags ?? []).map((t) => (
                  <div key={t} className="text-xs px-3 py-1 rounded-full bg-white/50 dark:bg-black/30 text-text-muted-light">#{t}</div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold dark:text-white mb-3">Tickets</h3>
              <div className="space-y-3">
                {(event.tickets ?? []).map((ticket: Ticket) => {
                   const id = ticket.id ?? ''
                   const qty = selectedQuantities[id] ?? 0
                  const price = ticket.price ?? 0
                   return (
                    <div key={id} className="flex flex-col sm:flex-row sm:items-center justify-between max-sm:gap-4 bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-2xl p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{ticket.name}</div>
                        <div className="text-sm text-text-muted-light">{ticket.description ?? ''}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{price === 0 ? 'Free' : `${currencySymbol(ticket.currency)}${price.toLocaleString()}`}</div>
                        <div className="inline-flex items-center gap-2">
                          <button
                            aria-label={`Remove one ${ticket.name}`}
                            onClick={() => setSelectedQuantities(s => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) - 1) }))}
                            className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5"
                          >
                            -
                          </button>
                          <div className="w-10 text-center font-medium">{qty}</div>
                          <button
                            aria-label={`Add one ${ticket.name}`}
                            onClick={() => setSelectedQuantities(s => ({ ...s, [id]: (s[id] ?? 0) + 1 }))}
                            className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {(!event.tickets || event.tickets.length === 0) && (
                  <div className="bg-white/5 dark:bg-black/30 border border-white/5 rounded-2xl p-4 text-text-muted-light">No tickets available</div>
                )}
              </div>
            </section>
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="text-text-muted-light text-sm">When</div>
              <div className="font-medium text-gray-900 dark:text-white mt-1">{formatDate(event.date)} • {event.time}</div>

              <div className="mt-4 text-text-muted-light text-sm">Where</div>
              <div className="font-medium text-gray-900 dark:text-white mt-1">{event.location}</div>

              <div className="mt-6">
                <div className="text-sm text-text-muted-light">Tickets selected</div>
                <div className="mt-2 font-medium text-gray-900 dark:text-white">{totalSelected} ticket{totalSelected !== 1 ? 's' : ''}</div>
                <div className="mt-2 text-sm text-text-muted-light">Total</div>
                <div className="font-medium text-gray-900 dark:text-white">{totalPrice === 0 ? 'Free' : `${currencySymbol((event.tickets ?? [])[0]?.currency)}${totalPrice.toLocaleString()}`}</div>
              </div>

              <div className="mt-6">
                <button
                  disabled={totalSelected === 0}
                  onClick={onContinue}
                  className="w-full px-4 py-3 rounded-lg bg-brand-teal text-white font-medium disabled:opacity-60"
                >
                  {totalSelected > 0 ? `Continue · ${totalPrice === 0 ? 'Free' : `${currencySymbol((event.tickets ?? [])[0]?.currency)}${totalPrice.toLocaleString()}`}` : 'Continue'}
                </button>
              </div>

              <div className="mt-4 text-sm text-text-muted-light">Need help? Contact the organizer.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
