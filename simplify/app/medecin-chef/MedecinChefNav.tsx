'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

const navItems = [
  { href: '/medecin-chef/dashboard', label: 'Tableau de bord' },
  { href: '/medecin-chef/agents', label: 'Agents' },
  { href: '/medecin-chef/rapports', label: 'Rapports' },
]

export default function MedecinChefNav({ user }: { user: Session['user'] }) {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/medecin-chef/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-gray-900">Simplify</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">Médecin Chef</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}
