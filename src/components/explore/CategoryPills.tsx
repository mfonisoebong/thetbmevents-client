'use client'

import React from 'react'

interface Props {
  categories: string[]
  selected?: string
  onSelect: (c?: string) => void
}

export default function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((c) => {
        const isSelected = selected === c || (selected == null && c === 'All')

        return (
          <button
            key={c}
            onClick={() => onSelect(isSelected ? undefined : c)}
            aria-pressed={isSelected}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-teal ${isSelected ? 'bg-brand-teal text-white shadow-lg' : 'bg-white/60 dark:bg-slate-900/50 text-text-muted-light dark:text-text-muted-dark border border-white/10'}`}>
            {c}
          </button>
        )
      })}
    </div>
  )
}
