'use client'

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactElement } from 'react'
import SearchBar from '../../../components/explore/SearchBar'
import CategoryPills from '../../../components/explore/CategoryPills'
import EventCard from '../../../components/explore/EventCard'
import EventsGridShimmer from '../../../components/explore/EventsGridShimmer'
import { categories as mockCategories } from '@lib/mockEvents'
import type { ApiData, EventItem } from '@lib/types'
import HTTP from '@lib/HTTP'
import {cn, getEndpoint, getErrorMessage} from '@lib/utils'

type EventsApiResponse = ApiData<EventItem[]> | EventItem[]

export default function Explore(): ReactElement {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const requestIdRef = useRef(0)

  const [debounced, setDebounced] = useState(query)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250)

    return () => clearTimeout(t)
  }, [query])

  const fetchEvents = useCallback(async (category?: string) => {
    const isAll = !category || category === 'All'
    const endpoint = isAll ? '/events' : `/events/${encodeURIComponent(category)}`

    const requestId = ++requestIdRef.current

    setLoading(true)
    setError(null)

    const resp = await HTTP<EventsApiResponse, undefined>({ url: getEndpoint(endpoint), method: 'get' })

    // Ignore stale responses (fast category switching)
    if (requestId !== requestIdRef.current) return

    if (!resp.ok || !resp.data) {
      setEvents([])
      setError(getErrorMessage(resp.error))
      setLoading(false)
      return
    }

    const data = resp.data as EventsApiResponse
    const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []

    setEvents(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEvents(selectedCategory)
  }, [fetchEvents, selectedCategory, reloadToken])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()

    const normalizeCategory = (v?: string | null) =>
      (v ?? '')
        .trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const selectedNorm = normalizeCategory(selectedCategory)

    return events.filter((e: EventItem) => {
      // Support partial matches: "club" should match "club event" / "club party".
      // Also avoid strict mismatch filtering when server returns a different representation.
      if (selectedCategory && selectedCategory !== 'All' && selectedNorm) {
        const eventNorm = normalizeCategory(e.category)
        // If category is missing on the event, don't hide it.
        if (eventNorm && !eventNorm.includes(selectedNorm)) return false
      }

      if (!q) return true

      const hay = `${e.title} ${e.description ?? ''} ${e.location ?? ''} ${(e.tags ?? []).join(' ')}`.toLowerCase()

      return hay.includes(q)
    })
  }, [debounced, selectedCategory, events])

  const categories = useMemo(() => {
    // Keep current pill list. If you later add a categories endpoint, swap this.
    return mockCategories
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Discover events</h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">
            Find experiences nearby or online — search and pick a category.
          </p>
        </div>

        {/*todo: search functionality can be improved*/}
        <div className="w-full md:w-96">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-6">
            <h4 className="text-sm font-semibold dark:text-white mb-3">Categories</h4>
            <CategoryPills categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Events</h3>
            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {loading ? 'Loading…' : `${filtered.length} results`}
            </div>
          </div>

          {error ? (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-red-700 dark:text-red-200">Couldn’t load events</div>
                  <div className="text-sm text-red-700/80 dark:text-red-200/80 mt-1">{error}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setReloadToken((t) => t + 1)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <EventsGridShimmer />
          ) : (
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", filtered.length === 0 ? '!grid-cols-1' : '')}>
              {filtered.length === 0 ? (
                <div className="lg:col-span-3 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                  <h4 className="text-lg font-semibold dark:text-white">No events found</h4>
                  <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
                    Try adjusting your search or choose a different category.
                  </p>
                </div>
              ) : (
                filtered.map((ev: EventItem) => <EventCard key={ev.id} event={ev} />)
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
