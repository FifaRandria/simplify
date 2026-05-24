'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-teal-600 rounded flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <span className="font-semibold text-base">Simplify</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#benefits" className="hover:text-gray-900 transition-colors">Pourquoi</a>
          <a href="#stats" className="hover:text-gray-900 transition-colors">Chiffres</a>
          <a href="#demo" className="hover:text-gray-900 transition-colors">Démo</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/connexion"
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            Connexion
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden size-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-1">
          <a
            href="#benefits"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Pourquoi
          </a>
          <a
            href="#stats"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Chiffres
          </a>
          <a
            href="#demo"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Démo
          </a>
        </div>
      )}
    </header>
  )
}
