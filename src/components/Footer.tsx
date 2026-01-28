import React from 'react'
import Link from "next/link";

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 py-8 text-sm text-text-muted-light dark:text-text-muted-dark border-t border-gray-200 dark:border-gray-800 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} TBM Events Ltd.</p>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <div className="flex gap-6">
            <Link className="hover:text-text-light dark:hover:text-white transition-colors" href="https://x.com/EventwithTBM" target="_blank" rel="noreferrer">Twitter</Link>
            <Link className="hover:text-text-light dark:hover:text-white transition-colors" href="https://www.instagram.com/eventswithtbm" target="_blank" rel="noreferrer">Instagram</Link>
            <Link className="hover:text-text-light dark:hover:text-white transition-colors" href="/terms">Terms</Link>
            <Link className="hover:text-text-light dark:hover:text-white transition-colors" href="/privacy">Privacy</Link>
          </div>
        </div>

        <p className="text-center">
          Like the website?{' '}
          <Link
              className="hover:text-text-light dark:hover:text-white transition-colors underline underline-offset-4"
              href="https://wa.link/mfm7ht"
              target="_blank"
              rel="noreferrer"
          >
            Contact the developer
          </Link>
        </p>
      </div>
    </footer>
  )
}
