'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

const links = [
  { href: '/medecin-chef/dashboard', label: 'Vue ensemble' },
  { href: '/medecin-chef/agents', label: 'Agents' },
  { href: '/medecin-chef/rapports', label: 'Rapports' },
]

export default function MedecinChefNav({ user }: { user: Session['user'] }) {
  const path = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/medecin-chef/dashboard"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="size-7 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold text-gray-900">Simplify</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  path === l.href
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400">Médecin Chef</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="hidden sm:block text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Déconnexion
          </button>
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
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                path === l.href
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100">
            <p className="text-sm text-gray-900 px-3">{user?.name}</p>
            <p className="text-xs text-gray-400 px-3">Médecin Chef</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  )
}
