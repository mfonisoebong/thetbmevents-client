'use client'

import React, { useEffect } from 'react'
import type { ReactElement } from 'react'

export default function Index(): ReactElement {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const applyPreference = (isDark: boolean) => {
      if (isDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }

    try {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      applyPreference(mql.matches)
      const listener = (e: MediaQueryListEvent) => applyPreference(e.matches)
      // Older browsers use addListener; modern use addEventListener
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', listener)
        return () => mql.removeEventListener('change', listener)
      } else if (typeof mql.addListener === 'function') {
        // @ts-ignore -- legacy API
        mql.addListener(listener)
        // cleanup
        return () => mql.removeListener(listener)
      }
    } catch (err) {
      // no-op
    }
  }, [])

  return (
    <>
      <nav className="relative z-10 w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img alt="TBM Events Logo" className="h-8 w-auto" src="/img/tbm-logo.png" />
        </div>
        <div className="flex items-center gap-6">
          <a className="group flex items-center gap-1 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors" href="#">
            Explore Events
            <span className="material-icons-outlined text-sm transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200">north_east</span>
          </a>
          <button className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <h2 className="text-2xl font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              tbm
              <span className="text-[#FBBC05] text-xl">✦</span>
            </h2>
          </div>
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Delightful <br className="hidden sm:block"/>
            events
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E8B025] to-[#4F8A92] text-gradient-animate"> start here.</span>
          </h1>
          <p className="sm:text-2xl text-text-muted-light dark:text-text-muted-dark mb-10 max-w-2xl leading-relaxed font-light">
            Set up an event page, invite friends and sell tickets. Host a memorable event today.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button
                className="bg-[#1C1C1C] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Create Your First Event
            </button>
            <button
                className="px-6 py-4 rounded-xl text-text-muted-light dark:text-text-muted-dark font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined">play_circle</span>
              See how it works
            </button>
          </div>
        </div>

        <div className="hidden lg:block absolute top-32 right-0 w-[400px] h-[500px]">
          <div
              className="absolute top-10 right-10 w-64 h-80 bg-white/40 dark:bg-surface-dark/40 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-md rotate-6 transform transition hover:rotate-0 duration-500 z-10 flex flex-col p-4">
            <div
                className="w-full h-32 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-900 mb-4 overflow-hidden relative">
              <img
                alt="Event preview"
                className="object-cover w-full h-full mix-blend-overlay opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA33vd_mmN6utK5PJl_Yiy83qGma9dWOzp2F_ciYKdXVmWdG_kdctF3rgsi3ASZ8b1NOQOQ2D671wYVj7hFNPEbnxM_S_gbBtx1AudVJCEMgHG1kLG9uju2NMHFfbTVukhDUYmzCWJ9fyMb-k_aQu9vZGz7-Re2iNG5NariWLspSjhXF4sjOd5xpjWkn4Sc3jlcP8JJP6JuJnXcgn-18TyipGRKDJ6-QzMl0BHjPZUjmWmt4UmKu7JSo6MJxDi7P9dD2tPHnm96jX0"
              />
            </div>
            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full mb-2"></div>
            <div className="h-2 w-32 bg-gray-200 dark:bg-gray-600 rounded-full mb-4"></div>
            <div className="mt-auto flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">Going</div>
            </div>
          </div>
          <div className="absolute top-40 right-48 w-64 h-80 bg-white/60 dark:bg-surface-dark/60 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl backdrop-blur-lg -rotate-3 transform transition hover:rotate-0 duration-500 z-20 flex flex-col p-4">
            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-[#E8B025] to-[#4F8A92] mb-4 overflow-hidden relative">
              <div className="absolute top-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Nov 24</div>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Product Launch</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">San Francisco, CA</p>
            <div className="mt-auto">
              <button className="w-full py-2 rounded-lg bg-black text-white text-xs font-medium">Get Tickets</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
          <p>© {new Date().getFullYear()} TBM Events Ltd.</p>
          <div className="flex gap-6">
            <a className="hover:text-text-light dark:hover:text-white transition-colors" href="https://x.com/EventwithTBM" target="_blank">Twitter</a>
            <a className="hover:text-text-light dark:hover:text-white transition-colors" href="https://www.instagram.com/eventswithtbm" target="_blank">Instagram</a>
            <a className="hover:text-text-light dark:hover:text-white transition-colors" href="#">Terms</a>
            <a className="hover:text-text-light dark:hover:text-white transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-pink-100/40 dark:bg-purple-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
      </div>
    </>
  )
}
