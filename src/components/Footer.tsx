import React from 'react'

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 py-8 text-sm text-text-muted-light dark:text-text-muted-dark border-t border-gray-200 dark:border-gray-800 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} TBM Events Ltd.</p>
        <div className="flex gap-6">
          <a className="hover:text-text-light dark:hover:text-white transition-colors" href="https://x.com/EventwithTBM" target="_blank" rel="noreferrer">Twitter</a>
          <a className="hover:text-text-light dark:hover:text-white transition-colors" href="https://www.instagram.com/eventswithtbm" target="_blank" rel="noreferrer">Instagram</a>
          <a className="hover:text-text-light dark:hover:text-white transition-colors" href="#">Terms</a>
          <a className="hover:text-text-light dark:hover:text-white transition-colors" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
