'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from '@/app/components/Icons'

export default function GenerateRapport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumeIA, setResumeIA] = useState('')
  const [showResume, setShowResume] = useState(false)
  const [step, setStep] = useState('')
  const [savedDonnees, setSavedDonnees] = useState<any>(null)
  const [savedPeriode, setSavedPeriode] = useState('')
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setResumeIA('')
    setShowResume(false)

    try {
      setStep('Bilan...')
      const bilanRes = await fetch('/api/bilan?periode=mensuelle')
      if (!bilanRes.ok) {
        const txt = await bilanRes.text().catch(() => '')
        throw new Error(`Erreur bilan (${bilanRes.status}): ${txt}`)
      }
      const bilanData = await bilanRes.json()
      setSavedDonnees(bilanData.donnees)
      setSavedPeriode(bilanData.periode)

      const resume = await generateIA(bilanData.donnees)

      setStep('Sauvegarde...')
      await saveRapport(resume)
    } catch (err: any) {
      setError(err.message)
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  async function generateIA(donnees: any): Promise<string> {
    setStep('Résumé IA...')
    const iaRes = await fetch('/api/resume-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donnees }),
    })
    if (!iaRes.ok) {
      const txt = await iaRes.text().catch(() => '')
      throw new Error(`Erreur IA (${iaRes.status}): ${txt}`)
    }
    const iaData = await iaRes.json()
    setResumeIA(iaData.resume)
    setShowResume(true)
    return iaData.resume
  }

  async function regenerateIA() {
    if (!savedDonnees) return
    setError('')
    setLoading(true)
    try {
      await generateIA(savedDonnees)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveRapport(resume?: string) {
    setStep('Sauvegarde...')
    const saveRes = await fetch('/api/bilan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'rapport',
        periode: savedPeriode,
        resumeIA: resume || resumeIA,
        donneesJson: savedDonnees,
      }),
    })
    if (!saveRes.ok) {
      const errData = await saveRes.json().catch(() => ({}))
      throw new Error(errData.message || 'Erreur sauvegarde')
    }
    setStep('')
    router.refresh()
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 inline-flex items-center gap-2"
      >
        <FileText className="size-4" />
        {loading ? step || 'Génération...' : 'Générer un rapport'}
      </button>

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2.5">
          {error}
        </div>
      )}

      {showResume && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Résumé IA</h3>
            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-gray-200">
              {resumeIA}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={async () => {
                  setLoading(true)
                  try {
                    await saveRapport()
                    setShowResume(false)
                  } catch (err: any) {
                    setError(err.message)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Sauvegarde...' : 'Confirmer'}
              </button>
              <button
                onClick={regenerateIA}
                disabled={loading}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors border border-gray-200 disabled:opacity-50"
              >
                Regénérer
              </button>
              <button
                onClick={() => setShowResume(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
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
