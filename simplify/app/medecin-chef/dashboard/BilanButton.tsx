'use client'

import { useRouter } from 'next/navigation'

export default function BilanButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/medecin-chef/rapports')}
      className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
    >
      Bilan
    </button>
  )
}
