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
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Historique</h1>
      <p className="text-sm text-gray-500 mb-8">{saisies.length} saisie{saisies.length !== 1 ? 's' : ''}</p>

      {saisies.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 rounded-lg bg-white">
          <p className="text-sm text-gray-400">Aucune saisie pour le moment</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Semaine</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Consult.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vacc.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Urgents</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Maladies</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Problèmes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {saisies.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="font-medium text-gray-900">S{s.semaine}</span>
                      <span className="text-gray-400 ml-2 text-xs">{s.annee}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{s.patientsVus}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{s.consultations}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{s.vaccinations}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{s.casUrgents}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-40 truncate">{s.maladiesFrequentes.join(', ')}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-40 truncate">{s.problemesTerrain || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
