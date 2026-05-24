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

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 px-4">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
              S
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-gray-900">Simplify</span>
              <p className="text-xs text-gray-400">Santé Madagascar</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="size-5 rounded-full bg-red-100 flex items-center justify-center text-xs shrink-0">!</span>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                placeholder="vous@centresante.mg"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Comptes de démonstration disponibles sur la{" "}
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                page d&apos;accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
