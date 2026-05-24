'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BilanButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    router.push('/medecin-chef/rapports')
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Génération...' : 'Générer le bilan'}
    </button>
  )
}
