import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'

export default async function HistoriquePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion')

  const saisies = await prisma.saisie.findMany({
    where: { userId: session.user.id },
    orderBy: [{ annee: 'desc' }, { semaine: 'desc' }],
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des saisies</h1>
      <p className="text-gray-500 mb-8">
        {saisies.length} saisie{saisies.length !== 1 ? 's' : ''} au total
      </p>

      {saisies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Aucune saisie pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Période</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Patients</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Consultations</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Vaccinations</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Urgents</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Maladies</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Problèmes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {saisies.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    S{s.semaine} - {s.annee}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">{s.patientsVus}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{s.consultations}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{s.vaccinations}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{s.casUrgents}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {s.maladiesFrequentes.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {s.problemesTerrain || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
