'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md mx-8 mt-4 rounded-3xl shadow-lg'
          : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-semibold text-base transition-colors duration-300 ${
            scrolled ? 'text-gray-900' : 'text-white'
          }`}>
            Simplify
          </span>
        </div>
        <nav className={`hidden md:flex items-center gap-8 text-sm transition-colors duration-300 ${
          scrolled ? 'text-gray-700' : 'text-white'
        }`}>
          <a href="#benefits" className={`transition-colors ${
            scrolled ? 'hover:text-gray-900' : 'hover:text-gray-300'
          }`}>Pourquoi</a>
          <a href="#stats" className={`transition-colors ${
            scrolled ? 'hover:text-gray-900' : 'hover:text-gray-300'
          }`}>Chiffres</a>
          <a href="#demo" className={`transition-colors ${
            scrolled ? 'hover:text-gray-900' : 'hover:text-gray-300'
          }`}>Démo</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/connexion"
            className="bg-primary hover:bg-primary-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            Connexion
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`md:hidden size-8 flex items-center justify-center rounded transition-colors ${
              scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className={`size-5 transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`size-5 transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className={`md:hidden px-4 py-3 space-y-1 transition-colors duration-300 rounded-b-xl ${
          scrolled ? '' : 'border-t border-white/20'
        }`}>
          <a
            href="#benefits"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              scrolled
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Pourquoi
          </a>
          <a
            href="#stats"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              scrolled
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Chiffres
          </a>
          <a
            href="#demo"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              scrolled
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Démo
          </a>
        </div>
      )}
    </header>
  )
}
