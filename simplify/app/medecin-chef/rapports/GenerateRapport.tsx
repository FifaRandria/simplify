'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardIcon } from '@/app/components/Icons'

export default function GenerateRapport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumeIA, setResumeIA] = useState('')
  const [showResume, setShowResume] = useState(false)
  const [step, setStep] = useState('')
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setResumeIA('')
    setShowResume(false)

    try {
      setStep('Calcul du bilan...')
      const bilanRes = await fetch('/api/bilan?periode=mensuelle')
      if (!bilanRes.ok) throw new Error('Erreur lors du calcul du bilan')
      const bilanData = await bilanRes.json()

      setStep('Génération du résumé IA...')
      const iaRes = await fetch('/api/resume-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donnees: bilanData.donnees }),
      })
      if (!iaRes.ok) throw new Error("Erreur lors de la génération du résumé IA")
      const iaData = await iaRes.json()

      setResumeIA(iaData.resume)
      setShowResume(true)

      setStep('Sauvegarde du rapport...')
      const saveRes = await fetch('/api/bilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rapport',
          periode: bilanData.periode,
          resumeIA: iaData.resume,
          donneesJson: bilanData.donnees,
        }),
      })
      if (!saveRes.ok) {
        const errData = await saveRes.json().catch(() => ({}))
        throw new Error(errData.message || "Erreur lors de la sauvegarde du rapport")
      }

      setStep('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
      >
        <ClipboardIcon className="size-4" />
        {loading ? step || 'Génération...' : 'Générer un rapport'}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {showResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
                <ClipboardIcon className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Résumé IA généré</h3>
                <p className="text-sm text-gray-500">Vous pouvez modifier ce texte avant de continuer</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-gray-200">
              {resumeIA}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResume(false)
                  router.refresh()
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md"
              >
                Confirmer et voir le rapport
              </button>
              <button
                onClick={() => setShowResume(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
