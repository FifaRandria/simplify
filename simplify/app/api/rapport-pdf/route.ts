import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/app/lib/prisma'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const rapportId = searchParams.get('id')

  let rapport
  if (rapportId) {
    rapport = await prisma.rapport.findUnique({
      where: { id: rapportId },
    })
    if (!rapport) {
      return NextResponse.json({ error: 'Rapport introuvable' }, { status: 404 })
    }
  } else {
    const latestSaisie = await prisma.saisie.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    const refDate = latestSaisie?.createdAt || new Date()
    const monthName = refDate.toLocaleString('fr-FR', { month: 'long' })
    const periode = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${refDate.getFullYear()}`

    const startOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1)
    const endOfMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0, 23, 59, 59)

    const saisies = await prisma.saisie.findMany({
      where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
      include: { user: true },
    })

    const agents = await prisma.user.findMany({ where: { role: 'AGENT' } })

    const donneesJson = {
      periode,
      totalPatients: saisies.reduce((s, r) => s + r.patientsVus, 0),
      totalConsultations: saisies.reduce((s, r) => s + r.consultations, 0),
      totalVaccinations: saisies.reduce((s, r) => s + r.vaccinations, 0),
      totalCasUrgents: saisies.reduce((s, r) => s + r.casUrgents, 0),
      agentsAyantSaisi: new Set(saisies.map((s) => s.userId)).size,
      totalAgents: agents.length,
    }

    rapport = {
      id: 'temp',
      userId: session.user.id,
      periode,
      resumeIA: '',
      pdfUrl: null,
      donneesJson,
      createdAt: new Date(),
    }
  }

  const donnees = rapport.donneesJson as Record<string, any>

  const doc = new jsPDF('p', 'mm', 'a4')
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()

  // Couverture
  doc.setFillColor(13, 148, 136)
  doc.rect(0, 0, pw, 70, 'F')
  doc.setFillColor(15, 118, 110)
  doc.rect(0, 70, pw, 4, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.text('Simplify', pw / 2, 30, { align: 'center' })
  doc.setFontSize(13)
  doc.text('Rapport sanitaire', pw / 2, 46, { align: 'center' })
  doc.setFontSize(10)
  doc.text(rapport.periode, pw / 2, 58, { align: 'center' })

  // Contenu
  doc.setTextColor(31, 41, 55)
  let y = 90

  // ===== Indicateurs =====
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Indicateurs clés', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 10

  ;(doc as any).autoTable({
    startY: y,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['Patients vus', String(donnees.totalPatients ?? '—')],
      ['Consultations', String(donnees.totalConsultations ?? '—')],
      ['Vaccinations', String(donnees.totalVaccinations ?? '—')],
      ['Cas urgents', String(donnees.totalCasUrgents ?? '—')],
      ['Agents actifs', `${donnees.agentsAyantSaisi ?? '—'}/${donnees.totalAgents ?? '—'}`],
    ],
    theme: 'plain',
    headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 10, lineColor: [229, 231, 235], lineWidth: 0.5 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 20, right: 20 },
  })

  y = (doc as any).lastAutoTable.finalY + 15

  // ===== Tableau agents =====
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Données par agent', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 10

  const refDate2 = (() => {
    if (rapportId && rapport?.createdAt) return rapport.createdAt
    const ls = prisma.saisie.findFirst({ orderBy: { createdAt: 'desc' } })
    return new Date()
  })()

  const latestSaisie = await prisma.saisie.findFirst({ orderBy: { createdAt: 'desc' } })
  const refForAgents = latestSaisie?.createdAt || new Date()

  const startM = new Date(refForAgents.getFullYear(), refForAgents.getMonth(), 1)
  const endM = new Date(refForAgents.getFullYear(), refForAgents.getMonth() + 1, 0, 23, 59, 59)

  const saisiesData = await prisma.saisie.findMany({
    where: { createdAt: { gte: startM, lte: endM } },
    include: { user: true },
    orderBy: { user: { nom: 'asc' } },
  })

  ;(doc as any).autoTable({
    startY: y,
    head: [['Agent', 'Zone', 'Patients', 'Consultations', 'Vaccinations']],
    body: saisiesData.map((s) => [
      `${s.user.prenom} ${s.user.nom}`,
      s.zone,
      String(s.patientsVus),
      String(s.consultations),
      String(s.vaccinations),
    ]),
    theme: 'plain',
    headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, lineColor: [229, 231, 235], lineWidth: 0.5 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 20, right: 20 },
  })

  y = (doc as any).lastAutoTable.finalY + 15

  // ===== Résumé IA =====
  if (rapport.resumeIA && rapport.resumeIA.length > 0) {
    if (y > ph - 60) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Résumé IA', 20, y)
    doc.setFont('helvetica', 'normal')
    y += 10
    doc.setFontSize(10)
    doc.setTextColor(75, 85, 99)
    const lines = doc.splitTextToSize(rapport.resumeIA, pw - 40)
    doc.text(lines, 20, y)
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Simplify · ${rapport.periode} · Page ${i}/${totalPages}`,
      pw / 2,
      ph - 15,
      { align: 'center' }
    )
  }

  const pdfData = doc.output('arraybuffer')
  const filename = `rapport-${rapport.periode
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()}.pdf`

  return new NextResponse(pdfData, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
