'use client'

import React from 'react'
import { EventItem } from '../../types'

interface Props {
  event: EventItem
}

export default function EventCard({ event }: Props) {
  // deterministic date formatting to avoid SSR/Client locale mismatch during hydration
  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const day = String(d.getDate()).padStart(2, '0')
    const month = months[d.getMonth()] || ''
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  }

  return (
    <article className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative w-full h-40 sm:h-44 lg:h-36">
        <img
          src={event.image ?? '/images/placeholder-event.svg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded-md">{event.category}</div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2 line-clamp-2">{event.description}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-text-muted-light dark:text-text-muted-dark">
            <div>{formatDate(event.date)}</div>
            <div className="mt-1">{event.time} • {event.location}</div>
          </div>
          <div>
            <button className="px-3 py-2 rounded-lg bg-brand-teal text-white text-sm font-medium">Book</button>
          </div>
        </div>
      </div>
    </article>
  )
}
