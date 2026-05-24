'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

const links = [
  { href: '/agent/dashboard', label: 'Vue ensemble' },
  { href: '/agent/saisie', label: 'Saisie' },
  { href: '/agent/historique', label: 'Historique' },
]

export default function AgentNav({ user }: { user: Session['user'] }) {
  const path = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/agent/dashboard" className="flex items-center gap-2.5">
            <div className="size-7 bg-teal-600 rounded flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold text-gray-900">Simplify</span>
          </Link>
          <nav className="flex items-center gap-1">
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
          <div className="text-right">
            <p className="text-sm text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400">Agent</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}
