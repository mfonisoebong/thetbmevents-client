// Explanation: New client component that contains all client-side hooks and UI previously in app/explore/page.tsx
'use client'

import React, { useMemo, useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import SearchBar from '../../../components/explore/SearchBar'
import CategoryPills from '../../../components/explore/CategoryPills'
import EventCard from '../../../components/explore/EventCard'
import { events as mockEvents, categories as mockCategories } from '@lib/mockEvents'
import type { EventItem } from '../../../types'

export default function Explore(): ReactElement {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // Debounced search state
  const [debounced, setDebounced] = useState(query)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return mockEvents.filter((e: EventItem) => {
      if (selectedCategory && selectedCategory !== 'All') {
        if (e.category !== selectedCategory) return false
      }
      if (!q) return true
      const hay = `${e.title} ${e.description ?? ''} ${e.location ?? ''} ${(e.tags ?? []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [debounced, selectedCategory])

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Discover events</h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">Find experiences nearby or online — search and pick a category.</p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-6">
            <h4 className="text-sm font-semibold dark:text-white mb-3">Categories</h4>
            <CategoryPills categories={mockCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Events</h3>
            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{filtered.length} results</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="lg:col-span-3 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <h4 className="text-lg font-semibold dark:text-white">No events found</h4>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Try adjusting your search or choose a different category.</p>
              </div>
            ) : (
              filtered.map((ev: EventItem) => (
                <EventCard key={ev.id} event={ev} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
