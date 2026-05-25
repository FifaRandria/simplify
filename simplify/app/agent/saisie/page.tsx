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
      maladiesFrequentes: (form.get('maladiesFrequentes') as string).split(',').map((m) => m.trim()).filter(Boolean),
      problemesTerrain: (form.get('problemesTerrain') as string) || null,
      commentaire: (form.get('commentaire') as string) || null,
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
      <div className="text-center py-24">
        <div className="size-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4 border border-primary-200">
          <span className="text-lg text-primary">✓</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Saisie enregistrée</h2>
        <p className="text-sm text-gray-500 mt-1">Redirection...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Saisie hebdomadaire</h1>
      <p className="text-sm text-gray-500 mb-8">Zone&nbsp;: {session?.user?.zone || 'Non assignée'}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2.5">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'patientsVus', label: 'Patients vus' },
            { name: 'consultations', label: 'Consultations' },
            { name: 'vaccinations', label: 'Vaccinations' },
            { name: 'casUrgents', label: 'Cas urgents' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                name={f.name}
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Maladies fréquentes</label>
          <input
            name="maladiesFrequentes"
            type="text"
            required
            placeholder="Paludisme, Diarrhée, IRA"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Séparées par des virgules</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Problèmes terrain <span className="text-gray-400 font-normal">(optionnel)</span></label>
          <textarea
            name="problemesTerrain"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Commentaire <span className="text-gray-400 font-normal">(optionnel)</span></label>
          <textarea
            name="commentaire"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
