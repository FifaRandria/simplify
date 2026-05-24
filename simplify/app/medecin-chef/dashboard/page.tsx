import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import MedecinChefDashboardClient from '@/app/components/MedecinChefDashboardClient'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
  return { semaine: week, annee: now.getFullYear() }
}

function getCurrentPeriod() {
  const now = new Date()
  const month = now.toLocaleString('fr-FR', { month: 'long' })
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${now.getFullYear()}`
}

export default async function MedecinChefDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion')

  const { semaine, annee } = getCurrentWeek()

  const agentUsers = await prisma.user.findMany({
    where: { role: 'AGENT' },
    orderBy: { nom: 'asc' },
  })

  const agentsWithSaisies = await Promise.all(
    agentUsers.map(async (agent) => {
      const saisies = await prisma.saisie.findMany({
        where: { userId: agent.id },
        orderBy: [{ annee: 'desc' }, { semaine: 'desc' }],
      })
      return { agent, saisies }
    })
  )

  const allSaisies = agentsWithSaisies.flatMap((a) => a.saisies)

  const globalTotals = {
    totalPatients: allSaisies.reduce((s, r) => s + r.patientsVus, 0),
    totalConsultations: allSaisies.reduce((s, r) => s + r.consultations, 0),
    totalVaccinations: allSaisies.reduce((s, r) => s + r.vaccinations, 0),
    totalUrgents: allSaisies.reduce((s, r) => s + r.casUrgents, 0),
    totalSaisies: allSaisies.length,
  }

  const period = getCurrentPeriod()

  return (
    <MedecinChefDashboardClient
      agents={agentsWithSaisies.map(({ agent, saisies }) => ({
        agent,
        saisies: saisies.map((s) => ({
          id: s.id,
          userId: s.userId,
          semaine: s.semaine,
          annee: s.annee,
          patientsVus: s.patientsVus,
          consultations: s.consultations,
          vaccinations: s.vaccinations,
          casUrgents: s.casUrgents,
          maladiesFrequentes: s.maladiesFrequentes,
          problemesTerrain: s.problemesTerrain,
        })),
      }))}
      currentWeek={semaine}
      currentYear={annee}
      period={period}
      globalTotals={globalTotals}
    />
  )
}
