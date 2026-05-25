'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function ConnexionPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()

    if (session?.user?.role === 'MEDECIN_CHEF') {
      router.push('/medecin-chef/dashboard')
    } else {
      router.push('/agent/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 parallax"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/images/sary2.jpg)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="size-9 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <span className="text-lg font-semibold text-white">Simplify</span>
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-2xl">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Connexion</h1>
          <p className="text-xs text-gray-500 mb-6">Connectez-vous à votre espace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2.5">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="vous@centresante.mg"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Identifiants de démo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
