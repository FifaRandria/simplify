import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import GenerateRapport from './GenerateRapport'
import { ClipboardIcon, TrendingUpIcon } from '@/app/components/Icons'

export default async function RapportsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion')

  const rapports = await prisma.rapport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-500 mt-1">
            {rapports.length} rapport{rapports.length !== 1 ? 's' : ''} généré{rapports.length !== 1 ? 's' : ''}
          </p>
        </div>
        <GenerateRapport />
      </div>

      {rapports.length === 0 ? (
        <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 bg-emerald-50 rounded-full blur-3xl" />
          <div className="relative">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mx-auto mb-6 border border-emerald-200">
              <ClipboardIcon className="size-10 text-emerald-400" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">Aucun rapport généré</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Cliquez sur &quot;Générer un rapport&quot; pour créer votre premier bilan automatisé avec résumé IA
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {rapports.map((rapport) => {
            const donnees = rapport.donneesJson as Record<string, any>

            return (
              <div
                key={rapport.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <TrendingUpIcon className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Rapport - {rapport.periode}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(rapport.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/rapport-pdf?id=${rapport.id}`}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Télécharger PDF
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Patients vus', value: donnees?.totalPatients ?? '-' },
                    { label: 'Consultations', value: donnees?.totalConsultations ?? '-' },
                    { label: 'Vaccinations', value: donnees?.totalVaccinations ?? '-' },
                    { label: 'Cas urgents', value: donnees?.totalCasUrgents ?? '-' },
                    { label: 'Agents', value: `${donnees?.agentsAyantSaisi ?? '-'}/${donnees?.totalAgents ?? '-'}` },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {rapport.resumeIA && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Résumé IA</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {rapport.resumeIA}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
