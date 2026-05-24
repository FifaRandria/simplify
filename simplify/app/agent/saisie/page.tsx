'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function SaisiePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const data = {
      patientsVus: parseInt(form.get('patientsVus') as string),
      consultations: parseInt(form.get('consultations') as string),
      vaccinations: parseInt(form.get('vaccinations') as string),
      casUrgents: parseInt(form.get('casUrgents') as string),
      maladiesFrequentes: (form.get('maladiesFrequentes') as string)
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
      problemesTerrain: form.get('problemesTerrain') as string || null,
      commentaire: form.get('commentaire') as string || null,
    }

    try {
      const res = await fetch('/api/bilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erreur lors de la saisie')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/agent/dashboard')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-20">
        <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Saisie enregistrée !</h2>
        <p className="text-gray-500 mt-2">Redirection vers le tableau de bord...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Saisie hebdomadaire</h1>
      <p className="text-gray-500 mb-8">
        Zone : {session?.user?.zone || 'Non assignée'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Patients vus
            </label>
            <input
              name="patientsVus"
              type="number"
              min="0"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Consultations
            </label>
            <input
              name="consultations"
              type="number"
              min="0"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vaccinations
            </label>
            <input
              name="vaccinations"
              type="number"
              min="0"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cas urgents
            </label>
            <input
              name="casUrgents"
              type="number"
              min="0"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Maladies fréquentes
          </label>
          <input
            name="maladiesFrequentes"
            type="text"
            required
            placeholder="Paludisme, Diarrhée, IRA (séparées par des virgules)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Séparez les maladies par des virgules</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Problèmes terrain (optionnel)
          </label>
          <textarea
            name="problemesTerrain"
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder="Manque de médicaments, problèmes d'accès..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Commentaire (optionnel)
          </label>
          <textarea
            name="commentaire"
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer la saisie'}
        </button>
      </form>
    </div>
  )
}
