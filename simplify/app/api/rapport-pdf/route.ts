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
    const now = new Date()
    const monthName = now.toLocaleString('fr-FR', { month: 'long' })
    const periode = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${now.getFullYear()}`

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

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
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(5, 150, 105)
  doc.rect(0, 0, pageWidth, 60, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.text('Simplify', pageWidth / 2, 30, { align: 'center' })

  doc.setFontSize(12)
  doc.text('Rapport sanitaire - Madagascar', pageWidth / 2, 44, { align: 'center' })

  doc.setFontSize(10)
  doc.text(rapport.periode, pageWidth / 2, 54, { align: 'center' })

  doc.setTextColor(0, 0, 0)

  let yPos = 75

  doc.setFontSize(16)
  doc.text('Indicateurs clés', 20, yPos)
  yPos += 12

  const indicators = [
    ['Patients vus', String(donnees.totalPatients || 'N/A')],
    ['Consultations', String(donnees.totalConsultations || 'N/A')],
    ['Vaccinations', String(donnees.totalVaccinations || 'N/A')],
    ['Cas urgents', String(donnees.totalCasUrgents || 'N/A')],
    ['Agents actifs', `${donnees.agentsAyantSaisi || 'N/A'}/${donnees.totalAgents || 'N/A'}`],
  ]

  ;(doc as any).autoTable({
    startY: yPos,
    head: [['Indicateur', 'Valeur']],
    body: indicators,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  doc.setFontSize(16)
  doc.text('Rapport par agent', 20, yPos)
  yPos += 12

  const saisiesData = await prisma.saisie.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59),
      },
    },
    include: { user: true },
    orderBy: { user: { nom: 'asc' } },
  })

  const agentRows = saisiesData.map((s) => [
    `${s.user.prenom} ${s.user.nom}`,
    s.zone,
    String(s.patientsVus),
    String(s.consultations),
    String(s.vaccinations),
  ])

  ;(doc as any).autoTable({
    startY: yPos,
    head: [['Agent', 'Zone', 'Patients', 'Consultations', 'Vaccinations']],
    body: agentRows,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105] },
    styles: { fontSize: 8 },
    margin: { left: 20, right: 20 },
  })

  if (rapport.resumeIA) {
    yPos = (doc as any).lastAutoTable.finalY + 15

    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(16)
    doc.text('Résumé IA', 20, yPos)
    yPos += 12

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(rapport.resumeIA, pageWidth - 40)
    doc.text(lines, 20, yPos)
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rapport-${rapport.periode.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
    },
  })
}
