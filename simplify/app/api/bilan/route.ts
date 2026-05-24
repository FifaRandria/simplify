import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'

function getMonthRange(now: Date) {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const monthName = now.toLocaleString('fr-FR', { month: 'long' })
  return {
    start: startOfMonth,
    end: endOfMonth,
    periode: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${now.getFullYear()}`,
  }
}

function getWeekNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  return Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
}

function getWeekRange(now: Date) {
  const weekNum = getWeekNumber(now)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
  const startOfWeek = new Date(now.getFullYear(), 0, 1)
  startOfWeek.setDate(startOfWeek.getDate() + (dayOfYear - startOfYear.getDay() + 1))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59)
  return {
    start: startOfWeek,
    end: endOfWeek,
    periode: `Semaine ${weekNum} - ${now.getFullYear()}`,
    semaine: weekNum,
    annee: now.getFullYear(),
  }
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const periodeType = searchParams.get('periode') || 'mensuelle'
  const now = new Date()

  if (session.user.role === 'MEDECIN_CHEF') {
    const latestSaisie = await prisma.saisie.findFirst({
      orderBy: [{ createdAt: 'desc' }],
    })

    let refDate = now
    if (latestSaisie) {
      refDate = new Date(latestSaisie.createdAt)
    }

    const { start, end, periode } = periodeType === 'hebdomadaire'
      ? getWeekRange(refDate)
      : getMonthRange(refDate)

    const saisies = await prisma.saisie.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: { user: true },
    })

    const agents = await prisma.user.findMany({
      where: { role: 'AGENT' },
    })

    const totalPatients = saisies.reduce((s, r) => s + r.patientsVus, 0)
    const totalConsultations = saisies.reduce((s, r) => s + r.consultations, 0)
    const totalVaccinations = saisies.reduce((s, r) => s + r.vaccinations, 0)
    const totalCasUrgents = saisies.reduce((s, r) => s + r.casUrgents, 0)
    const totalSaisies = saisies.length
    const agentsAyantSaisi = new Set(saisies.map((s) => s.userId)).size

    const tauxConsultations = totalPatients > 0
      ? Math.round((totalConsultations / totalPatients) * 100)
      : 0
    const tauxVaccinations = totalPatients > 0
      ? Math.round((totalVaccinations / totalPatients) * 100)
      : 0
    const tauxUrgents = totalPatients > 0
      ? Math.round((totalCasUrgents / totalPatients) * 100)
      : 0

    const patientsParAgent: Record<string, number> = {}
    for (const s of saisies) {
      const key = `${s.user.prenom} ${s.user.nom}`
      patientsParAgent[key] = (patientsParAgent[key] || 0) + s.patientsVus
    }

    const meilleurAgent = Object.entries(patientsParAgent).sort((a, b) => b[1] - a[1])[0]
    const moinsBonAgent = Object.entries(patientsParAgent).sort((a, b) => a[1] - b[1])[0]

    const maladies: Record<string, number> = {}
    for (const s of saisies) {
      for (const m of s.maladiesFrequentes) {
        maladies[m] = (maladies[m] || 0) + 1
      }
    }
    const maladiePlusFrequente = Object.entries(maladies).sort((a, b) => b[1] - a[1])[0]

    const previousMonth = new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1)
    const prevStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1)
    const prevEnd = new Date(refDate.getFullYear(), refDate.getMonth(), 0, 23, 59, 59)

    const prevSaisies = await prisma.saisie.findMany({
      where: {
        createdAt: { gte: prevStart, lte: prevEnd },
      },
    })
    const prevTotalPatients = prevSaisies.reduce((s, r) => s + r.patientsVus, 0)
    const ecartPatients = prevTotalPatients > 0
      ? Math.round(((totalPatients - prevTotalPatients) / prevTotalPatients) * 100)
      : totalPatients > 0 ? 100 : 0

    const donnees = {
      periode,
      totalPatients,
      totalConsultations,
      totalVaccinations,
      totalCasUrgents,
      totalSaisies,
      agentsAyantSaisi,
      totalAgents: agents.length,
      tauxConsultations,
      tauxVaccinations,
      tauxUrgents,
      moyennePatientsParSaisie: totalSaisies > 0 ? Math.round(totalPatients / totalSaisies) : 0,
      ecartPatients,
      meilleurAgent: meilleurAgent ? meilleurAgent[0] : null,
      moinsBonAgent: moinsBonAgent ? moinsBonAgent[0] : null,
      maladiePlusFrequente: maladiePlusFrequente ? maladiePlusFrequente[0] : null,
    }

    return NextResponse.json({ periode, donnees })
  }

  if (session.user.role === 'AGENT') {
    const weekInfo = getWeekRange(now)
    const saisies = await prisma.saisie.findMany({
      where: {
        userId: session.user.id,
        semaine: weekInfo.semaine,
        annee: weekInfo.annee,
      },
    })

    return NextResponse.json({
      periode: weekInfo.periode,
      donnees: {
        totalPatients: saisies.reduce((s, r) => s + r.patientsVus, 0),
        totalConsultations: saisies.reduce((s, r) => s + r.consultations, 0),
        totalVaccinations: saisies.reduce((s, r) => s + r.vaccinations, 0),
        totalCasUrgents: saisies.reduce((s, r) => s + r.casUrgents, 0),
        totalSaisies: saisies.length,
      },
    })
  }

  return NextResponse.json({ error: 'Rôle non autorisé' }, { status: 403 })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()

  if (body.type === 'rapport') {
    if (session.user.role !== 'MEDECIN_CHEF') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const rapport = await prisma.rapport.create({
      data: {
        userId: session.user.id,
        periode: body.periode,
        resumeIA: body.resumeIA || 'Résumé non disponible',
        donneesJson: body.donneesJson || {},
      },
    })

    return NextResponse.json({ success: true, rapport })
  }

  if (session.user.role !== 'AGENT') {
    return NextResponse.json({ error: 'Seuls les agents peuvent saisir' }, { status: 403 })
  }

  const now = new Date()
  const weekInfo = getWeekRange(now)

  try {
    const saisie = await prisma.saisie.create({
      data: {
        userId: session.user.id,
        semaine: weekInfo.semaine,
        annee: weekInfo.annee,
        zone: session.user.zone || 'Non assignée',
        patientsVus: body.patientsVus,
        consultations: body.consultations,
        vaccinations: body.vaccinations,
        casUrgents: body.casUrgents,
        maladiesFrequentes: body.maladiesFrequentes || [],
        problemesTerrain: body.problemesTerrain || null,
        commentaire: body.commentaire || null,
      },
    })

    return NextResponse.json({ success: true, saisie })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Vous avez déjà saisi vos données cette semaine' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
