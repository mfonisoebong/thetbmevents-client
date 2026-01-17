'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function NavBar(): JSX.Element {
  const [showBorder, setShowBorder] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    lastY.current = window.scrollY || 0

    const onScroll = () => {
      const y = window.scrollY || 0
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (y <= 2) {
            setShowBorder(false)
            lastY.current = y
            ticking.current = false
            return
          }
          setShowBorder(true)
          lastY.current = y
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all ${showBorder ? 'dark:border-gray-800' : ''}`}>
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <img alt="TBM Events Logo" className="h-8 w-auto" src="/images/tbm-logo.png" />
        </Link>
        <div className="flex items-center gap-6">
          <Link className="group flex items-center gap-1 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors" href="/explore">
            Explore Events
            <span className="material-icons-outlined text-sm transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200">north_east</span>
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
