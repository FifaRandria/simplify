import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
  return { semaine: week, annee: now.getFullYear() }
}

export default async function AgentsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion')

  const { semaine, annee } = getCurrentWeek()

  const agents = await prisma.user.findMany({
    where: { role: 'AGENT' },
    include: {
      saisies: {
        orderBy: [{ annee: 'desc' }, { semaine: 'desc' }],
      },
    },
  })

  const agentsWithStats = agents.map((agent) => {
    const currentWeekSaisie = agent.saisies.find(
      (s) => s.semaine === semaine && s.annee === annee
    )
    const totalSaisies = agent.saisies.length
    const totalPatients = agent.saisies.reduce((s, r) => s + r.patientsVus, 0)
    const lastSaisie = agent.saisies[0] || null

    return {
      ...agent,
      hasSubmittedThisWeek: !!currentWeekSaisie,
      currentWeekSaisie,
      totalSaisies,
      totalPatients,
      lastSaisie,
    }
  })

  const submitted = agentsWithStats.filter((a) => a.hasSubmittedThisWeek)
  const notSubmitted = agentsWithStats.filter((a) => !a.hasSubmittedThisWeek)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Suivi des agents</h1>
        <p className="text-gray-500 mt-1">
          Semaine {semaine} - {annee}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-medium text-amber-800">
          {notSubmitted.length} agent{notSubmitted.length !== 1 ? 's' : ''} n&apos;ont pas encore saisi cette semaine
        </p>
        <p className="text-sm text-amber-600 mt-1">
          {submitted.length} agent{submitted.length !== 1 ? 's' : ''} ont déjà saisi
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          En attente de saisie
        </h2>
        <div className="space-y-3">
          {notSubmitted.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {agent.prenom} {agent.nom}
                </p>
                <p className="text-sm text-gray-500">{agent.zone}</p>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                Pas encore saisi
              </span>
            </div>
          ))}
          {notSubmitted.length === 0 && (
            <p className="text-gray-500 text-center py-8">Tous les agents ont saisi cette semaine ✓</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ont déjà saisi
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Agent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Zone</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Patients</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Consultations</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total saisies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submitted.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {agent.prenom} {agent.nom}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{agent.zone}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {agent.currentWeekSaisie?.patientsVus ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {agent.currentWeekSaisie?.consultations ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">{agent.totalSaisies}</td>
                </tr>
              ))}
              {submitted.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun agent n&apos;a encore saisi cette semaine
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
