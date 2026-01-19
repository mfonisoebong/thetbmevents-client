'use client'

import React, {useMemo, useState} from 'react'
import Link from 'next/link'
import SidebarLayout from "../../../../components/layouts/SidebarLayout"
import { events as mockEvents } from '../../../../lib/mockEvents'
import { formatDate, currencySymbol, formatNumber } from '@lib/utils'
import { computeEventStats, eventStatus } from '@lib/eventStats'
import {ClipboardIcon} from "@heroicons/react/24/outline";

export default function OrganizerEventsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const events = useMemo(() => mockEvents, [])

  const overview = useMemo(() => {
    let totalEvents = events.length
    let totalTickets = 0
    let totalRevenue = 0
    let ticketsSold = 0

    for (const e of events) {
      const s = computeEventStats(e)
      ticketsSold += s.totalSold
      totalRevenue += s.totalRevenue

      // totalTickets counts finite capacities only; unlimited tickets are considered "∞"
      totalTickets += s.totalAvailable
    }

    return { totalEvents, ticketsSold, totalRevenue, totalTickets }
  }, [events])

  function onCopyLink(id: string) {
    try {
      const url = `${window.location.origin}/events/${id}`
      navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Events</h1>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">Manage the events you created.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/organizer/events/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-4 py-2 text-white font-medium shadow-md hover:opacity-95">+ Create event</Link>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm text-text-muted-light">Total events</div>
            <div className="mt-2 text-2xl font-semibold dark:text-white">{overview.totalEvents}</div>
          </div>

          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm text-text-muted-light">Tickets sold</div>
            <div className="mt-2 text-2xl font-semibold dark:text-white">{formatNumber(overview.ticketsSold)}</div>
          </div>

          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm text-text-muted-light">Revenue</div>
            <div className="mt-2 text-2xl font-semibold dark:text-white">{currencySymbol('NGN')}{formatNumber(overview.totalRevenue)}</div>
          </div>
        </div>

        {/* Events list */}
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => {
            const stats = computeEventStats(event)
            const status = eventStatus(event, stats)
            const detailsLink = `/organizer/events/${event.id}`

            return (
              <article key={event.id} className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  <Link href={detailsLink} className="relative w-full sm:w-48 h-44 sm:h-auto flex-shrink-0">
                    <img src={event.image ?? '/images/placeholder-event.svg'} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded-md">{event.category}</div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <Link href={detailsLink} className="cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="hover:underline">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2 line-clamp-2">{event.description}</p>

                          <div className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <div>{formatDate(event.date)} • {event.time}</div>
                            <div className="mt-1">{event.location}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'Published' ? 'bg-emerald-100 text-emerald-800' : status === 'Draft' ? 'bg-gray-100 text-gray-800' : status === 'Sold Out' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                              {status}
                            </div>
                          </div>

                          <div className="mt-4 text-sm text-text-muted-light">
                            <div>Revenue</div>
                            <div className="font-semibold text-gray-900 dark:text-white mt-1">{currencySymbol('NGN')}{formatNumber(stats.totalRevenue)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-black/5 dark:bg-black/30 rounded-full px-3 py-1 text-sm">
                          <span className="font-medium">Tickets</span>
                          <span className="bg-white/10 dark:bg-white/10 px-2 py-1 rounded-full text-xs">{formatNumber(stats.totalSold)}/{stats.hasUnlimited ? '♾️' : formatNumber(stats.totalAvailable)}</span>
                        </div>

                        <div className="inline-flex items-center gap-2 bg-black/5 dark:bg-black/30 rounded-full px-3 py-1 text-sm">
                          <span className="font-medium">Types</span>
                          <span className="bg-white/10 dark:bg-white/10 px-2 py-1 rounded-full text-xs">{event.tickets.length}</span>
                        </div>

                      </div>
                    </Link>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link target="_blank" href={`/events/${event.id}`} className="text-sm text-sky-600 hover:underline">View public page</Link>
                        <Link href={`/dashboard/organizer/events/${event.id}/edit`} className="text-sm text-text-muted-light hover:underline">Edit</Link>
                      </div>

                      <button onClick={() => onCopyLink(event.id)} className="inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-3 py-2 text-sm font-medium  text-white">
                        <ClipboardIcon className="w-4 h-4 -mr-1"/>
                        {copiedId === event.id ? 'Copied' : 'Copy link'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </SidebarLayout>
  )
}
