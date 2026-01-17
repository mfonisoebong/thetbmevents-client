'use client'

import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <label htmlFor="explore-search" className="sr-only">Search events</label>
      <div className="relative">
        <input
          id="explore-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search events, locations, or tags"
          className="w-full bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
          aria-label="Search events"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-icons-outlined">search</span>
      </div>
    </div>
  )
}
