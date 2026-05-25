import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import GenerateRapport from './GenerateRapport'
import { FileText, Download } from '@/app/components/Icons'

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
          <h1 className="text-xl font-semibold text-gray-900">Rapports</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rapports.length} rapport{rapports.length !== 1 ? 's' : ''}
          </p>
        </div>
        <GenerateRapport />
      </div>

      {rapports.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 rounded-lg bg-white">
          <FileText className="size-10 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-1">Aucun rapport</p>
          <p className="text-xs text-gray-400">Cliquez sur &quot;Générer un rapport&quot; pour créer le premier</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rapports.map((rapport) => {
            const d = rapport.donneesJson as Record<string, any>

            return (
              <div key={rapport.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-primary shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Rapport — {rapport.periode}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {new Date(rapport.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/rapport-pdf?id=${rapport.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Download className="size-3.5" />
                    PDF
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {[
                    { label: 'Patients', value: d?.totalPatients ?? '—' },
                    { label: 'Consultations', value: d?.totalConsultations ?? '—' },
                    { label: 'Vaccinations', value: d?.totalVaccinations ?? '—' },
                    { label: 'Urgents', value: d?.totalCasUrgents ?? '—' },
                    { label: 'Agents', value: `${d?.agentsAyantSaisi ?? '—'}/${d?.totalAgents ?? '—'}` },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded px-3 py-2">
                      <p className="text-gray-500">{item.label}</p>
                      <p className="font-semibold text-gray-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {rapport.resumeIA && (
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Résumé IA</p>
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
