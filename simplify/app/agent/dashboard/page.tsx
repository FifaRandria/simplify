import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import AgentDashboardClient from '@/app/components/AgentDashboardClient'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
  return { semaine: week, annee: now.getFullYear() }
}

export default async function AgentDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/connexion')

  const { semaine, annee } = getCurrentWeek()

  const saisieThisWeek = await prisma.saisie.findUnique({
    where: {
      userId_semaine_annee: {
        userId: session.user.id,
        semaine,
        annee,
      },
    },
  })

  const allSaisies = await prisma.saisie.findMany({
    where: { userId: session.user.id },
    orderBy: [{ annee: 'desc' }, { semaine: 'desc' }],
  })

  return (
    <AgentDashboardClient
      saisies={allSaisies.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      }))}
      currentWeek={semaine}
      currentYear={annee}
      hasSubmittedThisWeek={!!saisieThisWeek}
      currentSaisie={saisieThisWeek ? { ...saisieThisWeek, createdAt: saisieThisWeek.createdAt.toISOString() } : null}
    />
  )
}
