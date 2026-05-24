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
    return {
      ...agent,
      hasSubmittedThisWeek: !!currentWeekSaisie,
      currentWeekSaisie,
      totalSaisies: agent.saisies.length,
      totalPatients: agent.saisies.reduce((s, r) => s + r.patientsVus, 0),
      lastSaisie: agent.saisies[0] || null,
    }
  })

  const submitted = agentsWithStats.filter((a) => a.hasSubmittedThisWeek)
  const notSubmitted = agentsWithStats.filter((a) => !a.hasSubmittedThisWeek)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Agents</h1>
        <p className="text-sm text-gray-500 mt-1">Semaine {semaine} — {annee}</p>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        <span className="font-medium">{notSubmitted.length}</span> agent{notSubmitted.length !== 1 ? 's' : ''} n&apos;ont pas saisi
        <span className="text-amber-500 mx-1">·</span>
        <span className="font-medium">{submitted.length}</span> ont saisi
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">En attente</h2>
        {notSubmitted.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Tous les agents ont saisi cette semaine</p>
        ) : (
          <div className="space-y-1">
            {notSubmitted.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{agent.prenom} {agent.nom}</p>
                  <p className="text-xs text-gray-400">{agent.zone}</p>
                </div>
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium">Pas saisi</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Ont saisi</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Consult.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total saisies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submitted.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{agent.prenom} {agent.nom}</td>
                  <td className="px-4 py-3 text-gray-600">{agent.zone}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{agent.currentWeekSaisie?.patientsVus ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{agent.currentWeekSaisie?.consultations ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{agent.totalSaisies}</td>
                </tr>
              ))}
              {submitted.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-gray-400">Aucun agent n&apos;a saisi cette semaine</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
